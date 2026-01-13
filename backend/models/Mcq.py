from pydantic import BaseModel
from typing import List


class MCQRequest(BaseModel):
    context: str
    num_questions: int = 5


class MCQItem(BaseModel):
    question: str
    options: List[str]
    answer_index: int


class MCQResponse(BaseModel):
    mcqs: List[MCQItem]
