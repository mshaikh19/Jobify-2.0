from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class JobType(str, Enum):
    FULL_TIME = "Full-Time"
    PART_TIME = "Part-Time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"
    REMOTE = "Remote"

class JobStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"

class JobCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    company_name: str
    location: str
    job_type: JobType = JobType.FULL_TIME
    salary_range: Optional[str] = None
    requirements: Optional[List[str]] = []
    category: Optional[str] = "General"

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    salary_range: Optional[str] = None
    requirements: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[JobStatus] = None

class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    company_name: str
    location: str
    job_type: JobType
    salary_range: Optional[str] = None
    requirements: List[str] = []
    category: Optional[str] = "General"
    employer_id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
