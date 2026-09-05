"""
Server-Side Timezone Resolution Service using TimezoneFinder.
Resolves accurate IANA timezone and UTC offset strictly from geographical coordinates.
"""
from datetime import datetime
from typing import Tuple, Optional
from zoneinfo import ZoneInfo
from timezonefinder import TimezoneFinder
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/v1/timezone", tags=["Timezone"])

_tf: Optional[TimezoneFinder] = None


def get_timezone_finder() -> TimezoneFinder:
    """Lazy-load TimezoneFinder instance to optimize cold-boot memory."""
    global _tf
    if _tf is None:
        _tf = TimezoneFinder()
    return _tf


def resolve_timezone(
    lat: float,
    lon: float,
    birth_date: Optional[str] = None,
    birth_time: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Resolve IANA timezone string and exact UTC offset string strictly from coordinates.

    Args:
        lat: Latitude (-90 to +90)
        lon: Longitude (-180 to +180)
        birth_date: Optional date in "YYYY-MM-DD"
        birth_time: Optional time in "HH:MM"

    Returns:
        Tuple of (iana_timezone, utc_offset_string) e.g. ("America/Los_Angeles", "-08:00")
    """
    tf = get_timezone_finder()
    tz_name = tf.timezone_at(lat=lat, lng=lon)

    if not tz_name:
        # Fallback to certain edge-case marine borders
        tz_name = tf.closest_timezone_at(lat=lat, lng=lon) or "UTC"

    # Compute exact UTC offset taking historical daylight saving time into account
    utc_offset_str = "+00:00"
    try:
        zi = ZoneInfo(tz_name)
        if birth_date:
            time_part = birth_time or "12:00"
            dt_str = f"{birth_date}T{time_part}:00"
            dt = datetime.fromisoformat(dt_str)
        else:
            dt = datetime.utcnow()

        localized = dt.replace(tzinfo=zi)
        offset = localized.utcoffset()
        if offset is not None:
            total_seconds = int(offset.total_seconds())
            sign = "+" if total_seconds >= 0 else "-"
            abs_seconds = abs(total_seconds)
            hours = abs_seconds // 3600
            minutes = (abs_seconds % 3600) // 60
            utc_offset_str = f"{sign}{hours:02d}:{minutes:02d}"
    except Exception:
        utc_offset_str = "+00:00"

    return tz_name, utc_offset_str


class TimezoneResolveResponse(BaseModel):
    lat: float
    lon: float
    timezone: str
    utc_offset: str


@router.get("/resolve", response_model=TimezoneResolveResponse)
async def resolve_timezone_endpoint(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    date: Optional[str] = Query(None, regex=r"^\d{4}-\d{2}-\d{2}$"),
    time: Optional[str] = Query(None, regex=r"^\d{2}:\d{2}$"),
):
    """
    Resolve accurate IANA timezone and UTC offset from coordinates.
    Eliminates client-side offset drift.
    """
    tz_name, offset_str = resolve_timezone(lat, lon, date, time)
    return TimezoneResolveResponse(
        lat=lat,
        lon=lon,
        timezone=tz_name,
        utc_offset=offset_str,
    )
