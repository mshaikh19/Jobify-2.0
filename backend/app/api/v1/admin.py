from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.core.database import db
from app.schemas.user import UserResponse, UserRole
from app.api.deps import require_roles

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: Optional[UserRole] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    query = {}
    if role:
        query["role"] = role.value
        
    cursor = db.users.find(query).sort("created_at", -1).skip(skip).limit(limit)
    users = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        users.append(user)
    return users

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid User ID format")
        
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user["_id"] == ObjectId(current_user["id"]):
        raise HTTPException(status_code=400, detail="Admins cannot delete their own account.")
        
    await db.users.delete_one({"_id": ObjectId(user_id)})
    # Clean up user's jobs, applications, saved_jobs
    if user.get("role") == UserRole.EMPLOYER.value:
        await db.jobs.delete_many({"employer_id": user_id})
    elif user.get("role") == UserRole.JOB_SEEKER.value:
        await db.applications.delete_many({"seeker_id": user_id})
        await db.saved_jobs.delete_many({"user_id": user_id})
        
    return None

@router.get("/stats")
async def get_system_stats(
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    total_users = await db.users.count_documents({})
    total_seekers = await db.users.count_documents({"role": UserRole.JOB_SEEKER.value})
    total_employers = await db.users.count_documents({"role": UserRole.EMPLOYER.value})
    total_admins = await db.users.count_documents({"role": UserRole.ADMIN.value})
    
    total_jobs = await db.jobs.count_documents({})
    active_jobs = await db.jobs.count_documents({"status": "active"})
    
    total_applications = await db.applications.count_documents({})
    
    return {
        "users": {
            "total": total_users,
            "job_seekers": total_seekers,
            "employers": total_employers,
            "admins": total_admins
        },
        "jobs": {
            "total": total_jobs,
            "active": active_jobs,
            "closed": total_jobs - active_jobs
        },
        "applications": {
            "total": total_applications
        }
    }
