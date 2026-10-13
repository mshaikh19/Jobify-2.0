from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.core.database import db
from app.schemas.application import (
    ApplicationCreate, 
    ApplicationStatusUpdate, 
    ApplicationResponse, 
    ApplicationStatus
)
from app.schemas.user import UserRole
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/applications", tags=["Applications Pipeline"])

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_for_job(
    app_in: ApplicationCreate,
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(app_in.job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    job = await db.jobs.find_one({"_id": ObjectId(app_in.job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    if job.get("status") == "closed":
        raise HTTPException(status_code=400, detail="This job posting is closed for applications.")
        
    # Check for existing application
    existing_app = await db.applications.find_one({
        "job_id": app_in.job_id,
        "seeker_id": current_user["id"]
    })
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this position.")
        
    now = datetime.now(timezone.utc)
    app_doc = {
        "job_id": app_in.job_id,
        "job_title": job["title"],
        "company_name": job["company_name"],
        "seeker_id": current_user["id"],
        "seeker_name": current_user["full_name"],
        "seeker_email": current_user["email"],
        "resume_url": app_in.resume_url or current_user.get("resume_url"),
        "cover_letter": app_in.cover_letter,
        "status": ApplicationStatus.APPLIED.value,
        "recruiter_notes": None,
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.applications.insert_one(app_doc)
    app_doc["id"] = str(result.inserted_id)
    return app_doc

@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    cursor = db.applications.find({"seeker_id": current_user["id"]}).sort("created_at", -1)
    applications = []
    async for app in cursor:
        app["id"] = str(app["_id"])
        applications.append(app)
    return applications

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def withdraw_application(
    app_id: str,
    current_user: dict = Depends(require_roles([UserRole.JOB_SEEKER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(app_id):
        raise HTTPException(status_code=400, detail="Invalid Application ID format")
        
    app_doc = await db.applications.find_one({"_id": ObjectId(app_id)})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if app_doc["seeker_id"] != current_user["id"] and current_user["role"] != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Not authorized to withdraw this application")
        
    await db.applications.delete_one({"_id": ObjectId(app_id)})
    return None

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
async def get_job_applications(
    job_id: str,
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    if job["employer_id"] != current_user["id"] and current_user["role"] != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Not authorized to view applications for this job")
        
    cursor = db.applications.find({"job_id": job_id}).sort("created_at", -1)
    applications = []
    async for app in cursor:
        app["id"] = str(app["_id"])
        applications.append(app)
    return applications

@router.patch("/{app_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    app_id: str,
    status_in: ApplicationStatusUpdate,
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(app_id):
        raise HTTPException(status_code=400, detail="Invalid Application ID format")
        
    app_doc = await db.applications.find_one({"_id": ObjectId(app_id)})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found")
        
    job = await db.jobs.find_one({"_id": ObjectId(app_doc["job_id"])})
    if not job or (job["employer_id"] != current_user["id"] and current_user["role"] != UserRole.ADMIN.value):
        raise HTTPException(status_code=403, detail="Not authorized to update status for this candidate")
        
    update_data = {
        "status": status_in.status.value,
        "updated_at": datetime.now(timezone.utc)
    }
    if status_in.recruiter_notes is not None:
        update_data["recruiter_notes"] = status_in.recruiter_notes
        
    await db.applications.update_one({"_id": ObjectId(app_id)}, {"$set": update_data})
    
    updated_app = await db.applications.find_one({"_id": ObjectId(app_id)})
    updated_app["id"] = str(updated_app["_id"])
    return updated_app
