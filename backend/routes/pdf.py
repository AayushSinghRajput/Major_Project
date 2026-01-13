from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from utils.file_hash import compute_md5
from services.study_scheduler import generate_study_schedule_from_toc
from services.pdf_loader import extract_toc
from db.cloudinary import upload_pdf_to_cloudinary_bytes
from db.config import db
from models.Content import UploadScheduleResponse

router = APIRouter(prefix="/api/study", tags=["Study Plan"])


@router.post(
    "/upload-and-schedule",
    response_model=UploadScheduleResponse,
    summary="Upload PDF and generate study schedule",
    description="Upload a PDF file and specify number of study days. Returns structured study schedule."
)
async def upload_pdf_and_generate_schedule(
    file: UploadFile = File(..., description="PDF file to upload"),
    days: int = Query(..., gt=0, description="Number of study days")
):
    try:
        # 1️⃣ Read PDF ONCE
        pdf_bytes = await file.read()
        if not pdf_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # 2️⃣ Compute hash
        pdf_hash = compute_md5(pdf_bytes)

        # 3️⃣ Check if PDF already exists
        pdf_doc = await db.pdfs.find_one({"pdf_hash": pdf_hash})

        if pdf_doc:
            toc_data = pdf_doc["toc"]
            pdf_url = pdf_doc["pdf_url"]
            pdf_cached = True
        else:
            # 4️⃣ Upload PDF to Cloudinary using bytes
            pdf_url = await upload_pdf_to_cloudinary_bytes(pdf_bytes)

            # 5️⃣ Extract TOC
            toc_data = extract_toc(pdf_bytes)

            # 6️⃣ Store PDF metadata
            await db.pdfs.insert_one({
                "pdf_hash": pdf_hash,
                "toc": toc_data,
                "pdf_url": pdf_url
            })
            pdf_cached = False

        # 7️⃣ Check if schedule exists for given days
        schedule_doc = await db.schedules.find_one({
            "pdf_hash": pdf_hash,
            "days": days
        })

        if schedule_doc:
            schedule = schedule_doc["schedule"]
            schedule_cached = True
        else:
            # 8️⃣ Generate schedule
            schedule = generate_study_schedule_from_toc(
                toc_data=toc_data,
                total_days=days
            )

            # 9️⃣ Save schedule
            await db.schedules.update_one(
                {"pdf_hash": pdf_hash, "days": days},
                {"$set": {"schedule": schedule}},
                upsert=True
            )
            schedule_cached = False

        # 🔟 Return response
        return UploadScheduleResponse(
            status="success",
            status_code=200,
            message="Study schedule generated successfully",
            pdf_hash=pdf_hash,
            days=days,
            schedule=schedule,
            cached=pdf_cached and schedule_cached
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
