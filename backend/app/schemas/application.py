from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel

class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    REVIEWED = "reviewed"
    INTERVIEWING = "interviewing"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ApplicationCreate(BaseModel):
    job_id: str
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    recruiter_notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    job_title: str
    company_name: str
    seeker_id: str
    seeker_name: str
    seeker_email: str
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    status: ApplicationStatus
    recruiter_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
