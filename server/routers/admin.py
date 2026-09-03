import os
import uuid
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import jwt
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import get_database
from models import (
    AdminLoginRequest,
    AdminTokenResponse,
    SiteConfigModel,
    ContactMessageCreate,
    ContactMessageResponse,
)

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/api", tags=["Admin & Configuration"])
security = HTTPBearer()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
JWT_SECRET = os.getenv("ADMIN_JWT_SECRET", "astrologica-cosmic-secret-key-2026")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 48

# In-memory stores for resilience
IN_MEMORY_CONFIG = {
    "banner_message": "✦ Welcome to Astrologica Enterprise Ephemeris & Cognitive Console",
    "show_banner": True,
    "maintenance_mode": False,
    "updated_at": datetime.utcnow().isoformat()
}
IN_MEMORY_MESSAGES: List[Dict[str, Any]] = [
    {
        "id": "msg-001",
        "name": "Dr. Elena Rostova",
        "email": "elena.rostova@ephemeris.org",
        "message": "Inquiring about Swiss Ephemeris Lahiri ayanamsha calibration for historical birth dates prior to 1950.",
        "category": "Astrological Research",
        "created_at": datetime.utcnow().isoformat(),
        "is_read": False
    },
    {
        "id": "msg-002",
        "name": "Marcus Thorne",
        "email": "m.thorne@cognitivelab.io",
        "message": "Excellent Beebe 8-function stack breakdown. We would love to integrate with your psychometrics API.",
        "category": "API Partnership",
        "created_at": datetime.utcnow().isoformat(),
        "is_read": True
    }
]

def create_access_token(subject: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
        return username
    except jwt.PyJWTError as exc:
        logger.warning(f"Admin auth failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid authentication token"
        )

# --- Public Endpoints ---

@router.get("/public/config", response_model=SiteConfigModel)
async def get_public_site_config():
    """Fetches global public announcements and system banner configuration."""
    db = await get_database()
    if db is not None:
        try:
            doc = await db["site_config"].find_one({"_id": "global_config"})
            if doc:
                return SiteConfigModel(
                    banner_message=doc.get("banner_message", ""),
                    show_banner=doc.get("show_banner", False),
                    maintenance_mode=doc.get("maintenance_mode", False),
                    updated_at=doc.get("updated_at")
                )
        except Exception as exc:
            logger.warning(f"DB config query notice: {exc}")
    
    return SiteConfigModel(**IN_MEMORY_CONFIG)

@router.post("/contact", status_code=status.HTTP_201_CREATED)
async def submit_contact_message(msg: ContactMessageCreate):
    """Submits a user contact message/inquiry."""
    msg_id = f"msg-{uuid.uuid4().hex[:6]}"
    timestamp = datetime.utcnow().isoformat()
    
    doc = {
        "_id": msg_id,
        "id": msg_id,
        "name": msg.name,
        "email": msg.email,
        "message": msg.message,
        "category": msg.category or "General",
        "created_at": timestamp,
        "is_read": False
    }
    
    IN_MEMORY_MESSAGES.insert(0, doc)
    
    db = await get_database()
    if db is not None:
        try:
            await db["contact_messages"].insert_one(doc)
            logger.info(f"Saved contact message {msg_id} to MongoDB.")
        except Exception as exc:
            logger.warning(f"DB contact storage notice: {exc}")
            
    return {"status": "success", "id": msg_id, "message": "Inquiry submitted successfully."}

# --- Protected Admin Endpoints ---

@router.post("/admin/login", response_model=AdminTokenResponse)
async def admin_login(req: AdminLoginRequest):
    """Authenticates admin and returns a bearer JWT."""
    if req.username == ADMIN_USERNAME and req.password == ADMIN_PASSWORD:
        token = create_access_token(req.username)
        return AdminTokenResponse(
            access_token=token,
            token_type="bearer",
            username=req.username
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password"
    )

@router.get("/admin/config", response_model=SiteConfigModel)
async def get_admin_config(admin: str = Depends(verify_admin_token)):
    """Retrieves full system configuration for the admin panel."""
    return await get_public_site_config()

@router.post("/admin/config", response_model=SiteConfigModel)
async def update_admin_config(config: SiteConfigModel, admin: str = Depends(verify_admin_token)):
    """Updates site-wide banner and maintenance mode settings."""
    timestamp = datetime.utcnow().isoformat()
    config_dict = config.model_dump()
    config_dict["updated_at"] = timestamp
    
    # Update in-memory fallback
    global IN_MEMORY_CONFIG
    IN_MEMORY_CONFIG = config_dict.copy()
    
    db = await get_database()
    if db is not None:
        try:
            mongo_doc = config_dict.copy()
            mongo_doc["_id"] = "global_config"
            await db["site_config"].update_one(
                {"_id": "global_config"},
                {"$set": mongo_doc},
                upsert=True
            )
            logger.info("Admin site configuration saved to MongoDB.")
        except Exception as exc:
            logger.warning(f"DB config update notice: {exc}")
            
    return SiteConfigModel(**config_dict)

@router.get("/admin/messages", response_model=List[ContactMessageResponse])
async def list_admin_messages(admin: str = Depends(verify_admin_token)):
    """Fetches list of received user messages and consultation requests."""
    db = await get_database()
    if db is not None:
        try:
            cursor = db["contact_messages"].find().sort("created_at", -1)
            docs = await cursor.to_list(length=100)
            if docs:
                return [
                    ContactMessageResponse(
                        id=str(d.get("id", d.get("_id"))),
                        name=d["name"],
                        email=d["email"],
                        message=d["message"],
                        category=d.get("category", "General"),
                        created_at=d.get("created_at", datetime.utcnow().isoformat()),
                        is_read=d.get("is_read", False)
                    )
                    for d in docs
                ]
        except Exception as exc:
            logger.warning(f"DB list messages notice: {exc}")
            
    return [ContactMessageResponse(**m) for m in IN_MEMORY_MESSAGES]

@router.delete("/admin/messages/{message_id}")
async def delete_admin_message(message_id: str, admin: str = Depends(verify_admin_token)):
    """Deletes a contact message by ID."""
    global IN_MEMORY_MESSAGES
    IN_MEMORY_MESSAGES = [m for m in IN_MEMORY_MESSAGES if m.get("id") != message_id and m.get("_id") != message_id]
    
    db = await get_database()
    if db is not None:
        try:
            await db["contact_messages"].delete_one({"$or": [{"_id": message_id}, {"id": message_id}]})
        except Exception as exc:
            logger.warning(f"DB delete message notice: {exc}")
            
    return {"status": "success", "message": f"Message {message_id} removed."}
