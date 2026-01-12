import json
import math
from typing import List, Dict, Any


def flatten_toc(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extract TOC into flat list:
    [
      { "chapter": "...", "title": "...", "page": 5 }
    ]
    """
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
                        }
                    )

            return flat_topics

    raise ValueError("Unsupported TOC format")


def group_by_chapter(flat_topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Converts:
      chapter -> topic
      title/page -> subtopics[]
    """
    grouped: Dict[str, List[Dict[str, Any]]] = {}

    for item in flat_topics:
        chapter = item["chapter"]

        if chapter not in grouped:
            grouped[chapter] = []

        grouped[chapter].append(
            {
                "title": item["title"],
                "page": item["page"],
            }
        )

    return [
        {
            "topic": chapter,  # ✅ chapter renamed to topic
            "subtopics": subtopics,
        }
        for chapter, subtopics in grouped.items()
    ]


def generate_study_schedule(
    toc_file_path: str,
    total_days: int,
    output_path: str,
) -> str:
    """
    Generate study schedule JSON with grouped topics.
    """

    # Load TOC
    with open(toc_file_path, "r", encoding="utf-8") as f:
        toc_data = json.load(f)

    # Step 1: flatten TOC
    flat_topics = flatten_toc(toc_data)

    # Step 2: split across days
    topics_per_day = max(1, math.ceil(len(flat_topics) / total_days))

    schedule = []
    day = 1

    for i in range(0, len(flat_topics), topics_per_day):
        day_slice = flat_topics[i : i + topics_per_day]

        # Step 3: group by chapter → topic
        grouped_topics = group_by_chapter(day_slice)

        schedule.append(
            {
                "day": day,
                "topics": grouped_topics,
            }
        )

        day += 1

    # Save output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(schedule, f, indent=4, ensure_ascii=False)

    return output_path
