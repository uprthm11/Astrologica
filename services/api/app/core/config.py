"""
Core Configuration Module using pydantic-settings with Feature Flags.
"""
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "Astrologica API"
    VERSION: str = "3.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api"

    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://astrologica-swart.vercel.app",
        "https://astrologica-api-725w.onrender.com",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        return []

    # Database
    MONGO_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "astrologica"

    # Rate Limiting
    RATE_LIMIT_DEFAULT: str = "100/minute"

    # Feature Flags (defaulting to False for modular plug-in architecture)
    FEATURE_WESTERN_ASTROLOGY: bool = False
    FEATURE_VEDIC_ASTROLOGY: bool = False
    FEATURE_COMPATIBILITY_CHECKER: bool = False
    FEATURE_MBTI_CHECKER: bool = False


settings = Settings()
