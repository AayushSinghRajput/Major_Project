import os
import json
import re
import logging
from typing import Dict, Any

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm


# ---------------------------
# Logging
# ---------------------------
logger = logging.getLogger(__name__)

# ---------------------------
# In-memory PDF cache
# ---------------------------
_pdf_cache: Dict[str, Any] = {}


# ---------------------------
# PDF Helpers
# ---------------------------
def load_pdf_docs(pdf_path: str):
    """Load and cache PDF documents."""
    if pdf_path not in _pdf_cache:
        loader = PyPDFLoader(pdf_path)
        _pdf_cache[pdf_path] = loader.load()
        logger.info("PDF loaded and cached: %s", pdf_path)
    return _pdf_cache[pdf_path]


def get_topic_pages(
    docs,
    start_page: int,
    next_start_page: int | None = None,
    next_topic_title: str | None = None,
):
    """Extract text for a topic based on page boundaries."""
    text = ""
    end_page = start_page

    max_page = next_start_page - 1 if next_start_page else len(docs) - 1

    for page in range(start_page, max_page + 1):
        page_text = docs[page].page_content
        text += page_text + "\n"

        if next_topic_title and re.search(
            rf"\b{re.escape(next_topic_title)}\b",
            page_text,
            re.IGNORECASE,
        ):
            end_page = page - 1
            break

        end_page = page

    return start_page, end_page, text


# ---------------------------
# AI Generation
# ---------------------------
def generate_content_with_llm(
    chapter: str,
    topic: str,
    pdf_content: str,
) -> str:
    """Generate structured study content using the central LLM."""
    prompt = f"""
You are a teacher creating clear, structured study notes.

Chapter: {chapter}
Topic: {topic}

PDF Content:
{pdf_content}

Explain simply using:
- Headings
- Bullet points
- Examples
- Key takeaways

Use markdown formatting.
"""

    try:
        llm = get_llm(temperature=0.5)
        response = llm.invoke(prompt)
        return response.text.strip()
    except Exception:
        logger.exception("Content generation failed")
        raise RuntimeError("Failed to generate content")


# ---------------------------
# Main Service Functions
# --------------------------


async def generate_topic_content(
    book_id: str,
    day_number: int,
    topic_index: int,
    subtopic_index: int,
) -> Dict[str, Any]:
    UPLOAD_DIR = "data/uploads"
    pdf_path = f"{UPLOAD_DIR}/{book_id}.pdf"
    schedule_path = f"{UPLOAD_DIR}/{book_id}_25_days_schedule.json"

    # 1️⃣ Load schedule
    with open(schedule_path, "r", encoding="utf-8") as f:
        schedule = json.load(f)

    day_data = schedule[day_number - 1]
    topic_data = day_data["topics"][topic_index]

    topic_title = topic_data["topic"]
    subtopic = topic_data["subtopics"][subtopic_index]

    subtopic_title = subtopic["title"]
    start_page = subtopic["page"]

    # 2️⃣ CHECK IF ALREADY SAVED (🔥 KEY CHANGE)
    saved = _load_saved_content(
        book_id,
        day_number,
        topic_title,
        subtopic_title,
    )

    if saved:
        return {
            "chapter": topic_title,
            "topic": subtopic_title,
            "content": saved["content"],
            "page_range": saved["page_range"],
            "cached": True,
        }

    # 3️⃣ GENERATE (ONLY IF NOT SAVED)
    docs = load_pdf_docs(pdf_path)
    _, end_page, pdf_content = get_topic_pages(docs, start_page)

    content = generate_content_with_llm(
        topic_title,
        subtopic_title,
        pdf_content,
    )

    page_range = f"{start_page}-{end_page}"

    # 4️⃣ AUTO SAVE
    _auto_save_content(
        book_id=book_id,
        day_number=day_number,
        topic_title=topic_title,
        subtopic_title=subtopic_title,
        content=content,
        page_range=page_range,
    )

    return {
        "chapter": topic_title,
        "topic": subtopic_title,
        "content": content,
        "page_range": page_range,
        "cached": False,
    }


### helpers funtion ###
def _load_saved_content(
    book_id: str,
    day_number: int,
    topic_title: str,
    subtopic_title: str,
) -> dict | None:
    save_dir = "data/saved_content"
    file_path = os.path.join(save_dir, f"{book_id}_day_{day_number}.json")

    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data.get(topic_title, {}).get(subtopic_title)


def _auto_save_content(
    book_id: str,
    day_number: int,
    topic_title: str,
    subtopic_title: str,
    content: str,
    page_range: str,
):
    save_dir = "data/saved_content"
    os.makedirs(save_dir, exist_ok=True)

    file_path = os.path.join(save_dir, f"{book_id}_day_{day_number}.json")

    data = {}
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

    data.setdefault(topic_title, {})
    data[topic_title][subtopic_title] = {
        "content": content,
        "page_range": page_range,
    }

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return file_path


async def regenerate_with_modifications(
    day_number: int,
    topic_index: int,
    current_content: str,
    modification_request: str,
    pdf_path: str,
    schedule_path: str,
) -> Dict[str, Any]:
    """
    Regenerate content by re-extracting PDF pages for the topic, then
    asking the model to modify the current_content according to modification_request.
    Returns chapter, topic, new content, page_range, and pdf_content.
    """
    try:
        # --- Load schedule & topic info ---
        with open(schedule_path, "r", encoding="utf-8") as f:
            schedule = json.load(f)

        if day_number < 1 or day_number > len(schedule):
            raise ValueError(f"Invalid day_number: {day_number}")

        day_topics = schedule[day_number - 1]["topics"]
        if topic_index < 0 or topic_index >= len(day_topics):
            raise ValueError(f"Invalid topic_index: {topic_index}")

        topic_info = day_topics[topic_index]
        chapter = topic_info["chapter"]
        topic = topic_info["topic"]
        start_page = topic_info["page"]

        # Determine next topic start page if available
        if topic_index < len(day_topics) - 1:
            next_topic = day_topics[topic_index + 1]
            next_start_page = next_topic.get("page", None)
            next_topic_title = next_topic.get("topic", None)
        else:
            next_start_page = None
            next_topic_title = None

        # --- Load PDF and extract pages for this topic ---
        docs = load_pdf_docs(pdf_path)  # uses your cached loader
        start_page_final, end_page_final, pdf_content = get_topic_pages(
            docs, start_page, next_start_page, next_topic_title
        )
        page_range = f"{start_page_final}-{end_page_final}"

        # --- Build prompt (include pdf_content + current content + user request) ---
        prompt = (
            f"You are a teacher creating clear and concise study notes.\n\n"
            f"Chapter: {chapter}\n"
            f"Topic: {topic}\n\n"
            f"PDF excerpt for this topic (pages {page_range}):\n{pdf_content}\n\n"
            f"Current generated content:\n{current_content}\n\n"
            f"Student's modification request:\n{modification_request}\n\n"
            f"Regenerate the topic content incorporating the student's feedback. "
            f"Keep a clear structure (headings, bullet points, examples), and use markdown formatting."
        )

        # --- Invoke model ---
        llm = get_llm(temperature=0.7)
        response = llm.invoke(prompt)
        new_content = response.text.strip()

        print(
            f"🔄 Regenerated content (re-extracted from PDF): {chapter} → {topic} (pages {page_range})"
        )

        return {
            "chapter": chapter,
            "topic": topic,
            "content": new_content,
            "page_range": page_range,
            "pdf_content": pdf_content,
        }

    except Exception as e:
        print(f"⚠️ Error in regenerate_with_modifications: {e}")
        # Raise a descriptive exception so API returns 500 with message (or handle as you prefer)
        raise
