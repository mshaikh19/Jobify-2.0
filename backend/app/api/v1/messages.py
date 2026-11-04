from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.core.database import db
from app.core.security import decode_access_token
from app.api.deps import oauth2_scheme
from app.schemas.message import (
    MessageResponse,
    ConversationResponse,
    ConversationCreate,
    MessageCreate,
)

router = APIRouter(prefix="/messages", tags=["Messages"])


async def get_current_user_ws(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise credentials_exception
    user_id = payload["sub"]
    if not ObjectId.is_valid(user_id):
        raise credentials_exception
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    user["id"] = str(user["_id"])
    return user


def _fix_id(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
    return doc


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: dict = Depends(get_current_user_ws),
):
    cursor = db.conversations.find(
        {"participant_ids": current_user["id"]}
    ).sort("updated_at", -1)
    conversations = []
    async for conv in cursor:
        conversations.append(_fix_id(conv))
    return conversations


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conv_in: ConversationCreate,
    current_user: dict = Depends(get_current_user_ws),
):
    existing = await db.conversations.find_one({
        "participant_ids": {"$all": conv_in.participant_ids},
        "participant_ids": {"$size": len(conv_in.participant_ids)},
    })
    if existing:
        return _fix_id(existing)

    now = datetime.now(timezone.utc)
    conv_doc = {
        "participant_ids": conv_in.participant_ids,
        "participant_names": conv_in.participant_names,
        "participant_roles": conv_in.participant_roles,
        "company_name": conv_in.company_name,
        "role_context": conv_in.role_context,
        "last_message": None,
        "last_message_at": None,
        "unread_count": 0,
        "updated_at": now,
        "created_at": now,
    }
    result = await db.conversations.insert_one(conv_doc)
    conv_doc["id"] = str(result.inserted_id)
    return conv_doc


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: str,
    current_user: dict = Depends(get_current_user_ws),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    conv = await db.conversations.find_one({
        "_id": ObjectId(conversation_id),
        "participant_ids": current_user["id"],
    })
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant in this conversation",
        )

    await db.messages.update_many(
        {
            "conversation_id": conversation_id,
            "sender_id": {"$ne": current_user["id"]},
            "is_read": False,
        },
        {"$set": {"is_read": True}},
    )

    cursor = db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", 1).skip(skip).limit(limit)
    messages = []
    async for msg in cursor:
        messages.append(_fix_id(msg))
    return messages


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    msg_in: MessageCreate,
    current_user: dict = Depends(get_current_user_ws),
):
    conv = await db.conversations.find_one({
        "_id": ObjectId(conversation_id),
        "participant_ids": current_user["id"],
    })
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant in this conversation",
        )

    now = datetime.now(timezone.utc)
    msg_doc = {
        "conversation_id": conversation_id,
        "sender_id": current_user["id"],
        "sender_name": current_user.get("full_name", "User"),
        "sender_role": current_user.get("role", "job_seeker"),
        "text": msg_in.text,
        "is_read": False,
        "created_at": now,
    }
    result = await db.messages.insert_one(msg_doc)
    msg_doc["id"] = str(result.inserted_id)

    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {
            "$set": {
                "last_message": msg_in.text,
                "last_message_at": now,
                "updated_at": now,
            },
            "$inc": {"unread_count": 1},
        },
    )

    return msg_doc


@router.get("/conversations/{conversation_id}/unread-count")
async def get_unread_count(
    conversation_id: str,
    current_user: dict = Depends(get_current_user_ws),
):
    count = await db.messages.count_documents({
        "conversation_id": conversation_id,
        "sender_id": {"$ne": current_user["id"]},
        "is_read": False,
    })
    return {"unread_count": count}


@router.get("/unread-total")
async def get_total_unread(
    current_user: dict = Depends(get_current_user_ws),
):
    conv_cursor = db.conversations.find({"participant_ids": current_user["id"]})
    conv_ids = []
    async for conv in conv_cursor:
        conv_ids.append(str(conv["_id"]))

    if not conv_ids:
        return {"total_unread": 0}

    count = await db.messages.count_documents({
        "conversation_id": {"$in": conv_ids},
        "sender_id": {"$ne": current_user["id"]},
        "is_read": False,
    })
    return {"total_unread": count}