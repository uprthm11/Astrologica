"""
Test script to verify FastAPI endpoints and Flatlib blueprint calculation.
"""
from fastapi.testclient import TestClient
from main import app

def test_endpoints():
    with TestClient(app) as client:
        # 1. Test Root
        root_res = client.get("/")
        print(f"[*] GET / -> {root_res.status_code}: {root_res.json()}")
        assert root_res.status_code == 200

        # 2. Test Health Check
        health_res = client.get("/api/health")
        print(f"[*] GET /api/health -> {health_res.status_code}: {health_res.json()}")
        assert health_res.status_code == 200

        # 3. Test Calculate Blueprint
        payload = {
            "date": "1995/10/24",
            "time": "14:30",
            "utc_offset": "+05:30",
            "lat": 19.0760,
            "lon": 72.8777
        }
        calc_res = client.post("/api/calculate-blueprint", json=payload)
        print(f"[*] POST /api/calculate-blueprint -> {calc_res.status_code}")
        data = calc_res.json()
        print(f"[*] Output Data: {data}")
        
        assert calc_res.status_code == 200
        assert data["status"] == "success"
        assert "sun" in data and "moon" in data
        assert "sign" in data["sun"] and "degrees" in data["sun"]
        assert "sign" in data["moon"] and "degrees" in data["moon"]
        print("\n[OK] All endpoint tests passed successfully!")

if __name__ == "__main__":
    test_endpoints()
