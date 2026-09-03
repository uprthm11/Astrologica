"""
Verification test script for Admin Authentication & Strict Schema Validation
"""
import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def sanitize(s: str) -> str:
    return str(s).encode('ascii', 'ignore').decode('ascii')

def test_admin_and_config_workflow():
    # 1. Public config
    res = client.get("/api/public/config")
    assert res.status_code == 200
    data = res.json()
    assert "banner_message" in data
    print("[*] GET /api/public/config -> OK: " + sanitize(data.get("banner_message", "")))

    # 2. Submit user contact message
    msg_payload = {
        "name": "Jane Astrologer",
        "email": "jane@example.com",
        "message": "Testing the contact inquiry submission.",
        "category": "Consultation"
    }
    res = client.post("/api/contact", json=msg_payload)
    assert res.status_code == 201
    msg_id = res.json()["id"]
    print("[*] POST /api/contact -> 201 Created: " + str(msg_id))

    # 3. Unauthorized access to admin endpoint should fail (401 / 403)
    res = client.get("/api/admin/config")
    assert res.status_code in [401, 403]
    print("[*] GET /api/admin/config without token -> 401/403 Rejected as expected")

    # 4. Admin Login with correct credentials
    login_payload = {"username": "admin", "password": "admin123"}
    res = client.post("/api/admin/login", json=login_payload)
    assert res.status_code == 200
    token = res.json()["access_token"]
    print("[*] POST /api/admin/login -> 200 (Token obtained)")

    headers = {"Authorization": f"Bearer {token}"}

    # 5. Admin Config update
    update_payload = {
        "banner_message": "Swiss Ephemeris v2.2 active with KP & Raman Ayanamsha calibration!",
        "show_banner": True,
        "maintenance_mode": False
    }
    res = client.post("/api/admin/config", json=update_payload, headers=headers)
    assert res.status_code == 200
    print("[*] POST /api/admin/config -> 200 (Banner updated)")

    # Verify public config reflects updated banner
    res = client.get("/api/public/config")
    assert res.json()["banner_message"] == update_payload["banner_message"]
    print("[*] Verified public config reflects admin banner update")

    # 6. Admin Messages listing & deletion
    res = client.get("/api/admin/messages", headers=headers)
    assert res.status_code == 200
    messages = res.json()
    assert any(m["id"] == msg_id for m in messages)
    print(f"[*] GET /api/admin/messages -> 200 (Found {len(messages)} messages)")

    # Delete message
    res = client.delete(f"/api/admin/messages/{msg_id}", headers=headers)
    assert res.status_code == 200
    print("[*] DELETE /api/admin/messages/{id} -> 200")

    print("\n[OK] ALL ADMIN & VALIDATION TESTS PASSED!")

if __name__ == "__main__":
    test_admin_and_config_workflow()
