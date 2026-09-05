"""
Dynamic Module Registry supporting Auto-Discovery and Feature Flag Gating.
"""
from dataclasses import dataclass, field
from typing import Dict, Optional, List, Callable
from fastapi import FastAPI, APIRouter
from app.core.config import settings
from app.core.logging import logger


@dataclass
class RegisteredModule:
    name: str
    router: APIRouter
    prefix: str = ""
    tags: List[str] = field(default_factory=list)
    enabled: bool = False
    description: str = ""


class ModuleRegistry:
    """Manages feature module lifecycle and routing integration."""

    def __init__(self):
        self._modules: Dict[str, RegisteredModule] = {}
        self._feature_flag_map: Dict[str, Callable[[], bool]] = {
            "western-astrology": lambda: settings.FEATURE_WESTERN_ASTROLOGY,
            "vedic-astrology": lambda: settings.FEATURE_VEDIC_ASTROLOGY,
            "compatibility-checker": lambda: settings.FEATURE_COMPATIBILITY_CHECKER,
            "mbti-checker": lambda: settings.FEATURE_MBTI_CHECKER,
        }

    def register(
        self,
        name: str,
        router: APIRouter,
        prefix: str = "",
        tags: Optional[List[str]] = None,
        enabled: Optional[bool] = None,
        description: str = "",
    ) -> None:
        """Register a feature module with router and gating."""
        if enabled is None:
            # Check feature flag mapping, default to False
            checker = self._feature_flag_map.get(name)
            is_enabled = checker() if checker else False
        else:
            is_enabled = enabled

        self._modules[name] = RegisteredModule(
            name=name,
            router=router,
            prefix=prefix or f"/api/{name}",
            tags=tags or [name],
            enabled=is_enabled,
            description=description,
        )
        logger.info(f"Module '{name}' registered (enabled={is_enabled}, prefix={prefix})")

    def mount_enabled_modules(self, app: FastAPI) -> List[str]:
        """Mounts all enabled module routers onto the FastAPI application."""
        mounted: List[str] = []
        for name, mod in self._modules.items():
            if mod.enabled:
                app.include_router(mod.router, prefix=mod.prefix, tags=mod.tags)
                mounted.append(name)
                logger.info(f"Mounted enabled module: {name} at {mod.prefix}")
            else:
                logger.debug(f"Skipping disabled module: {name}")
        return mounted

    def get_modules(self) -> Dict[str, dict]:
        """Return inventory of registered modules and their current status."""
        return {
            name: {
                "name": mod.name,
                "prefix": mod.prefix,
                "enabled": mod.enabled,
                "description": mod.description,
            }
            for name, mod in self._modules.items()
        }

    def is_enabled(self, name: str) -> bool:
        """Check if a registered module is currently enabled."""
        mod = self._modules.get(name)
        return mod.enabled if mod else False


# Singleton registry instance
registry = ModuleRegistry()
