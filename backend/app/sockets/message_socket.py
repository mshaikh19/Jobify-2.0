import logging
import socketio
from datetime import datetime, timezone
from bson import ObjectId
from app.core.database import db
from app.core.security import decode_access_token

logger = logging.getLogger("jobify.sockets")

# Create Socket.IO server (ASGI mode for FastAPI integration)
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
)

# Wrap as ASGI app so FastAPI can mount it
socket_app = socketio.ASGIApp(sio, socketio_path="socket.io")

# Store connected users: {user_id: sid}
connected_users: dict = {}


async def get_user_from_token(token: str):
    """Validate JWT token and return user dict or None."""
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            return None
        user_id = payload["sub"]
        if not ObjectId.is_valid(user_id):
            return None
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user is None:
            return None
        user["id"] = str(user["_id"])
        return user
    except Exception as e:
        logger.warning(f"Socket auth failed: {e}")
        return None


@sio.event
async def connect(sid, environ, auth):
    """Handle client connection with JWT auth."""
    token = None
    if auth and isinstance(auth, dict):
        token = auth.get("token")
    # Also check query string as fallback
    if not token:
        query = environ.get("QUERY_STRING", "")
        for part in query.split("&"):
            if part.startswith("token="):
                token = part.split("=", 1)[1]
                break

    user = await get_user_from_token(token)
    if not user:
        logger.warning(f"Socket connection rejected: invalid auth for sid={sid}")
        return False  # Reject connection

    connected_users[user["id"]] = sid
    logger.info(f"Socket connected: user_id={user['id']} ({user.get('full_name', 'Unknown')}) sid={sid}")
    return True


@sio.event
async def disconnect(sid):
    """Handle client disconnection."""
    user_id_to_remove = None
    for uid, s_id in connected_users.items():
        if s_id == sid:
            user_id_to_remove = uid
            break
    if user_id_to_remove:
        del connected_users[user_id_to_remove]
        logger.info(f"Socket disconnected: user_id={user_id_to_remove} sid={sid}")


@sio.event
async def join_room(sid, data):
    """Join a conversation room."""
    conversation_id = data.get("conversation_id")
    user_id = data.get("user_id")
    if conversation_id and user_id:
        room = f"conv_{conversation_id}"
        await sio.enter_room(sid, room)
        logger.info(f"User {user_id} joined room {room}")


@sio.event
async def leave_room(sid, data):
    """Leave a conversation room."""
    conversation_id = data.get("conversation_id")
    if conversation_id:
        room = f"conv_{conversation_id}"
        await sio.leave_room(sid, room)


@sio.event
async def send_message(sid, data):
    """Handle real-time message sending via Socket.IO."""
    conversation_id = data.get("conversation_id")
    sender_id = data.get("sender_id")
    sender_name = data.get("sender_name")
    sender_role = data.get("sender_role")
    text = data.get("text")

    if not all([conversation_id, sender_id, sender_name, text]):
        await sio.emit("error", {"message": "Missing required fields"}, room=sid)
        return

    # Verify user is a participant in the conversation
    try:
        conv = await db.conversations.find_one({
            "_id": ObjectId(conversation_id),
            "participant_ids": sender_id,
        })
        if not conv:
            await sio.emit("error", {"message": "Not a participant in this conversation"}, room=sid)
            return
    except Exception:
        await sio.emit("error", {"message": "Invalid conversation ID"}, room=sid)
        return

    now = datetime.now(timezone.utc)
    msg_doc = {
        "conversation_id": conversation_id,
        "sender_id": sender_id,
        "sender_name": sender_name,
        "sender_role": sender_role,
        "text": text,
        "is_read": False,
        "created_at": now,
    }
    result = await db.messages.insert_one(msg_doc)
    msg_doc["id"] = str(result.inserted_id)

    # Update conversation metadata
    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {
            "$set": {
                "last_message": text,
                "last_message_at": now,
                "updated_at": now,
            },
            "$inc": {"unread_count": 1},
        },
    )

    # Broadcast to all clients in the conversation room
    room = f"conv_{conversation_id}"
    await sio.emit("new_message", msg_doc, room=room)

    # Also notify the recipient's personal socket if they're in a different room
    # (the sender's own client will also receive via room broadcast, which is fine)
    logger.info(f"Socket message: {sender_name} -> conv_{conversation_id}: {text[:50]}...")