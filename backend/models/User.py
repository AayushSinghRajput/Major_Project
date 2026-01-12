from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        # For Pydantic v2
        return {"type": "string"}

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    email: EmailStr
    password: str

    model_config = {
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }
