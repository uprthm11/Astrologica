"""
Dynamic Module Registry supporting Auto-Discovery and Feature Flag Gating.
"""
import os
import sys
import importlib.util
from pathlib import Path
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

    FLAG_MAP = {
        "western-astrology": "FEATURE_WESTERN_ASTROLOGY",
        "vedic-astrology": "FEATURE_VEDIC_ASTROLOGY",
        "compatibility-checker": "FEATURE_COMPATIBILITY_CHECKER",
        "mbti-checker": "FEATURE_MBTI_CHECKER",
    }

    def is_flag_enabled(self, name: str, cfg=None) -> bool:
        c = cfg or settings
        if name in self.FLAG_MAP:
            attr = self.FLAG_MAP[name]
            return bool(getattr(c, attr, False))
        # If not a recognized feature-gated module, keep enabled or default to True
        mod = self._modules.get(name)
        return mod.enabled if mod else True

    def register(
        self,
        name: str,
        router: APIRouter,
        prefix: str = "",
        tags: Optional[List[str]] = None,
        enabled: Optional[bool] = None,
        description: str = "",
        custom_settings = None,
    ) -> None:
        """Register a feature module with router and gating."""
        if enabled is None:
            is_enabled = self.is_flag_enabled(name, custom_settings)
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
        logger.info(f"Module '{name}' registered (enabled={is_enabled}, prefix={prefix or f'/api/{name}'})")

    def auto_discover(self, modules_dir_path: Optional[str] = None, custom_settings=None) -> List[str]:
        """Auto-discover and load module router plugins from the filesystem."""
        if modules_dir_path:
            modules_dir = Path(modules_dir_path)
        else:
            # Default to repo_root/modules
            modules_dir = Path(__file__).resolve().parents[4] / "modules"

        discovered = []
        if not modules_dir.exists() or not modules_dir.is_dir():
            logger.warning(f"Modules directory does not exist at: {modules_dir}")
            return discovered

        for item in sorted(modules_dir.iterdir()):
            if not item.is_dir():
                continue
            backend_dir = item / "backend"
            router_file = backend_dir / "router.py"
            if not router_file.exists():
                continue

            mod_name = item.name
            safe_pkg = f"modules_plugin_{mod_name.replace('-', '_')}"

            try:
                # Load package __init__
                pkg_init = backend_dir / "__init__.py"
                if pkg_init.exists():
                    pkg_spec = importlib.util.spec_from_file_location(safe_pkg, pkg_init)
                    pkg_mod = importlib.util.module_from_spec(pkg_spec)
                    pkg_mod.__path__ = [str(backend_dir)]
                    sys.modules[safe_pkg] = pkg_mod

                # Load schemas and service dependencies
                for part in ["schemas", "service"]:
                    part_file = backend_dir / f"{part}.py"
                    if part_file.exists():
                        s_spec = importlib.util.spec_from_file_location(f"{safe_pkg}.{part}", part_file)
                        s_mod = importlib.util.module_from_spec(s_spec)
                        s_mod.__package__ = safe_pkg
                        sys.modules[f"{safe_pkg}.{part}"] = s_mod
                        s_spec.loader.exec_module(s_mod)

                # Load router
                router_spec = importlib.util.spec_from_file_location(f"{safe_pkg}.router", router_file)
                router_mod = importlib.util.module_from_spec(router_spec)
                router_mod.__package__ = safe_pkg
                sys.modules[f"{safe_pkg}.router"] = router_mod
                router_spec.loader.exec_module(router_mod)

                # Register discovered module
                self.register(
                    name=mod_name,
                    router=router_mod.router,
                    prefix=f"/api/{mod_name}",
                    description=f"{mod_name} pluggable module",
                    custom_settings=custom_settings,
                )
                discovered.append(mod_name)
            except Exception as exc:
                logger.error(f"Failed to load module '{mod_name}': {exc}", exc_info=True)

        return discovered

    def mount_enabled_modules(self, app: FastAPI, custom_settings=None) -> List[str]:
        """Mounts all enabled module routers onto the FastAPI application."""
        mounted: List[str] = []
        for name, mod in self._modules.items():
            if custom_settings is not None and name in self.FLAG_MAP:
                mod.enabled = self.is_flag_enabled(name, custom_settings)
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
