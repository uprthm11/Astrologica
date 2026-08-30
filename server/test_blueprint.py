"""
Automated test suite verifying FastAPI endpoints:
- Root (/)
- Health (/api/health)
- Blueprint Calculation (/api/calculate-blueprint)
- MBTI Assessment (/api/calculate-mbti)
"""
from fastapi.testclient import TestClient
from main import app

def test_all_endpoints():
    with TestClient(app) as client:
        # 1. Test Root
        root_res = client.get("/")
        print(f"[*] GET / -> {root_res.status_code}")
        assert root_res.status_code == 200

        # 2. Test Health Check
        health_res = client.get("/api/health")
        print(f"[*] GET /api/health -> {health_res.status_code}")
        assert health_res.status_code == 200

        # 3. Test Calculate Blueprint
        blueprint_payload = {
            "date": "2003/06/11",
            "time": "12:00",
            "utc_offset": "+05:30",
            "lat": 22.7196,
            "lon": 75.8577
        }
        calc_res = client.post("/api/calculate-blueprint", json=blueprint_payload)
        print(f"[*] POST /api/calculate-blueprint -> {calc_res.status_code}")
        bp_data = calc_res.json()
        assert calc_res.status_code == 200
        assert bp_data["status"] == "success"
        assert bp_data["sun"]["sign"] == "Gemini"
        assert bp_data["moon"]["sign"] == "Scorpio"
        print(f"    Sun: {bp_data['sun']['sign']} {bp_data['sun']['degrees']} deg | Moon: {bp_data['moon']['sign']} {bp_data['moon']['degrees']} deg")

        # 4. Test Calculate MBTI (INTJ: -1, -1, 1, 1)
        mbti_payload_intj = {"answers": [-1, -1, 1, 1]}
        mbti_res_intj = client.post("/api/calculate-mbti", json=mbti_payload_intj)
        print(f"[*] POST /api/calculate-mbti (INTJ) -> {mbti_res_intj.status_code}")
        mbti_data_intj = mbti_res_intj.json()
        assert mbti_res_intj.status_code == 200
        assert mbti_data_intj["mbti_type"] == "INTJ"
        assert mbti_data_intj["archetype"] == "The Architect"

        # 5. Test Calculate MBTI (ENFP: 1, -1, -1, -1)
        mbti_payload_enfp = {"answers": [1, -1, -1, -1]}
        mbti_res_enfp = client.post("/api/calculate-mbti", json=mbti_payload_enfp)
        print(f"[*] POST /api/calculate-mbti (ENFP) -> {mbti_res_enfp.status_code}")
        mbti_data_enfp = mbti_res_enfp.json()
        assert mbti_res_enfp.status_code == 200
        assert mbti_data_enfp["mbti_type"] == "ENFP"
        assert mbti_data_enfp["archetype"] == "The Campaigner"

        print("\n[OK] All Astrologica API endpoints passed successfully!")

if __name__ == "__main__":
    test_all_endpoints()
