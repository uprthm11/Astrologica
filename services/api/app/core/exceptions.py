"""
RFC 7807 problem+json Exception Handlers for FastAPI.
"""
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.logging import logger, request_id_ctx


def setup_exception_handlers(app: FastAPI) -> None:
    """Registers global RFC 7807 problem+json exception handlers."""

    @app.exception_handler(StarletteHTTPException)
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        request_id = request_id_ctx.get()
        problem = {
            "type": f"https://api.astrologica.com/errors/http-{exc.status_code}",
            "title": exc.detail if isinstance(exc.detail, str) else "HTTP Exception",
            "status": exc.status_code,
            "detail": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            "instance": request.url.path,
            "request_id": request_id,
        }
        return JSONResponse(
            status_code=exc.status_code,
            content=problem,
            media_type="application/problem+json",
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        request_id = request_id_ctx.get()
        errors = exc.errors()
        problem = {
            "type": "https://api.astrologica.com/errors/validation-error",
            "title": "Unprocessable Entity",
            "status": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "detail": "Request parameters failed schema validation.",
            "instance": request.url.path,
            "request_id": request_id,
            "invalid_params": [
                {
                    "loc": list(err.get("loc", [])),
                    "msg": err.get("msg", ""),
                    "type": err.get("type", ""),
                }
                for err in errors
            ],
        }
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=problem,
            media_type="application/problem+json",
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        request_id = request_id_ctx.get()
        logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
        problem = {
            "type": "https://api.astrologica.com/errors/internal-server-error",
            "title": "Internal Server Error",
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "detail": "An unexpected server error occurred.",
            "instance": request.url.path,
            "request_id": request_id,
        }
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=problem,
            media_type="application/problem+json",
        )
