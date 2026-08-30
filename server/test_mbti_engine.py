"""
Automated Test Suite for Astrologica Psychometric Engine & Jungian Cognitive Stack
Verifies:
1. Question retrieval (GET /api/mbti/questions).
2. All 16 MBTI cognitive stacks (Hero, Parent, Child, Aspirant, Opposing, Witch, Trickster, Demon).
3. 24-question evaluation (POST /api/mbti/evaluate) and PCI clarity bands.
4. Legacy endpoint compatibility (POST /api/calculate-mbti).
5. Astrology-Psychology correlation synthesis round-trip with MongoDB storage.
"""
from fastapi.testclient import TestClient
from main import app
from services.mbti_engine import calculate_jungian_cognitive_stack, MBTI_ARCHETYPES_DATABASE

ALL_16_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
]

EXPECTED_HERO_FUNCTIONS = {
    "INTJ": "Ni", "INTP": "Ti", "ENTJ": "Te", "ENTP": "Ne",
    "INFJ": "Ni", "INFP": "Fi", "ENFJ": "Fe", "ENFP": "Ne",
    "ISTJ": "Si", "ISFJ": "Si", "ESTJ": "Te", "ESFJ": "Fe",
    "ISTP": "Ti", "ISFP": "Fi", "ESTP": "Se", "ESFP": "Se"
}

def run_tests():
    with TestClient(app) as client:
        # 1. Test Questions Endpoint
        res_q = client.get("/api/mbti/questions")
        assert res_q.status_code == 200
        q_data = res_q.json()
        assert q_data["total_questions"] == 24
        assert len(q_data["questions"]) == 24
        print(f"[*] GET /api/mbti/questions -> 200 (Total: {q_data['total_questions']} questions)")

        # 2. Verify all 16 Jungian Cognitive Stacks
        for t in ALL_16_TYPES:
            stack = calculate_jungian_cognitive_stack(t)
            assert len(stack["primary_stack"]) == 4
            assert len(stack["shadow_stack"]) == 4
            assert stack["dominant"]["code"] == EXPECTED_HERO_FUNCTIONS[t]
            assert t in MBTI_ARCHETYPES_DATABASE
        print("[*] Jungian 8-Function Stack: Verified for all 16 types (Hero, Parent, Child, Aspirant, + 4 Shadow)")

        # 3. Test Evaluate Endpoint with 24 responses (INTJ profile: all -1 for E/I, all -1 for S/N, all +1 for T/F, all +1 for J/P)
        # Questions:
        # 1-6: E(+1)/I(-1) -> choose -1 (all I)
        # 7-12: S(+1)/N(-1) -> choose -1 (all N)
        # 13-18: T(+1)/F(-1) -> choose +1 (all T)
        # 19-24: J(+1)/P(-1) -> choose +1 (all J)
        intj_responses = [-1]*6 + [-1]*6 + [1]*6 + [1]*6
        res_eval = client.post("/api/mbti/evaluate", json={"responses": intj_responses})
        assert res_eval.status_code == 200
        eval_data = res_eval.json()
        assert eval_data["mbti_type"] == "INTJ"
        assert eval_data["archetype"] == "The Architect"
        assert eval_data["preference_clarity"]["EI"]["clarity_band"] == "Very Clear"
        assert eval_data["preference_clarity"]["SN"]["clarity_band"] == "Very Clear"
        assert eval_data["cognitive_stack"]["dominant"]["code"] == "Ni"
        assert eval_data["cognitive_stack"]["auxiliary"]["code"] == "Te"
        print(f"[*] POST /api/mbti/evaluate -> 200 ({eval_data['mbti_type']} - {eval_data['archetype']}, Dominant: {eval_data['cognitive_stack']['dominant']['name']})")

        # 4. Test Legacy MBTI Endpoint with 4 scores
        legacy_res = client.post("/api/calculate-mbti", json={"answers": [1, -1, -1, 1]})
        assert legacy_res.status_code == 200
        legacy_data = legacy_res.json()
        assert legacy_data["mbti_type"] == "ENFJ"
        print(f"[*] POST /api/calculate-mbti (Legacy 4-item) -> 200 ({legacy_data['mbti_type']} - {legacy_data['archetype']})")

        # 5. Test Save & Retrieve with Synthesis Report
        dual_astro = client.post("/api/calculate/dual", json={
            "date": "2003/06/11", "time": "12:00", "utc_offset": "+05:30", "lat": 22.7196, "lon": 75.8577
        }).json()

        save_res = client.post("/api/save-blueprint", json={
            "astrology": dual_astro,
            "mbti": eval_data,
            "preferences": {"engine": "v2.1"}
        })
        assert save_res.status_code == 200
        saved_id = save_res.json()["id"]

        get_res = client.get(f"/api/blueprint/{saved_id}")
        assert get_res.status_code == 200
        doc = get_res.json()
        assert doc["id"] == saved_id
        assert "synthesis" in doc
        assert "synthesis_title" in doc["synthesis"]
        print(f"[*] Save & Get Blueprint with Synthesis -> 200: '{doc['synthesis']['synthesis_title']}'")

        print("\n[OK] ALL PSYCHOMETRIC & JUNGIAN COGNITIVE TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
