"""
Full-Spectrum Backend Test Suite for Astrologica
Verifies:
1. Western (Tropical) calculations, Placidus/Whole Sign houses, and major aspects.
2. Vedic (Sidereal) calculations with Lahiri/Raman/KP ayanamshas, 27 Nakshatras, Bhavas, Navamsha D9, and Vimshottari Dashas.
3. Dual Comparative Calculations side-by-side with precession shift delta.
4. MBTI calculation.
5. MongoDB / In-memory storage & retrieval of complete multi-system dossier.
"""
from fastapi.testclient import TestClient
from main import app

def run_tests():
    with TestClient(app) as client:
        # 1. Test Root & Health
        assert client.get("/").status_code == 200
        assert client.get("/api/health").status_code == 200
        print("[*] Root & Health endpoints: OK")

        birth_payload = {
            "date": "2003/06/11",
            "time": "12:00",
            "utc_offset": "+05:30",
            "lat": 22.7196,
            "lon": 75.8577
        }

        # 2. Test Western Calculation (Placidus & Whole Sign)
        res_w_p = client.post("/api/calculate/western", json={**birth_payload, "house_system": "placidus"})
        assert res_w_p.status_code == 200
        data_w_p = res_w_p.json()
        assert data_w_p["zodiac_system"] == "Western (Tropical)"
        assert len(data_w_p["planets"]) == 12
        assert len(data_w_p["houses"]) == 12
        assert len(data_w_p["aspects"]) > 0
        sun_w = next(p for p in data_w_p["planets"] if p["id"] == "sun")
        assert sun_w["sign"] == "Gemini"
        print(f"[*] Western (Placidus): Sun in {sun_w['sign']} ({sun_w['degrees']} deg), Aspects found: {len(data_w_p['aspects'])}")

        res_w_w = client.post("/api/calculate/western", json={**birth_payload, "house_system": "whole_sign"})
        assert res_w_w.status_code == 200
        assert res_w_w.json()["house_system"] == "Whole Sign"
        print("[*] Western (Whole Sign): OK")

        # 3. Test Vedic Calculation (Lahiri, Raman, KP)
        for ay in ["lahiri", "raman", "kp"]:
            res_v = client.post("/api/calculate/vedic", json={**birth_payload, "ayanamsha": ay})
            assert res_v.status_code == 200
            data_v = res_v.json()
            assert data_v["zodiac_system"] == "Vedic (Sidereal / Jyotish)"
            assert len(data_v["planets"]) == 12
            assert len(data_v["bhavas"]) == 12
            assert "nakshatra" in data_v["lagna"]
            assert "navamsha_d9" in data_v["lagna"]
            assert "vimshottari_dashas" in data_v
            sun_v = next(p for p in data_v["planets"] if p["id"] == "sun")
            print(f"[*] Vedic ({ay.upper()} Ayanamsha: {data_v['ayanamsha']['value_degrees']} deg): Surya Rashi {sun_v['rashi']} ({sun_v['nakshatra']['name']} Pada {sun_v['nakshatra']['pada']})")

        # 4. Test Dual Calculation
        res_dual = client.post("/api/calculate/dual", json={**birth_payload, "ayanamsha": "lahiri", "house_system": "placidus"})
        assert res_dual.status_code == 200
        dual_data = res_dual.json()
        assert "western" in dual_data and "vedic" in dual_data and "comparison" in dual_data
        print(f"[*] Dual Calculation: Precession Shift = {dual_data['comparison']['precession_shift_degrees']} deg")
        print(f"    Sun: Tropical {dual_data['comparison']['sun_comparison']['tropical_sign']} -> Sidereal {dual_data['comparison']['sun_comparison']['sidereal_rashi']}")

        # 5. Test MBTI
        mbti_res = client.post("/api/calculate-mbti", json={"answers": [-1, -1, 1, 1]})
        assert mbti_res.status_code == 200
        mbti_data = mbti_res.json()
        assert mbti_data["mbti_type"] == "INTJ"
        print(f"[*] MBTI: {mbti_data['mbti_type']} ({mbti_data['archetype']})")

        # 6. Test Save Multi-System Blueprint
        save_res = client.post("/api/save-blueprint", json={
            "astrology": dual_data,
            "mbti": mbti_data,
            "preferences": {"active_system": "dual", "ayanamsha": "lahiri", "house_system": "placidus"}
        })
        assert save_res.status_code == 200
        blueprint_id = save_res.json()["id"]
        assert len(blueprint_id) == 8
        print(f"[*] Save Multi-System Blueprint: Saved as #{blueprint_id}")

        # 7. Test Get Multi-System Blueprint
        get_res = client.get(f"/api/blueprint/{blueprint_id}")
        assert get_res.status_code == 200
        doc = get_res.json()
        assert doc["id"] == blueprint_id
        assert "western" in doc["astrology"] and "vedic" in doc["astrology"]
        print(f"[*] Get Saved Blueprint: Retrieved successfully for #{blueprint_id}")

        print("\n[OK] ALL FULL-SPECTRUM ASTROLOGICAL BACKEND TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
