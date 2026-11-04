from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId


class MessageBase(BaseModel):
    conversation_id: str
    sender_id: str
    sender_name: str
    sender_role: str
    text: str = Field(..., min_length=1, max_length=2000)


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: str
    created_at: datetime
    is_read: bool = False

    class Config:
        from_attributes = True


class ConversationBase(BaseModel):
    participant_ids: List[str]
    participant_names: List[str]
    participant_roles: List[str]
    company_name: Optional[str] = None
    role_context: Optional[str] = None


class ConversationCreate(ConversationBase):
    pass


class ConversationResponse(ConversationBase):
    id: str
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    updated_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True