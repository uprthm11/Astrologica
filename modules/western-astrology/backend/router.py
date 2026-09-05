"""
FastAPI Router Scaffold for western-astrology.
"""
from fastapi import APIRouter, HTTPException, status
from .schemas import ModuleStatusResponse, ModuleCalculateRequest, ModuleCalculateResponse
from .service import service

router = APIRouter()


@router.get("/status", response_model=ModuleStatusResponse)
async def get_module_status():
    """Returns module readiness status."""
    return ModuleStatusResponse(
        module="western-astrology",
        implemented=False,
        version="1.0.0",
    )


@router.post("/calculate", response_model=ModuleCalculateResponse, status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def calculate_endpoint(request: ModuleCalculateRequest):
    """501 Stub for calculation endpoint."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail=f"Module 'western-astrology' computation is pending implementation.",
    )
