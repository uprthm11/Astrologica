"""
Visitor Journey Telemetry Router
POST /api/track/journey   - Upsert visitor session
GET  /api/admin/visitors  - JWT-protected session log
"""
import logging
from datetime import datetime
from fastapi import APIRouter, Depends
from routers.admin import verify_admin_token
from database import get_database
from models import VisitorJourney

logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/api", tags=["Telemetry"])

# In-memory fallback for visitor sessions
IN_MEMORY_VISITORS: dict = {}


@router.post("/track/journey", status_code=200)
async def track_journey(payload: VisitorJourney):
    """Silently upsert a visitor's session journey log."""
    timestamp = datetime.utcnow().isoformat()
    
    # Always maintain in-memory session record
    existing = IN_MEMORY_VISITORS.get(payload.session_id, {})
    merged_log = list(dict.fromkeys(
        existing.get("action_log", []) + (payload.action_log or [])
    ))
    
    doc = {
        "session_id": payload.session_id,
        "name":       payload.name or existing.get("name", "Anonymous"),
        "dob":        payload.dob or existing.get("dob", "—"),
        "location":   payload.location or existing.get("location", "—"),
        "action":     payload.action,
        "action_log": merged_log,
        "updated_at": timestamp,
        "started_at": existing.get("started_at", timestamp),
    }

    IN_MEMORY_VISITORS[payload.session_id] = doc

    # Persist to MongoDB asynchronously (best-effort)
    db = await get_database()
    if db is not None:
        try:
            mongo_doc = doc.copy()
            mongo_doc["_id"] = payload.session_id
            await db["visitors"].update_one(
                {"_id": payload.session_id},
                {"$set": mongo_doc, "$setOnInsert": {"started_at": timestamp}},
                upsert=True,
            )
        except Exception as exc:
            logger.debug(f"Visitor DB upsert notice: {exc}")

    return {"status": "ok"}


@router.get("/admin/visitors")
async def get_all_visitors(admin: str = Depends(verify_admin_token)):
    """Returns all visitor session journeys — JWT protected."""
    db = await get_database()
    if db is not None:
        try:
            cursor = db["visitors"].find().sort("updated_at", -1)
            docs = await cursor.to_list(length=200)
            if docs:
                return [
                    {
                        "session_id": d.get("session_id", str(d.get("_id", ""))),
                        "name":       d.get("name", "Anonymous"),
                        "dob":        d.get("dob", "—"),
                        "location":   d.get("location", "—"),
                        "started_at": d.get("started_at", ""),
                        "updated_at": d.get("updated_at", ""),
                        "action_log": d.get("action_log", []),
                    }
                    for d in docs
                ]
        except Exception as exc:
            logger.debug(f"Visitor DB fetch notice: {exc}")

    # Fallback to in-memory store
    return [
        {
            "session_id": v["session_id"],
            "name":       v.get("name", "Anonymous"),
            "dob":        v.get("dob", "—"),
            "location":   v.get("location", "—"),
            "started_at": v.get("started_at", ""),
            "updated_at": v.get("updated_at", ""),
            "action_log": v.get("action_log", []),
        }
        for v in reversed(list(IN_MEMORY_VISITORS.values()))
    ]

