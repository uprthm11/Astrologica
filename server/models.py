"""
Pydantic Schema Models with Strict Field Validation for Astrologica
"""
from typing import Union, List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

# --- Astrological Request Models ---

class BaseBirthDataRequest(BaseModel):
    date: str = Field(..., description="Date of birth in YYYY/MM/DD or YYYY-MM-DD format", example="2003/06/11")
    time: str = Field(..., description="Time of birth in HH:MM or HH:MM:SS format (24h)", example="12:00")
    utc_offset: str = Field(default="+05:30", description="UTC time offset string, e.g. '+05:30'", example="+05:30")
    lat: float = Field(..., description="Latitude in decimal degrees", example=22.7196)
    lon: float = Field(..., description="Longitude in decimal degrees", example=75.8577)

    @field_validator("lat")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError("Latitude must be between -90.0 and +90.0 degrees")
        return v

    @field_validator("lon")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError("Longitude must be between -180.0 and +180.0 degrees")
        return v

class WesternRequest(BaseBirthDataRequest):
    house_system: str = Field(default="placidus", description="House system ('placidus' or 'whole_sign')")

class VedicRequest(BaseBirthDataRequest):
    ayanamsha: str = Field(default="lahiri", description="Ayanamsha ('lahiri', 'raman', or 'kp')")

class DualRequest(BaseBirthDataRequest):
    ayanamsha: str = Field(default="lahiri", description="Ayanamsha ('lahiri', 'raman', or 'kp')")
    house_system: str = Field(default="placidus", description="House system ('placidus' or 'whole_sign')")

# --- Psychometric Request Models ---

class MBTILegacyRequest(BaseModel):
    answers: List[Any] = Field(..., description="Array of answers (4 legacy integers or full 24 responses)", example=[1, -1, 1, -1])

class MBTIEvaluateRequest(BaseModel):
    responses: List[Any] = Field(..., description="Array of 24 forced-choice responses (+1/-1 or 'A'/'B')", example=[1]*24)

# --- Blueprint Persistence Models ---

class SaveBlueprintRequest(BaseModel):
    astrology: Dict[str, Any] = Field(..., description="Astrology data (Western, Vedic, or Dual)")
    mbti: Dict[str, Any] = Field(..., description="MBTI psychometric & cognitive profile data")
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User settings/preferences")

class SaveBlueprintResponse(BaseModel):
    status: str = "success"
    id: str
    message: str = "Blueprint saved successfully"

# --- Admin & Platform Management Models ---

class AdminLoginRequest(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="admin123")

class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class SiteConfigModel(BaseModel):
    banner_message: str = Field(default="", description="Global announcement text shown at top of app")
    show_banner: bool = Field(default=False, description="Whether to display the announcement banner")
    maintenance_mode: bool = Field(default=False, description="Maintenance mode toggle")
    updated_at: Optional[str] = None

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="Alex Vance")
    email: str = Field(..., min_length=3, max_length=120, example="alex@example.com")
    message: str = Field(..., min_length=2, max_length=2000, example="Inquiry regarding Vedic ephemeris precision.")
    category: Optional[str] = Field(default="General", example="Consultation")

class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    category: str
    created_at: str
    is_read: bool = False

# --- Visitor Journey Telemetry Models ---

class VisitorJourney(BaseModel):
    session_id: str = Field(..., description="Unique browser session UUID")
    name: str = Field(default="Anonymous", max_length=120)
    dob: Optional[str] = Field(default=None, description="Date of birth")
    location: Optional[str] = Field(default=None, description="Location of birth")
    action: Optional[str] = Field(default=None, description="Most recent action taken")
    action_log: Optional[List[str]] = Field(default_factory=list, description="Ordered sequence of user actions")
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp of the event")


