import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("jobify.database")

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

def get_database():
    return db

async def init_db():
    """Create indexes for MongoDB collections."""
    try:
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        
        # Jobs collection indexes
        await db.jobs.create_index([("title", "text"), ("description", "text"), ("company_name", "text"), ("location", "text")])
        await db.jobs.create_index("employer_id")
        await db.jobs.create_index("status")
        
        # Applications collection indexes
        await db.applications.create_index([("job_id", 1), ("seeker_id", 1)], unique=True)
        await db.applications.create_index("seeker_id")
        await db.applications.create_index("job_id")
        
        # Saved Jobs collection indexes
        await db.saved_jobs.create_index([("user_id", 1), ("job_id", 1)], unique=True)
        await db.saved_jobs.create_index("user_id")
        
        logger.info("MongoDB indexes verified successfully.")
    except Exception as e:
        logger.warning(f"Note on DB index creation: {e}")
