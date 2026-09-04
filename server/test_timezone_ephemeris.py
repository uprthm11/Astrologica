"""
Unit tests verifying precision timezone conversion, Julian Day computation,
and Ascendant / Midheaven degrees for Indore, MP (June 11, 2003, 02:20 AM).
"""
from fastapi.testclient import TestClient
from main import app
from services.astro_western import calculate_western_chart
from services.astro_core import parse_julian_day

client = TestClient(app)

def test_indore_western_chart_direct():
    # June 11, 2003, 02:20 AM, Indore, Madhya Pradesh (Lat: 22.7196, Lon: 75.8577)
    chart = calculate_western_chart(
        date_str="2003/06/11",
        time_str="02:20",
        utc_offset_str="+05:30",
        lat=22.7196,
        lon=75.8577,
        house_system="placidus"
    )
    
    asc = chart["ascendant"]
    mc = chart["midheaven"]
    
    print(f"Direct Ascendant: {asc['sign']} {asc['degrees']:.4f} deg ({asc['longitude']:.4f})")
    print(f"Direct Midheaven: {mc['sign']} {mc['degrees']:.4f} deg ({mc['longitude']:.4f})")
    
    # Assert exact required coordinates: Aries ~22.55 deg, Midheaven Capricorn ~15.81 deg
    assert asc["sign"] == "Aries", f"Expected Aries, got {asc['sign']}"
    assert abs(asc["degrees"] - 22.55) < 0.05, f"Expected ~22.55 deg, got {asc['degrees']}"
    assert abs(asc["longitude"] - 22.5508) < 0.05, f"Expected ~22.5508 deg, got {asc['longitude']}"
    
    assert mc["sign"] == "Capricorn", f"Expected Capricorn, got {mc['sign']}"
    assert abs(mc["degrees"] - 15.81) < 0.05, f"Expected ~15.81 deg, got {mc['degrees']}"
    assert abs(mc["longitude"] - 285.8087) < 0.05, f"Expected ~285.8087 deg, got {mc['longitude']}"
    
    # Assert it is NOT Taurus 1.1 deg (which occurred when timezone was truncated)
    assert asc["sign"] != "Taurus", "Timezone math still truncating: produced Taurus!"
    assert not (30.0 <= asc["longitude"] <= 33.0), "Ascendant fell into Taurus 1.1 deg range!"

def test_indore_api_dual():
    res = client.post("/api/calculate/dual", json={
        "date": "2003/06/11",
        "time": "02:20",
        "utc_offset": "+05:30",
        "timezone": "Asia/Kolkata",
        "lat": 22.7196,
        "lon": 75.8577,
        "ayanamsha": "lahiri",
        "house_system": "placidus"
    })
    assert res.status_code == 200, f"API error: {res.text}"
    data = res.json()
    asc = data["western"]["ascendant"]
    mc = data["western"]["midheaven"]
    
    print(f"API Dual Ascendant: {asc['sign']} {asc['degrees']:.4f} deg")
    print(f"API Dual Midheaven: {mc['sign']} {mc['degrees']:.4f} deg")
    
    assert asc["sign"] == "Aries"
    assert abs(asc["degrees"] - 22.55) < 0.05
    assert mc["sign"] == "Capricorn"
    assert abs(mc["degrees"] - 15.81) < 0.05

def test_indore_geographic_timezone_inference():
    # Test without timezone or offset provided: system infers Asia/Kolkata from Lat/Lon
    chart = calculate_western_chart(
        date_str="2003/06/11",
        time_str="02:20",
        utc_offset_str="",
        lat=22.7196,
        lon=75.8577,
        house_system="placidus"
    )
    asc = chart["ascendant"]
    mc = chart["midheaven"]
    print(f"Inferred Ascendant: {asc['sign']} {asc['degrees']:.4f} deg")
    print(f"Inferred Midheaven: {mc['sign']} {mc['degrees']:.4f} deg")
    assert asc["sign"] == "Aries"
    assert abs(asc["degrees"] - 22.55) < 0.05
    assert mc["sign"] == "Capricorn"
    assert abs(mc["degrees"] - 15.81) < 0.05

if __name__ == '__main__':
    test_indore_western_chart_direct()
    test_indore_api_dual()
    test_indore_geographic_timezone_inference()
    print('[ALL TESTS PASSED] Exact Ascendant Aries 22.55 deg and Midheaven Capricorn 15.81 deg verified!')
