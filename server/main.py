import os
import uuid
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Union, List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import connect_to_mongo, close_mongo_connection, ping_database, get_database
from services.astro_western import calculate_western_chart
from services.astro_vedic import calculate_vedic_chart
from services.astro_dual import calculate_dual_chart

logger = logging.getLogger("uvicorn.error")

# Fallback store in memory to ensure resilience
IN_MEMORY_BLUEPRINTS: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for FastAPI application."""
    logger.info("Application startup: Initializing database connection...")
    await connect_to_mongo()
    yield
    logger.info("Application shutdown: Closing database connection...")
    await close_mongo_connection()

app = FastAPI(
    title="Astrologica Astrological & Personality Engine",
    description="Full-Spectrum Astrological Engine with Western (Tropical), Vedic (Sidereal / Jyotish), Dual Synthesis, and MBTI Cognitive Assessment.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://astrologica-swart.vercel.app",
    "https://astrologica-api-725w.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
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

class BaseBirthDataRequest(BaseModel):
    date: str = Field(..., description="Date of birth in YYYY/MM/DD or YYYY-MM-DD format", example="2003/06/11")
    time: str = Field(..., description="Time of birth in HH:MM or HH:MM:SS format (24h)", example="12:00")
    utc_offset: str = Field(..., description="UTC time offset string, e.g. '+05:30'", example="+05:30")
    lat: Union[float, str] = Field(..., description="Latitude in decimal degrees", example=22.7196)
    lon: Union[float, str] = Field(..., description="Longitude in decimal degrees", example=75.8577)

class WesternRequest(BaseBirthDataRequest):
    house_system: Optional[str] = Field("placidus", description="House system ('placidus' or 'whole_sign')")

class VedicRequest(BaseBirthDataRequest):
    ayanamsha: Optional[str] = Field("lahiri", description="Ayanamsha ('lahiri', 'raman', or 'kp')")

class DualRequest(BaseBirthDataRequest):
    ayanamsha: Optional[str] = Field("lahiri", description="Ayanamsha ('lahiri', 'raman', or 'kp')")
    house_system: Optional[str] = Field("placidus", description="House system ('placidus' or 'whole_sign')")

class MBTIRequest(BaseModel):
    answers: List[int] = Field(..., description="Array of 4 integers representing answers to the 4 personality questions", example=[1, -1, 1, -1])

class MBTIResponse(BaseModel):
    status: str = "success"
    mbti_type: str
    archetype: str
    description: str
    breakdown: dict

class SaveBlueprintRequest(BaseModel):
    astrology: Dict[str, Any] = Field(..., description="Astrology data (Western, Vedic, or Dual)")
    mbti: Dict[str, Any] = Field(..., description="MBTI psychological profile data")
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User settings/preferences")

class SaveBlueprintResponse(BaseModel):
    status: str = "success"
    id: str
    message: str = "Blueprint saved successfully"

# --- Endpoints ---

@app.get("/")
async def root():
    return {
        "app": "Astrologica Astrological & Personality Engine",
        "status": "online",
        "version": "2.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "calculate_western": "/api/calculate/western",
            "calculate_vedic": "/api/calculate/vedic",
            "calculate_dual": "/api/calculate/dual",
            "calculate_mbti": "/api/calculate-mbti",
            "save_blueprint": "/api/save-blueprint",
            "get_blueprint": "/api/blueprint/{id}"
        }
    }

@app.get("/api/health")
async def health_check():
    db_connected = await ping_database()
    return {
        "status": "healthy" if db_connected else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "framework": "FastAPI",
        "version": "2.0.0"
    }

@app.post("/api/calculate/western", status_code=status.HTTP_200_OK)
async def calculate_western_endpoint(request: WesternRequest):
    """
    Calculates Western (Tropical) Astrological Chart with geocentric ecliptic coordinates,
    Placidus or Whole Sign houses, and major planetary aspects.
    """
    try:
        lat_f = float(request.lat)
        lon_f = float(request.lon)
        hsys = request.house_system or "placidus"
        
        result = calculate_western_chart(
            request.date, request.time, request.utc_offset, lat_f, lon_f, hsys
        )
        return {"status": "success", **result}
    except Exception as exc:
        logger.error(f"Western calculation error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error calculating Western chart: {str(exc)}"
        )

@app.post("/api/calculate/vedic", status_code=status.HTTP_200_OK)
async def calculate_vedic_endpoint(request: VedicRequest):
    """
    Calculates Vedic (Sidereal / Jyotish) Astrological Chart with Lahiri/Raman/KP Ayanamshas,
    27 Nakshatras & 4 Padas, 12 Bhavas from Lagna, Navamsha (D9), and Vimshottari Dashas.
    """
    try:
        lat_f = float(request.lat)
        lon_f = float(request.lon)
        ay_name = request.ayanamsha or "lahiri"
        
        result = calculate_vedic_chart(
            request.date, request.time, request.utc_offset, lat_f, lon_f, ay_name
        )
        return {"status": "success", **result}
    except Exception as exc:
        logger.error(f"Vedic calculation error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error calculating Vedic chart: {str(exc)}"
        )

@app.post("/api/calculate/dual", status_code=status.HTTP_200_OK)
async def calculate_dual_endpoint(request: DualRequest):
    """
    Calculates unified Western (Tropical) and Vedic (Sidereal) charts side-by-side
    with precession shift commentary.
    """
    try:
        lat_f = float(request.lat)
        lon_f = float(request.lon)
        ay_name = request.ayanamsha or "lahiri"
        hsys = request.house_system or "placidus"
        
        result = calculate_dual_chart(
            request.date, request.time, request.utc_offset, lat_f, lon_f, ay_name, hsys
        )
        return result
    except Exception as exc:
        logger.error(f"Dual calculation error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error calculating dual chart: {str(exc)}"
        )

@app.post("/api/calculate-blueprint", status_code=status.HTTP_200_OK)
async def calculate_blueprint_legacy(request: BaseBirthDataRequest):
    """
    Backward-compatible blueprint calculation returning Western & Vedic dual data.
    """
    try:
        lat_f = float(request.lat)
        lon_f = float(request.lon)
        dual_res = calculate_dual_chart(
            request.date, request.time, request.utc_offset, lat_f, lon_f
        )
        
        sun_p = next(p for p in dual_res["western"]["planets"] if p["id"] == "sun")
        moon_p = next(p for p in dual_res["western"]["planets"] if p["id"] == "moon")
        
        return {
            "status": "success",
            "sun": {
                "sign": sun_p["sign"],
                "degrees": sun_p["degrees"],
                "total_degrees": sun_p["longitude"],
                "formatted": sun_p["formatted"],
            },
            "moon": {
                "sign": moon_p["sign"],
                "degrees": moon_p["degrees"],
                "total_degrees": moon_p["longitude"],
                "formatted": moon_p["formatted"],
            },
            "meta": dual_res["meta"],
            "full_dual": dual_res,
        }
    except Exception as exc:
        logger.error(f"Legacy blueprint calculation error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error calculating blueprint: {str(exc)}"
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

@app.post("/api/save-blueprint", response_model=SaveBlueprintResponse, status_code=status.HTTP_200_OK)
async def save_blueprint(request: SaveBlueprintRequest):
    """
    Synthesizes and stores a combined multi-system Astrology & MBTI profile into MongoDB.
    Generates a unique 8-character hex identifier.
    """
    short_id = uuid.uuid4().hex[:8]
    timestamp = datetime.utcnow().isoformat()
    
    doc = {
        "id": short_id,
        "blueprint_id": short_id,
        "astrology": request.astrology,
        "mbti": request.mbti,
        "preferences": request.preferences,
        "created_at": timestamp
    }
    
    # Store in memory cache/fallback
    IN_MEMORY_BLUEPRINTS[short_id] = doc
    
    # Store in MongoDB collection 'blueprints'
    db = await get_database()
    if db is not None:
        try:
            mongo_doc = doc.copy()
            mongo_doc["_id"] = short_id
            await db["blueprints"].insert_one(mongo_doc)
            logger.info(f"Saved blueprint {short_id} to MongoDB.")
        except Exception as exc:
            logger.warning(f"MongoDB storage notice: {exc}")
    
    return SaveBlueprintResponse(
        status="success",
        id=short_id,
        message="Blueprint saved successfully"
    )

@app.get("/api/blueprint/{blueprint_id}", status_code=status.HTTP_200_OK)
async def get_blueprint(blueprint_id: str):
    """
    Fetches saved cosmic blueprint profile by unique 8-character ID.
    """
    db = await get_database()
    if db is not None:
        try:
            doc = await db["blueprints"].find_one({"$or": [{"_id": blueprint_id}, {"id": blueprint_id}, {"blueprint_id": blueprint_id}]})
            if doc:
                doc["_id"] = str(doc.get("_id", blueprint_id))
                return doc
        except Exception as exc:
            logger.warning(f"MongoDB fetch query notice: {exc}")
    
    # Fallback to in-memory store
    if blueprint_id in IN_MEMORY_BLUEPRINTS:
        return IN_MEMORY_BLUEPRINTS[blueprint_id]
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Blueprint with ID '{blueprint_id}' not found."
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)