from fastapi import APIRouter, HTTPException
from models.Mcq import MCQRequest, MCQResponse
from services.mcq_question import mcq_generator

router = APIRouter(
    prefix="/api/mcq",
    tags=["MCQ"]
)


@router.post("/generate", response_model=MCQResponse)
def generate_mcqs(payload: MCQRequest):
    try:
        mcqs = mcq_generator(
            context=payload.context,
            num_questions=payload.num_questions
        )

        return {"mcqs": mcqs}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
