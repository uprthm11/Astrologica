import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import ping_database, close_database_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up Personality App API server...")
    yield
    # Shutdown
    print("Shutting down and closing MongoDB connections...")
    await close_database_connection()

app = FastAPI(
    title="Personality App API",
    description="FARM Stack backend API powered by FastAPI, MongoDB (AsyncMongoClient), and Flatlib.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "app": "Personality App API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    db_connected = await ping_database()
    return {
        "status": "healthy" if db_connected else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "framework": "FastAPI",
        "client_origin": "http://localhost:5173"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=True)
