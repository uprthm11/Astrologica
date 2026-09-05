"""
Geocoding Proxy Service with Redis Caching, 1 req/sec Rate Limiting,
and Zero 0,0 (Null Island) Fallbacks.
"""
import asyncio
import json
import time
from typing import List, Optional
import httpx
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.core.cache import cache
from app.core.logging import logger

router = APIRouter(prefix="/api/v1/geocode", tags=["Geocoding"])

# 1 request per second rate limiting lock for upstream Nominatim policy
_last_request_time: float = 0.0
_rate_limit_lock = asyncio.Lock()


class GeocodeSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200, example="Los Angeles, CA, USA")
    limit: int = Field(default=5, ge=1, le=20)


class GeocodeResult(BaseModel):
    location_name: str
    lat: float
    lon: float
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None


class GeocodeSearchResponse(BaseModel):
    query: str
    results: List[GeocodeResult]
    cached: bool = False


async def search_location_upstream(query: str, limit: int = 5) -> List[GeocodeResult]:
    """Execute geocoding query against Nominatim with 1 req/sec rate enforcement."""
    global _last_request_time

    cache_key = f"geocode:v1:{query.strip().lower()}:{limit}"
    cached_val = await cache.get(cache_key)
    if cached_val:
        try:
            raw_list = json.loads(cached_val)
            return [GeocodeResult(**item) for item in raw_list]
        except Exception:
            pass

    async with _rate_limit_lock:
        elapsed = time.time() - _last_request_time
        if elapsed < 1.0:
            await asyncio.sleep(1.0 - elapsed)
        _last_request_time = time.time()

        url = "https://nominatim.openstreetmap.org/search"
        headers = {
            "User-Agent": "Astrologica-Core-Engine/3.0 (info@astrologica.com)",
            "Accept": "application/json",
        }
        params = {
            "q": query,
            "format": "json",
            "limit": limit,
            "addressdetails": 1,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, params=params, headers=headers)
                resp.raise_for_status()
                data = resp.json()
        except Exception as exc:
            logger.error(f"Upstream geocode failed for query '{query}': {exc}")
            # CRITICAL ARCHITECTURAL RULE: NEVER fallback to 0,0! Return empty results.
            return []

    results: List[GeocodeResult] = []
    for item in data:
        try:
            lat = float(item.get("lat"))
            lon = float(item.get("lon"))
            # Prevent Null Island (0,0) from ever being emitted
            if abs(lat) < 0.0001 and abs(lon) < 0.0001:
                continue

            address = item.get("address", {})
            city = address.get("city") or address.get("town") or address.get("village") or address.get("municipality")
            state = address.get("state") or address.get("region")
            country = address.get("country")

            results.append(
                GeocodeResult(
                    location_name=item.get("display_name", query),
                    lat=lat,
                    lon=lon,
                    country=country,
                    state=state,
                    city=city,
                )
            )
        except (ValueError, TypeError):
            continue

    # Cache successful results for 7 days
    if results:
        serialized = json.dumps([r.model_dump() for r in results])
        await cache.set(cache_key, serialized, expire=604800)

    return results


@router.post("/search", response_model=GeocodeSearchResponse)
async def geocode_search(request: GeocodeSearchRequest):
    """
    Geocoding proxy endpoint:
    - Enforces 1 request/second rate limiting
    - Redis-backed result caching
    - Eliminates 0,0 fallback errors
    """
    clean_query = request.query.strip()
    if not clean_query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query string cannot be empty."
        )

    results = await search_location_upstream(clean_query, request.limit)
    if not results:
        # Strictly return empty result list or 404, never 0,0
        return GeocodeSearchResponse(query=clean_query, results=[])

    return GeocodeSearchResponse(query=clean_query, results=results)
