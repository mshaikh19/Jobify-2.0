import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import client, db, init_db
from app.api.v1.auth import router as auth_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.applications import router as applications_router
from app.api.v1.saved_jobs import router as saved_jobs_router
from app.api.v1.admin import router as admin_router
from app.api.v1.uploads import router as uploads_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify DB connection and setup indexes on startup
    await client.admin.command("ping")
    print("Connected to MongoDB Atlas")
    await init_db()
    yield
    client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Full-stack AI-augmented Job Portal API built with FastAPI and MongoDB",
    lifespan=lifespan
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "app": settings.PROJECT_NAME, "version": settings.PROJECT_VERSION}

@app.get("/db-check", tags=["Health"])
async def db_check():
    await db.command("ping")
    return {"database": "connected", "database_name": settings.DATABASE_NAME}