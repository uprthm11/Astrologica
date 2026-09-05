"""
Pydantic Schema Models for Astrologica Platform Infrastructure
"""
from typing import List, Optional
from pydantic import BaseModel, Field

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
    message: str = Field(..., min_length=2, max_length=2000, example="Platform inquiry.")
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
