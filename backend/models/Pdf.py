from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class Section(BaseModel):
    title: str = Field(..., description="Section title")
    page: int = Field(..., description="Page number where section starts", ge=0)


class Unit(BaseModel):
    unit: Optional[int] = Field(
        default=None,
        description="Unit number (null for front matter like preface, TOC)"
    )
    title: str = Field(..., description="Unit or chapter title")
    sections: List[Section] = Field(default_factory=list)

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, v):
        if v is not None and v < 0:
            raise ValueError("Unit number must be positive or null")
        return v


class TableOfContents(BaseModel):
    table_of_contents: List[Unit] = Field(...)

    @field_validator("table_of_contents")
    @classmethod
    def validate_toc(cls, v):
        if not v:
            raise ValueError("Table of contents cannot be empty")
        return v
