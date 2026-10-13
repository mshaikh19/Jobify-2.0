import os
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.schemas.user import UserRole
from app.api.deps import require_roles

router = APIRouter(prefix="/uploads", tags=["File Uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads", "resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN]))
):
    allowed_extensions = {".pdf", ".docx", ".doc"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format. Allowed formats: {', '.join(allowed_extensions)}"
        )
        
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    file_url = f"/uploads/resumes/{unique_filename}"
    return {
        "filename": file.filename,
        "resume_url": file_url
    }
