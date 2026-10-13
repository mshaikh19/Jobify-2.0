from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.core.database import db
from app.schemas.saved_job import SavedJobResponse
from app.schemas.user import UserRole
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/saved-jobs", tags=["Saved Jobs"])

@router.post("/{job_id}", response_model=SavedJobResponse, status_code=status.HTTP_201_CREATED)
async def save_job(
    job_id: str,
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    existing_save = await db.saved_jobs.find_one({
        "user_id": current_user["id"],
        "job_id": job_id
    })
    if existing_save:
        existing_save["id"] = str(existing_save["_id"])
        return existing_save
        
    now = datetime.now(timezone.utc)
    saved_doc = {
        "user_id": current_user["id"],
        "job_id": job_id,
        "job_title": job["title"],
        "company_name": job["company_name"],
        "location": job["location"],
        "job_type": job["job_type"],
        "salary_range": job.get("salary_range"),
        "created_at": now
    }
    
    result = await db.saved_jobs.insert_one(saved_doc)
    saved_doc["id"] = str(result.inserted_id)
    return saved_doc

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_saved_job(
    job_id: str,
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    await db.saved_jobs.delete_one({
        "user_id": current_user["id"],
        "job_id": job_id
    })
    return None

@router.get("", response_model=List[SavedJobResponse])
async def get_saved_jobs(
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    cursor = db.saved_jobs.find({"user_id": current_user["id"]}).sort("created_at", -1)
    saved_list = []
    async for item in cursor:
        item["id"] = str(item["_id"])
        saved_list.append(item)
    return saved_list
