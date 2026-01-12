from fastapi import APIRouter, HTTPException

# Schemas
from models.Content import (
    ContentGenerationRequest,
    RegenerateRequest,
    ContentResponse,
)

# Services
from services.content_generator import (
    generate_topic_content,
    regenerate_with_modifications,
)

router = APIRouter(prefix="/api/content", tags=["Content"])


@router.post("/generate", response_model=ContentResponse)
async def generate_content(payload: ContentGenerationRequest):
    try:
        result = await generate_topic_content(
            book_id=payload.book_id,
            day_number=payload.day_number,
            topic_index=payload.topic_index,
            subtopic_index=payload.subtopic_index,
        )

        return ContentResponse(
            status="success",
            day_number=payload.day_number,
            topic_index=payload.topic_index,
            chapter=result["chapter"],
            topic=result["topic"],
            content=result["content"],
            page_range=result["page_range"],
            cached=result["cached"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/regenerate", response_model=ContentResponse)
async def regenerate_content(payload: RegenerateRequest):
    try:
        content = await regenerate_with_modifications(**payload.dict())

        return ContentResponse(
            status="success",
            day_number=payload.day_number,
            topic_index=payload.topic_index,
            chapter=content["chapter"],
            topic=content["topic"],
            content=content["content"],
            page_range=content.get("page_range", "")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
