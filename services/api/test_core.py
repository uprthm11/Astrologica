"""
Unit tests for Backend Core: App Factory, Health/Ready Endpoints, RFC 7807,
Request-ID correlation, and Dynamic Module Registry.
"""
import pytest
from fastapi import APIRouter
from fastapi.testclient import TestClient

from app.main import create_app
from app.core.module_registry import registry


@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def test_healthz_endpoint(client: TestClient):
    """Verify /healthz returns 200 and status ok."""
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data
    assert "version" in data


def test_readyz_endpoint(client: TestClient):
    """Verify /readyz probe returns 200 and subsystem inventory."""
    response = client.get("/readyz")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "modules" in data


def test_rfc7807_exception_format(client: TestClient):
    """Verify 404/405/422 responses conform to RFC 7807 problem+json."""
    response = client.get("/api/non-existent-route-for-testing")
    assert response.status_code == 404
    assert response.headers.get("content-type") == "application/problem+json"
    data = response.json()
    assert "type" in data
    assert "title" in data
    assert "status" in data
    assert data["status"] == 404
    assert "detail" in data
    assert "request_id" in data


def test_request_id_correlation(client: TestClient):
    """Verify X-Request-ID is echoed back on response."""
    test_id = "trace-uuid-test-999"
    response = client.get("/healthz", headers={"X-Request-ID": test_id})
    assert response.status_code == 200
    assert response.headers.get("X-Request-ID") == test_id


def test_dummy_module_registration_and_mounting():
    """Verify dummy module can be dynamically registered, mounted, and invoked."""
    dummy_router = APIRouter()

    @dummy_router.get("/ping")
    def ping():
        return {"pong": True, "module": "dummy"}

    # Register module with enabled=True
    registry.register(
        name="dummy-test-module",
        router=dummy_router,
        prefix="/api/test-dummy",
        enabled=True,
        description="Dummy test module for registry verification"
    )

    assert registry.is_enabled("dummy-test-module") is True
    assert "dummy-test-module" in registry.get_modules()

    # Mount onto fresh app instance
    app = create_app()
    with TestClient(app) as test_client:
        response = test_client.get("/api/test-dummy/ping")
        assert response.status_code == 200
        data = response.json()
        assert data["pong"] is True
        assert data["module"] == "dummy"
