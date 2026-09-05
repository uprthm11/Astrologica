"""
Unit tests for Backend Infrastructure Services:
- Timezone resolution with Los Angeles regression test
- Geocode proxy with zero (0,0) Null Island guarantee
- Async LLM gateway fallback
- SSE stream formatting
"""
import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.infra.timezone_service import resolve_timezone
from app.infra.geocode_service import GeocodeResult
from app.infra.llm_gateway import LLMGateway
from app.infra.sse import format_sse, sse_event_generator


@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def test_los_angeles_timezone_regression():
    """
    Regression Test: Los Angeles (34.0522° N, 118.2437° W)
    Must resolve to America/Los_Angeles with exact seasonal UTC offsets.
    """
    lat, lon = 34.0522, -118.2437

    # Winter (PST, UTC-8)
    tz_winter, offset_winter = resolve_timezone(lat, lon, "2020-01-15", "12:00")
    assert tz_winter == "America/Los_Angeles"
    assert offset_winter == "-08:00"

    # Summer (PDT, UTC-7)
    tz_summer, offset_summer = resolve_timezone(lat, lon, "2020-07-15", "12:00")
    assert tz_summer == "America/Los_Angeles"
    assert offset_summer == "-07:00"


def test_indore_timezone_resolution():
    """Verify fractional 30-minute timezone offset for India."""
    lat, lon = 22.7196, 75.8577
    tz, offset = resolve_timezone(lat, lon, "2000-01-01", "12:00")
    assert tz == "Asia/Kolkata"
    assert offset == "+05:30"


def test_timezone_api_endpoint(client: TestClient):
    """Verify GET /api/v1/timezone/resolve endpoint."""
    response = client.get("/api/v1/timezone/resolve?lat=34.0522&lon=-118.2437&date=2020-01-15&time=12:00")
    assert response.status_code == 200
    data = response.json()
    assert data["timezone"] == "America/Los_Angeles"
    assert data["utc_offset"] == "-08:00"


def test_geocode_never_returns_null_island(client: TestClient):
    """
    CRITICAL ACCEPTANCE CRITERIA:
    Geocode failure or empty queries must never fallback to (0,0) Null Island coordinates.
    """
    # Non-existent gibberish location
    response = client.post("/api/v1/geocode/search", json={"query": "qwertyuiopasdfghjkl1234567890xyz", "limit": 5})
    assert response.status_code == 200
    data = response.json()
    assert "results" in data

    for item in data["results"]:
        assert not (abs(item["lat"]) < 0.001 and abs(item["lon"]) < 0.001), "Null Island (0,0) was returned!"


@pytest.mark.anyio
async def test_llm_gateway_fallback_and_streaming():
    """Verify async LLM gateway returns non-blocking structured output."""
    gateway = LLMGateway(gemini_key="", openai_key="", timeout=5.0)
    result = await gateway.generate("Synthesize personality")
    assert isinstance(result, dict)
    assert result["status"] == "simulated"

    # Test token streaming
    chunks = [c async for c in gateway.stream_tokens("Test prompt")]
    assert len(chunks) > 0
    assert "Astrological" in "".join(chunks)


@pytest.mark.anyio
async def test_sse_event_formatting():
    """Verify W3C compliant Server-Sent Events output formatting."""
    formatted = format_sse({"token": "Mercury"}, event="delta", retry=5000)
    assert "event: delta\n" in formatted
    assert "retry: 5000\n" in formatted
    assert 'data: {"token": "Mercury"}\n\n' in formatted

    async def sample_gen():
        yield "chunk1"
        yield "chunk2"

    events = [e async for e in sse_event_generator(sample_gen(), event_name="message")]
    assert len(events) == 2
    assert "event: message\n" in events[0]
    assert "data: chunk1\n\n" in events[0]
