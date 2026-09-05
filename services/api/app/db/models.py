"""
Core Database Models: User, BirthProfile, ModuleResultCache.
Zero feature-specific (astrology) columns.
"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    profiles: Mapped[list["BirthProfile"]] = relationship("BirthProfile", back_populates="user", cascade="all, delete-orphan")


class BirthProfile(Base):
    __tablename__ = "birth_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="Anonymous", nullable=False)
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    time: Mapped[str] = mapped_column(String(8), nullable=False)   # HH:MM or HH:MM:SS
    utc_offset: Mapped[str] = mapped_column(String(6), default="+00:00", nullable=False)
    timezone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    location_name: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="profiles")
    cache_entries: Mapped[list["ModuleResultCache"]] = relationship("ModuleResultCache", back_populates="profile", cascade="all, delete-orphan")


class ModuleResultCache(Base):
    __tablename__ = "module_result_cache"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("birth_profiles.id", ondelete="CASCADE"), nullable=True, index=True)
    module_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    input_hash: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    result_json: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    profile: Mapped[Optional["BirthProfile"]] = relationship("BirthProfile", back_populates="cache_entries")
