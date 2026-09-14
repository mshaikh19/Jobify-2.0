import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

client = AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client[os.getenv("DATABASE_NAME", "jobify2")]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify the connection when the API starts
    await client.admin.command("ping")
    print("Connected to MongoDB Atlas")
    yield
    client.close()


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/db-check")
async def db_check():
    await db.command("ping")
    return {"database": "connected"}