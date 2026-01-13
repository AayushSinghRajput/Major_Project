from pydantic import BaseModel
from typing import List, Dict, Any


class ScheduleDay(BaseModel):
    day: int
    topics: List[Dict[str, Any]]
