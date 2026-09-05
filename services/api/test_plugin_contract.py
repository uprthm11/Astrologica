"""
Integration tests for Backend Module Plugin Contract and Feature Flag Gating.
"""
import pytest
from fastapi.testclient import TestClient
from app.core.config import Settings
from app.core.module_registry import ModuleRegistry
from app.main import create_app


def test_module_contract_and_feature_flag_gating():
    """
    Verify:
    1. western-astrology mounts when its feature flag is True
    2. Other modules return 404 when their feature flags are False
    3. Mounted module exposes GET /status with implemented=False and POST /calculate with 501
    """
    # Configure custom settings where ONLY western-astrology is enabled
    test_settings = Settings(
        FEATURE_WESTERN_ASTROLOGY=True,
        FEATURE_VEDIC_ASTROLOGY=False,
        FEATURE_COMPATIBILITY_CHECKER=False,
        FEATURE_MBTI_CHECKER=False,
    )

    # Use fresh registry to test clean auto-discovery with these settings
    from app.core import config
    orig_settings = config.settings
    config.settings = test_settings

    try:
        app = create_app(custom_settings=test_settings)
        with TestClient(app) as client:
            # 1. Western Astrology should be enabled and mounted
            status_res = client.get("/api/western-astrology/status")
            assert status_res.status_code == 200, f"Expected 200 for enabled western-astrology, got {status_res.status_code}"
            data = status_res.json()
            assert data["module"] == "western-astrology"
            assert data["implemented"] is False

            # Calculation endpoint must return 501 stub
            calc_res = client.post("/api/western-astrology/calculate", json={})
            assert calc_res.status_code == 501, f"Expected 501 for calculate stub, got {calc_res.status_code}"

            # 2. Vedic, Compatibility, and MBTI must return 404 Not Found (gated off)
            for disabled_mod in ["vedic-astrology", "compatibility-checker", "mbti-checker"]:
                dis_res = client.get(f"/api/{disabled_mod}/status")
                assert dis_res.status_code == 404, (
                    f"Expected 404 for disabled module '{disabled_mod}', got {dis_res.status_code}"
                )
    finally:
        config.settings = orig_settings


def test_all_module_skeletons_match_contract():
    """Verify all 4 domain modules conform to identical scaffold structure."""
    from pathlib import Path
    modules_dir = Path(r"e:\Astrologica\modules")
    expected_modules = [
        "western-astrology",
        "vedic-astrology",
        "compatibility-checker",
        "mbti-checker",
    ]

    for mod_name in expected_modules:
        backend_dir = modules_dir / mod_name / "backend"
        assert backend_dir.exists(), f"Missing backend directory for {mod_name}"
        assert (backend_dir / "__init__.py").exists()
        assert (backend_dir / "router.py").exists()
        assert (backend_dir / "schemas.py").exists()
        assert (backend_dir / "service.py").exists()
        assert (backend_dir / "README.md").exists()
