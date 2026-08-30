import os
import logging
from contextlib import asynccontextmanager
from typing import Union
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import flatlib
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const

from database import connect_to_mongo, close_mongo_connection, ping_database

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for FastAPI application."""
    # Startup: connect to MongoDB
    logger.info("Application startup: Initializing database connection...")
    await connect_to_mongo()
    yield
    # Shutdown: close MongoDB connection
    logger.info("Application shutdown: Closing database connection...")
    await close_mongo_connection()

app = FastAPI(
    title="Astrologica Personality API",
    description="FARM Stack Backend with FastAPI, PyMongo AsyncMongoClient, and Flatlib calculations.",
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

# --- Pydantic Models ---

class BlueprintRequest(BaseModel):
    date: str = Field(
        ...,
        description="Date of birth in YYYY/MM/DD or YYYY-MM-DD format",
        example="1995/10/24"
    )
    time: str = Field(
        ...,
        description="Time of birth in HH:MM or HH:MM:SS format (24-hour)",
        example="14:30"
    )
    utc_offset: str = Field(
        ...,
        description="UTC time offset string, e.g. '+05:30', '-04:00', '+00:00'",
        example="+05:30"
    )
    lat: Union[float, str] = Field(
        ...,
        description="Latitude of birth location in decimal degrees (e.g. 19.0760 or '19.0760')",
        example=19.0760
    )
    lon: Union[float, str] = Field(
        ...,
        description="Longitude of birth location in decimal degrees (e.g. 72.8777 or '72.8777')",
        example=72.8777
    )

class CelestialSignInfo(BaseModel):
    sign: str
    degrees: float
    total_degrees: float
    formatted: str

class BlueprintResponse(BaseModel):
    status: str = "success"
    sun: CelestialSignInfo
    moon: CelestialSignInfo
    meta: dict

# --- Endpoints ---

@app.get("/")
async def root():
    return {
        "app": "Astrologica Personality API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "calculate_blueprint": "/api/calculate-blueprint"
        }
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

@app.post("/api/calculate-blueprint", response_model=BlueprintResponse, status_code=status.HTTP_200_OK)
async def calculate_blueprint(request: BlueprintRequest):
    """
    Calculates astrological blueprint including exact Sun sign, Moon sign,
    and their respective degrees using Flatlib.
    """
    try:
        # Normalize date format to YYYY/MM/DD
        normalized_date = str(request.date).strip().replace("-", "/")
        
        # Normalize time format
        normalized_time = str(request.time).strip()
        
        # Normalize UTC offset string (must start with + or -)
        normalized_offset = str(request.utc_offset).strip()
        if not normalized_offset.startswith("+") and not normalized_offset.startswith("-"):
            normalized_offset = f"+{normalized_offset}"
        
        # Parse latitude and longitude
        lat_val = float(request.lat)
        lon_val = float(request.lon)
        
        # Initialize Flatlib objects
        dt = Datetime(normalized_date, normalized_time, normalized_offset)
        pos = GeoPos(lat_val, lon_val)
        chart = Chart(dt, pos)
        
        # Retrieve celestial bodies
        sun = chart.get(const.SUN)
        moon = chart.get(const.MOON)
        
        sun_deg = round(float(sun.signlon), 4)
        sun_total = round(float(sun.lon), 4)
        moon_deg = round(float(moon.signlon), 4)
        moon_total = round(float(moon.lon), 4)
        
        return BlueprintResponse(
            status="success",
            sun=CelestialSignInfo(
                sign=sun.sign,
                degrees=sun_deg,
                total_degrees=sun_total,
                formatted=f"{sun.sign} {round(sun_deg, 2)}\u00b0"
            ),
            moon=CelestialSignInfo(
                sign=moon.sign,
                degrees=moon_deg,
                total_degrees=moon_total,
                formatted=f"{moon.sign} {round(moon_deg, 2)}\u00b0"
            ),
            meta={
                "date": normalized_date,
                "time": normalized_time,
                "utc_offset": normalized_offset,
                "lat": lat_val,
                "lon": lon_val
            }
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid coordinate or datetime format: {ve}"
        )
    except Exception as exc:
        logger.error(f"Error calculating blueprint: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating astrological blueprint: {str(exc)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)