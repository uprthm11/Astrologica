import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from pymongo.errors import PyMongoError

logger = logging.getLogger("uvicorn.error")

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGODB_URL") or "mongodb://localhost:27017"
DATABASE_NAME = os.getenv("DATABASE_NAME", "astrologica")

client: AsyncMongoClient | None = None
db = None
is_connected: bool = False

async def connect_to_mongo():
    """Initializes the AsyncMongoClient and verifies the connection on startup."""
    global client, db, is_connected
    try:
        logger.info("Connecting to MongoDB using AsyncMongoClient...")
        client = AsyncMongoClient(
            MONGO_URL,
            serverSelectionTimeoutMS=2000,
            connectTimeoutMS=2000,
            socketTimeoutMS=2000
        )
        db = client[DATABASE_NAME]
        await client.admin.command("ping")
        is_connected = True
        logger.info("Successfully connected to MongoDB.")
    except PyMongoError as err:
        is_connected = False
        logger.warning(f"MongoDB connection attempt completed with notice: {err}")
    except Exception as exc:
        is_connected = False
        logger.warning(f"Failed to connect to MongoDB: {exc}")

async def close_mongo_connection():
    """Closes the MongoDB connection on shutdown."""
    global client, is_connected
    is_connected = False
    if client:
        logger.info("Closing MongoDB AsyncMongoClient connection...")
        await client.close()
        logger.info("MongoDB connection closed.")

async def get_database():
    """Dependency helper to get the database instance if connected."""
    global db, is_connected
    return db if is_connected else None

async def ping_database() -> bool:
    """Check MongoDB live connection status."""
    global client, is_connected
    if not client:
        return False
    try:
        await client.admin.command("ping")
        is_connected = True
        return True
    except Exception:
        is_connected = False
        return False
