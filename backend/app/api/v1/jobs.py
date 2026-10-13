from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.core.database import db
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobType, JobStatus
from app.schemas.user import UserRole
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/jobs", tags=["Job Postings"])

@router.get("", response_model=List[JobResponse])
async def list_jobs(
    q: Optional[str] = Query(None, description="Search keyword in title, description, company"),
    location: Optional[str] = Query(None, description="Filter by location"),
    job_type: Optional[JobType] = Query(None, description="Filter by job type"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    query = {"status": JobStatus.ACTIVE.value}
    
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"company_name": {"$regex": q, "$options": "i"}},
            {"location": {"$regex": q, "$options": "i"}}
        ]
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if job_type:
        query["job_type"] = job_type.value
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
        
    cursor = db.jobs.find(query).sort("created_at", -1).skip(skip).limit(limit)
    jobs = []
    async for job in cursor:
        job["id"] = str(job["_id"])
        jobs.append(job)
    return jobs

@router.get("/my/postings", response_model=List[JobResponse])
async def get_my_job_postings(
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    cursor = db.jobs.find({"employer_id": current_user["id"]}).sort("created_at", -1)
    jobs = []
    async for job in cursor:
        job["id"] = str(job["_id"])
        jobs.append(job)
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
async def get_job_detail(job_id: str):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    job["id"] = str(job["_id"])
    return job

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobCreate,
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    now = datetime.now(timezone.utc)
    job_doc = {
        "title": job_in.title,
        "description": job_in.description,
        "company_name": job_in.company_name or current_user.get("company_name", "Company"),
        "location": job_in.location,
        "job_type": job_in.job_type.value,
        "salary_range": job_in.salary_range,
        "requirements": job_in.requirements or [],
        "category": job_in.category or "General",
        "employer_id": current_user["id"],
        "status": JobStatus.ACTIVE.value,
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.jobs.insert_one(job_doc)
    job_doc["id"] = str(result.inserted_id)
    return job_doc

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    job_in: JobUpdate,
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    existing_job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    # Ensure employer owns the job or user is admin
    if existing_job["employer_id"] != current_user["id"] and current_user["role"] != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Not authorized to edit this job posting")
        
    update_data = {k: (v.value if isinstance(v, (JobType, JobStatus)) else v) 
                   for k, v in job_in.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.jobs.update_one({"_id": ObjectId(job_id)}, {"$set": update_data})
    
    updated_job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    updated_job["id"] = str(updated_job["_id"])
    return updated_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid Job ID format")
        
    existing_job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    if existing_job["employer_id"] != current_user["id"] and current_user["role"] != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job posting")
        
    await db.jobs.delete_one({"_id": ObjectId(job_id)})
    # Clean up applications for deleted job
    await db.applications.delete_many({"job_id": job_id})
    await db.saved_jobs.delete_many({"job_id": job_id})
    return None
