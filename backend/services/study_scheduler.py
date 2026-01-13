import math
from typing import List, Dict, Any

# ---------------------------
# Flatten TOC
# ---------------------------
def flatten_toc(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Flatten table of contents into list of subtopics."""
    for key in ("table_of_contents", "tableOfContents", "toc"):
        if key in data:
            flat_topics = []
            for unit in data[key]:
                chapter_title = unit.get("title")
                for sec in unit.get("sections", []):
                    flat_topics.append(
                        {
                            "chapter": chapter_title,
                            "title": sec.get("title"),
                            "page": sec.get("page"),
                            "content": ""  # initialize empty content
                        }
                    )
            return flat_topics
    raise ValueError("Unsupported TOC format")

# ---------------------------
# Group subtopics by chapter
# ---------------------------
def group_by_chapter(flat_topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[str, List[Dict[str, Any]]] = {}
    for item in flat_topics:
        grouped.setdefault(item["chapter"], []).append(
            {"title": item["title"], "page": item["page"], "content": item["content"]}
        )
    return [{"topic": chapter, "subtopics": subtopics} for chapter, subtopics in grouped.items()]

# ---------------------------
# Generate study schedule
# ---------------------------
def generate_study_schedule_from_toc(toc_data: Dict[str, Any], total_days: int) -> List[Dict[str, Any]]:
    """Distribute topics evenly across days and group by chapter."""
    flat_topics = flatten_toc(toc_data)
    topics_per_day = max(1, math.ceil(len(flat_topics) / total_days))
    schedule = []
    day = 1
    for i in range(0, len(flat_topics), topics_per_day):
        day_slice = flat_topics[i:i + topics_per_day]
        grouped_topics = group_by_chapter(day_slice)
        schedule.append({"day": day, "topics": grouped_topics})
        day += 1
    return schedule
