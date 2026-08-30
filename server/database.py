import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "personality_app")

# Initialize AsyncMongoClient from pymongo
client: AsyncMongoClient = AsyncMongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

async def get_database():
    """Dependency / helper to retrieve the async database instance."""
    return db

async def ping_database() -> bool:
    """Check MongoDB connection status."""
    try:
        await client.admin.command("ping")
        return True
    except Exception as exc:
        print(f"MongoDB ping failed: {exc}")
        return False

async def close_database_connection():
    """Close AsyncMongoClient connection."""
    await client.close()
