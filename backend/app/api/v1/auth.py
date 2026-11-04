from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.api.deps import get_current_user, require_roles
from app.schemas.user import UserRegister, UserLogin, Token, UserResponse, UserProfileUpdate, UserRole
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from app.core.database import db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserRegister, UserLogin, Token, UserResponse, UserProfileUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & User"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    try:
        existing_user = await db.users.find_one({"email": user_in.email.lower()})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )

        now = datetime.now(timezone.utc)
        user_doc = {
            "email": user_in.email.lower(),
            "password_hash": get_password_hash(user_in.password),
            "full_name": user_in.full_name,
            "role": user_in.role.value,
            "company_name": user_in.company_name,
            "phone": user_in.phone,
            "resume_url": None,
            "bio": None,
            "skills": user_in.skills or [],
            "created_at": now,
            "updated_at": now
        }

        result = await db.users.insert_one(user_doc)
        user_doc["id"] = str(result.inserted_id)
        return user_doc
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unavailable: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await db.users.find_one({"email": form_data.username.lower()})
        if not user or not verify_password(form_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(subject=str(user["_id"]))
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unavailable: {str(e)}"
        )

@router.post("/json-login", response_model=Token)
async def json_login(user_in: UserLogin):
    try:
        user = await db.users.find_one({"email": user_in.email.lower()})
        if not user or not verify_password(user_in.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
            )

        access_token = create_access_token(subject=str(user["_id"]))
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unavailable: {str(e)}"
        )

@router.get("/seekers", response_model=List[UserResponse])
async def list_seekers(current_user: dict = Depends(require_roles([UserRole.EMPLOYER, UserRole.ADMIN]))):
    cursor = db.users.find({"role": UserRole.JOB_SEEKER.value}).sort("created_at", -1).limit(100)
    users = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        users.append(user)
    return users
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_in: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_data = {k: v for k, v in profile_in.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    updated_user["id"] = str(updated_user["_id"])
    return updated_user
