from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SavedJobResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    job_title: str
    company_name: str
    location: str
    job_type: str
    salary_range: Optional[str] = None
    created_at: datetime
