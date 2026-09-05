"""
Async Redis Cache Client with Resilient In-Memory Fallback.
"""
import os
import time
from typing import Optional, Dict, Tuple
from app.core.logging import logger

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


class ResilientCache:
    """Async cache client with automatic in-memory fallback."""

    def __init__(self, redis_url: str = REDIS_URL):
        self.redis_url = redis_url
        self._redis = None
        self._memory_store: Dict[str, Tuple[str, Optional[float]]] = {}
        self._init_redis()

    def _init_redis(self):
        try:
            import redis.asyncio as aioredis
            self._redis = aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=2.0,
            )
        except Exception as exc:
            logger.warning(f"Failed to initialize Redis client ({exc}), using in-memory cache.")
            self._redis = None

    async def ping(self) -> bool:
        """Verifies Redis connection health."""
        if self._redis:
            try:
                res = await self._redis.ping()
                return bool(res)
            except Exception:
                return False
        return False

    async def get(self, key: str) -> Optional[str]:
        """Fetch cached string value."""
        if self._redis:
            try:
                return await self._redis.get(key)
            except Exception as exc:
                logger.debug(f"Redis get failed ({exc}), falling back to in-memory store.")

        # In-memory fallback check
        item = self._memory_store.get(key)
        if item:
            val, expiry = item
            if expiry is None or expiry > time.time():
                return val
            del self._memory_store[key]
        return None

    async def set(self, key: str, value: str, expire: int = 3600) -> bool:
        """Set cached string value with TTL in seconds."""
        if self._redis:
            try:
                await self._redis.set(key, value, ex=expire)
                return True
            except Exception as exc:
                logger.debug(f"Redis set failed ({exc}), falling back to in-memory store.")

        expiry = time.time() + expire if expire else None
        self._memory_store[key] = (value, expiry)
        return True

    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        if self._redis:
            try:
                await self._redis.delete(key)
            except Exception:
                pass
        if key in self._memory_store:
            del self._memory_store[key]
        return True

    async def close(self):
        if self._redis:
            try:
                await self._redis.close()
            except Exception:
                pass


cache = ResilientCache()
