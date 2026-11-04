import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.database import client, db, init_db
from app.api.v1.auth import router as auth_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.applications import router as applications_router
from app.api.v1.saved_jobs import router as saved_jobs_router
from app.api.v1.admin import router as admin_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.messages import router as messages_router
from app.sockets.message_socket import socket_app

logger = logging.getLogger("jobify")

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Catch-all error middleware: ensures every error returns JSON with CORS headers."""
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Internal server error: {str(exc)}"},
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Credentials": "true",
                },
            )

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify DB connection and setup indexes on startup (non-fatal if MongoDB is unavailable)
    try:
        await client.admin.command("ping")
        print("Connected to MongoDB Atlas")
        await init_db()
    except Exception as e:
        logger.warning(f"MongoDB unavailable at startup: {e}. The server will start, but DB-dependent endpoints will fail.")
    yield
    try:
        client.close()
    except Exception:
        pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Full-stack AI-augmented Job Portal API built with FastAPI and MongoDB",
    lifespan=lifespan,
    debug=False,
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catch-all error middleware (must be added after CORS so CORS headers wrap error responses)
app.add_middleware(ErrorHandlingMiddleware)

# Mount Static Files for Uploads (e.g. Resumes)
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# API v1 Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(applications_router, prefix="/api/v1")
app.include_router(saved_jobs_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(uploads_router, prefix="/api/v1")
app.include_router(messages_router, prefix="/api/v1")

# Mount Socket.IO ASGI app at /socket.io
app.mount("/socket.io", socket_app)

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "app": settings.PROJECT_NAME, "version": settings.PROJECT_VERSION}

@app.get("/db-check", tags=["Health"])
async def db_check():
    try:
        await db.command("ping")
        return {"database": "connected", "database_name": settings.DATABASE_NAME}
    except Exception as e:
        return {"database": "disconnected", "error": str(e)}