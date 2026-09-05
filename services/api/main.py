import os
import sys
import logging
from datetime import datetime
from contextlib import asynccontextmanager

# Ensure server module directory is in sys.path
_server_dir = os.path.dirname(os.path.abspath(__file__))
if _server_dir not in sys.path:
    sys.path.insert(0, _server_dir)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import connect_to_mongo, close_mongo_connection, ping_database
from routers.admin import router as admin_router
from routers.tracking import router as tracking_router

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for FastAPI application."""
    logger.info("Application startup: Initializing database connection...")
    await connect_to_mongo()
    yield
    logger.info("Application shutdown: Closing database connection...")
    await close_mongo_connection()

app = FastAPI(
    title="Astrologica API",
    description="Astrologica Core API Platform Infrastructure.",
    version="3.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
extra_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://astrologica-swart.vercel.app",
    "https://astrologica-api-725w.onrender.com",
    *extra_origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount platform infrastructure routers
app.include_router(admin_router)
app.include_router(tracking_router)

# --- Core Public Scaffolding Endpoints ---

@app.get("/")
async def root():
    return {
        "app": "Astrologica API",
        "status": "online",
        "version": "3.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "public_config": "/api/public/config",
            "contact": "/api/contact",
            "admin_login": "/api/admin/login",
            "admin_config": "/api/admin/config",
            "admin_messages": "/api/admin/messages"
        }
    }

@app.get("/api/health")
async def health_check():
    db_connected = await ping_database()
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if db_connected else "disconnected",
        "service": "Astrologica API",
        "version": "3.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port)