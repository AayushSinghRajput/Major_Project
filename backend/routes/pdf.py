from fastapi import APIRouter, UploadFile, File, HTTPException, Query, status
from services.pdf_loader import extract_toc
from services.study_scheduler import generate_study_schedule
import os
import hashlib
import shutil

router = APIRouter(prefix="/api/study", tags=["Study Plan"])

UPLOAD_DIR = "data/uploads"


def compute_md5(file: UploadFile) -> str:
    hash_md5 = hashlib.md5()
    file.file.seek(0)

    for chunk in iter(lambda: file.file.read(8192), b""):
        hash_md5.update(chunk)

    file.file.seek(0)
    return hash_md5.hexdigest()


@router.post("/upload-and-schedule")
async def upload_pdf_and_generate_schedule(
    file: UploadFile = File(...),
    days: int = Query(..., gt=0, description="Number of study days"),
):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        pdf_hash = compute_md5(file)

        pdf_path = os.path.join(UPLOAD_DIR, f"{pdf_hash}.pdf")
        toc_path = os.path.join(UPLOAD_DIR, f"{pdf_hash}_toc.json")
        schedule_path = os.path.join(
            UPLOAD_DIR, f"{pdf_hash}_{days}_days_schedule.json"
        )

        # Cache flags (IMPORTANT)
        pdf_exists = os.path.exists(pdf_path)
        toc_exists = os.path.exists(toc_path)
        schedule_exists = os.path.exists(schedule_path)

        # 1️⃣ Save PDF only if new
        if not pdf_exists:
            with open(pdf_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        #  2. TOC
        if not toc_exists:
            toc_path = extract_toc(
                file_path=pdf_path,
                output_path=toc_path,
            )

        # 3. Schedule
        if not schedule_exists:
            schedule_path = generate_study_schedule(
                toc_file_path=toc_path,
                total_days=days,
                output_path=schedule_path,
            )

        # 4️⃣ Decide response meaning
        fully_cached = pdf_exists and toc_exists and schedule_exists

        return {
            "status": "success",
            "cached": fully_cached,
            "pdf_hash": pdf_hash,
            "original_filename": file.filename,
            "days": days,
            "pdf_path": pdf_path,
            "toc_path": toc_path,
            "schedule_path": schedule_path,
            "details": {
                "pdf_reused": pdf_exists,
                "toc_reused": toc_exists,
                "schedule_reused": schedule_exists,
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
