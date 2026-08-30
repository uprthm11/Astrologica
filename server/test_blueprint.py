"""
Automated test suite verifying all Astrologica FastAPI endpoints:
- Root (/)
- Health (/api/health)
- Blueprint Calculation (/api/calculate-blueprint)
- MBTI Assessment (/api/calculate-mbti)
- Save Combined Blueprint (/api/save-blueprint)
- Get Saved Blueprint (/api/blueprint/{id})
"""
from fastapi.testclient import TestClient
from main import app

def test_full_pipeline():
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
        print(f"    Sun: {bp_data['sun']['sign']} {bp_data['sun']['degrees']} deg | Moon: {bp_data['moon']['sign']} {bp_data['moon']['degrees']} deg")

        # 4. Test Calculate MBTI (INTJ: -1, -1, 1, 1)
        mbti_payload_intj = {"answers": [-1, -1, 1, 1]}
        mbti_res_intj = client.post("/api/calculate-mbti", json=mbti_payload_intj)
        print(f"[*] POST /api/calculate-mbti (INTJ) -> {mbti_res_intj.status_code}")
        mbti_data_intj = mbti_res_intj.json()
        assert mbti_res_intj.status_code == 200
        assert mbti_data_intj["mbti_type"] == "INTJ"
        print(f"    Archetype: {mbti_data_intj['archetype']} ({mbti_data_intj['mbti_type']})")

        # 5. Test Save Blueprint
        save_payload = {
            "astrology": bp_data,
            "mbti": mbti_data_intj
        }
        save_res = client.post("/api/save-blueprint", json=save_payload)
        print(f"[*] POST /api/save-blueprint -> {save_res.status_code}")
        assert save_res.status_code == 200
        saved_id = save_res.json()["id"]
        assert len(saved_id) == 8
        print(f"    Generated Dossier ID: #{saved_id}")

        # 6. Test Get Saved Blueprint
        get_res = client.get(f"/api/blueprint/{saved_id}")
        print(f"[*] GET /api/blueprint/{saved_id} -> {get_res.status_code}")
        assert get_res.status_code == 200
        fetched_doc = get_res.json()
        assert fetched_doc["id"] == saved_id
        assert fetched_doc["astrology"]["sun"]["sign"] == "Gemini"
        assert fetched_doc["mbti"]["mbti_type"] == "INTJ"
        print(f"    Fetched Dossier: The {fetched_doc['astrology']['sun']['sign']} {fetched_doc['mbti']['archetype']}")

        print("\n[OK] All Astrologica endpoints and full synthesis pipeline passed successfully!")

if __name__ == "__main__":
    test_full_pipeline()
