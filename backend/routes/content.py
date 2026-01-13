from fastapi import APIRouter, HTTPException
from models.Content import ContentGenerationRequest, ContentResponse
from services.content_generator import generate_topic_content

router = APIRouter(prefix="/api/content", tags=["Content"])

@router.post("/generate", response_model=ContentResponse)
async def generate_content(payload: ContentGenerationRequest):
    try:
        result = await generate_topic_content(
            book_id=payload.book_id,
            day_number=payload.day_number,
            topic_index=payload.topic_index,
            subtopic_index=payload.subtopic_index
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
