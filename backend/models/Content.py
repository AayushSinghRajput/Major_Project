from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Request to generate content for a subtopic
class ContentGenerationRequest(BaseModel):
    book_id: str = Field(..., description="Unique book ID (PDF hash)")
    day_number: int = Field(..., ge=1)
    topic_index: int = Field(..., ge=0)
    subtopic_index: int = Field(..., ge=0)

# Response after content generation
class ContentResponse(BaseModel):
    status: str
    day_number: int
    topic_index: int
    chapter: str
    topic: str
    content: str
    page_range: str
    cached: bool

# Request to regenerate or modify existing content
class RegenerateRequest(BaseModel):
    day_number: int
    topic_index: int
    current_content: str
    modification_request: str
    pdf_path: str
    schedule_path: str

# Response after uploading PDF and generating study schedule
class UploadScheduleResponse(BaseModel):
    status: str
    status_code: int
    message: str
    pdf_hash: str
    days: int
    schedule: List[Dict[str, Any]]  # schedule with topics and subtopics
    cached: bool
