from pydantic import BaseModel, Field


class ContentGenerationRequest(BaseModel):
    book_id: str = Field(..., description="Unique book ID (PDF hash)")
    day_number: int = Field(..., ge=1)
    topic_index: int = Field(..., ge=0)
    subtopic_index: int = Field(..., ge=0)

class ContentResponse(BaseModel):
    status: str
    day_number: int
    topic_index: int
    chapter: str
    topic: str
    content: str
    page_range: str
    cached: bool



class RegenerateRequest(BaseModel):
    day_number: int
    topic_index: int
    current_content: str
    modification_request: str
    pdf_path: str
    schedule_path: str


