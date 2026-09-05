"""
Pydantic Schemas for mbti-checker Plugin Contract.
"""
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ModuleStatusResponse(BaseModel):
    module: str = "mbti-checker"
    implemented: bool = False
    version: str = "1.0.0"


class ModuleCalculateRequest(BaseModel):
    profile_id: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)


class ModuleCalculateResponse(BaseModel):
    module: str = "mbti-checker"
    status: str = "not_implemented"
    data: Dict[str, Any] = Field(default_factory=dict)
