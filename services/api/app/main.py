"""
FastAPI Application Factory with Modular Router Registry, RFC 7807 Exceptions,
Rate Limiting, and Health/Readiness Probes.
"""
import uuid
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import setup_logging, logger, request_id_ctx
from app.core.exceptions import setup_exception_handlers
from app.core.module_registry import registry

# Database connection utilities
try:
    from database import connect_to_mongo, close_mongo_connection, ping_database
except ImportError:
    from services.api.database import connect_to_mongo, close_mongo_connection, ping_database

# Admin & Telemetry Routers
try:
    from routers.admin import router as admin_router
    from routers.tracking import router as tracking_router
except ImportError:
    from services.api.routers.admin import router as admin_router
    from services.api.routers.tracking import router as tracking_router


limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT_DEFAULT])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan managing database lifecycle."""
    logger.info("Application startup: Initializing database connection...")
    await connect_to_mongo()
    yield
    logger.info("Application shutdown: Closing database connection...")
    await close_mongo_connection()


def create_app(custom_settings=None) -> FastAPI:
    """Application factory for Astrologica API."""
    cfg = custom_settings or settings
    setup_logging(debug=cfg.DEBUG)

    app = FastAPI(
        title=cfg.PROJECT_NAME,
        version=cfg.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Attach rate limiter state
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Request-ID Correlation Middleware
    @app.middleware("http")
    async def request_id_middleware(request: Request, call_next):
        req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        token = request_id_ctx.set(req_id)
        try:
            response: Response = await call_next(request)
            response.headers["X-Request-ID"] = req_id
            return response
        finally:
            request_id_ctx.reset(token)

    # Strict CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cfg.ALLOWED_ORIGINS,
        allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register RFC 7807 Exception Handlers
    setup_exception_handlers(app)

    # Mount Core Platform Routers
    app.include_router(admin_router)
    app.include_router(tracking_router)

    # Mount Enabled Feature Modules from Registry
    registry.mount_enabled_modules(app)

    # --- Health & Readiness Probes ---

    @app.get("/healthz", status_code=status.HTTP_200_OK, tags=["Health"])
    async def healthz() -> Dict[str, Any]:
        """Liveness probe: verifies process is alive and responding."""
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "service": cfg.PROJECT_NAME,
            "version": cfg.VERSION,
        }

    @app.get("/readyz", status_code=status.HTTP_200_OK, tags=["Health"])
    async def readyz() -> Dict[str, Any]:
        """Readiness probe: checks database and subsystems readiness."""
        db_live = await ping_database()
        return {
            "status": "ready" if db_live else "degraded",
            "database": "connected" if db_live else "disconnected",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "modules": registry.get_modules(),
        }

    @app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
    async def legacy_health() -> Dict[str, Any]:
        """Backward-compatible health endpoint for legacy clients."""
        return await healthz()

    @app.get("/", tags=["Root"])
    async def root() -> Dict[str, Any]:
        return {
            "app": cfg.PROJECT_NAME,
            "version": cfg.VERSION,
            "status": "online",
            "docs": "/docs",
            "health": "/healthz",
            "ready": "/readyz",
            "modules": registry.get_modules(),
        }

    return app


# Default app instance for uvicorn
app = create_app()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
