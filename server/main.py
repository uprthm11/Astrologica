import os
import logging
from contextlib import asynccontextmanager
from typing import Union, List
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
    description="FARM Stack Backend with FastAPI, PyMongo AsyncMongoClient, Flatlib calculations, and MBTI assessment.",
    version="1.1.0",
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

# --- MBTI Archetypes Knowledge Base ---
MBTI_ARCHETYPES = {
    "INTJ": {
        "archetype": "The Architect",
        "description": "Strategic, innovative visionaries with a thirst for knowledge and structured plan execution."
    },
    "INTP": {
        "archetype": "The Logician",
        "description": "Flexible analytical thinkers who love exploring theoretical frameworks and complex problems."
    },
    "ENTJ": {
        "archetype": "The Commander",
        "description": "Bold, decisive leaders who excel at organizing resources to achieve ambitious long-term goals."
    },
    "ENTP": {
        "archetype": "The Debater",
        "description": "Quick-witted, curious innovators who thrive on intellectual challenges and brainstorming possibilities."
    },
    "INFJ": {
        "archetype": "The Advocate",
        "description": "Deeply intuitive idealists driven by strong core values and a passion for helping others grow."
    },
    "INFP": {
        "archetype": "The Mediator",
        "description": "Empathetic, imaginative dreamers guided by personal values and a quest for authentic self-expression."
    },
    "ENFJ": {
        "archetype": "The Protagonist",
        "description": "Inspiring, charismatic mentors who empower communities with empathy and visionary leadership."
    },
    "ENFP": {
        "archetype": "The Campaigner",
        "description": "Enthusiastic, free-spirited creatives who see endless possibilities and inspire others with warmth."
    },
    "ISTJ": {
        "archetype": "The Logistician",
        "description": "Dependable, practical organizers focused on accuracy, duty, and established standards."
    },
    "ISFJ": {
        "archetype": "The Defender",
        "description": "Dedicated, warm-hearted protectors who quietly ensure stability and support for those they care for."
    },
    "ESTJ": {
        "archetype": "The Executive",
        "description": "Efficient, structured administrators who bring order, clear standards, and practical leadership."
    },
    "ESFJ": {
        "archetype": "The Consul",
        "description": "Caring, social harmony-seekers who prioritize community connection, support, and cooperation."
    },
    "ISTP": {
        "archetype": "The Virtuoso",
        "description": "Bold, practical experimenters who master tools and solve immediate hands-on challenges calmly."
    },
    "ISFP": {
        "archetype": "The Adventurer",
        "description": "Gentle, artistic souls who live in the moment with a keen aesthetic sense and quiet empathy."
    },
    "ESTP": {
        "archetype": "The Entrepreneur",
        "description": "Energetic, action-oriented thrill-seekers who navigate dynamic environments with sharp instincts."
    },
    "ESFP": {
        "archetype": "The Entertainer",
        "description": "Vibrant, spontaneous enthusiasts who bring joy, energy, and excitement wherever they go."
    }
}

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
        description="Latitude of birth location in decimal degrees",
        example=19.0760
    )
    lon: Union[float, str] = Field(
        ...,
        description="Longitude of birth location in decimal degrees",
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

class MBTIRequest(BaseModel):
    answers: List[int] = Field(
        ...,
        description="Array of 4 integers representing answers to the 4 personality questions",
        example=[1, -1, 1, -1]
    )

class MBTIResponse(BaseModel):
    status: str = "success"
    mbti_type: str
    archetype: str
    description: str
    breakdown: dict

# --- Endpoints ---

@app.get("/")
async def root():
    return {
        "app": "Astrologica Personality API",
        "status": "online",
        "version": "1.1.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "calculate_blueprint": "/api/calculate-blueprint",
            "calculate_mbti": "/api/calculate-mbti"
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
        normalized_date = str(request.date).strip().replace("-", "/")
        normalized_time = str(request.time).strip()
        normalized_offset = str(request.utc_offset).strip()
        if not normalized_offset.startswith("+") and not normalized_offset.startswith("-"):
            normalized_offset = f"+{normalized_offset}"
        
        lat_val = float(request.lat)
        lon_val = float(request.lon)
        
        dt = Datetime(normalized_date, normalized_time, normalized_offset)
        pos = GeoPos(lat_val, lon_val)
        chart = Chart(dt, pos)
        
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

@app.post("/api/calculate-mbti", response_model=MBTIResponse, status_code=status.HTTP_200_OK)
async def calculate_mbti(request: MBTIRequest):
    """
    Calculates MBTI archetype from an array of 4 integer scores mapped to the
    E/I, S/N, T/F, and J/P axes.
    """
    if len(request.answers) < 4:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="MBTI assessment requires exactly 4 answers for the 4 personality axes."
        )
    
    # Map 4 integer scores to 4 axes:
    # 1. Energy: E (score > 0) vs I (score <= 0)
    # 2. Mind: S (score > 0) vs N (score <= 0)
    # 3. Nature: T (score > 0) vs F (score <= 0)
    # 4. Tactics: J (score > 0) vs P (score <= 0)
    a1, a2, a3, a4 = request.answers[0], request.answers[1], request.answers[2], request.answers[3]
    
    letter_e_i = "E" if a1 > 0 else "I"
    letter_s_n = "S" if a2 > 0 else "N"
    letter_t_f = "T" if a3 > 0 else "F"
    letter_j_p = "J" if a4 > 0 else "P"
    
    mbti_code = f"{letter_e_i}{letter_s_n}{letter_t_f}{letter_j_p}"
    archetype_info = MBTI_ARCHETYPES.get(
        mbti_code,
        {
            "archetype": "The Explorer",
            "description": "A versatile personality archetype balancing dynamic perspective and individual insight."
        }
    )
    
    return MBTIResponse(
        status="success",
        mbti_type=mbti_code,
        archetype=archetype_info["archetype"],
        description=archetype_info["description"],
        breakdown={
            "energy": {"letter": letter_e_i, "trait": "Extraverted" if letter_e_i == "E" else "Introverted"},
            "mind": {"letter": letter_s_n, "trait": "Observant (Sensing)" if letter_s_n == "S" else "Intuitive"},
            "nature": {"letter": letter_t_f, "trait": "Thinking" if letter_t_f == "T" else "Feeling"},
            "tactics": {"letter": letter_j_p, "trait": "Judging (Structured)" if letter_j_p == "J" else "Prospecting (Spontaneous)"}
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)