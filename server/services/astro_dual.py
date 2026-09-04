"""
Dual Comparative Astrological Calculation Service (Western + Vedic Synthesis)
"""
from typing import Dict, Any, Optional
from .astro_western import calculate_western_chart
from .astro_vedic import calculate_vedic_chart

def calculate_dual_chart(
    date_str: str,
    time_str: str,
    utc_offset_str: str,
    lat: float,
    lon: float,
    ayanamsha_name: str = "lahiri",
    house_system: str = "placidus",
    tz_str: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes both Western (Tropical) and Vedic (Sidereal) charts side-by-side
    along with precession shift analytical commentary.
    """
    western = calculate_western_chart(
        date_str, time_str, utc_offset_str, lat, lon, house_system, tz_str=tz_str
    )
    vedic = calculate_vedic_chart(
        date_str, time_str, utc_offset_str, lat, lon, ayanamsha_name, tz_str=tz_str
    )
    
    # Extract Key Dual Placements
    sun_w = next(p for p in western["planets"] if p["id"] == "sun")
    moon_w = next(p for p in western["planets"] if p["id"] == "moon")
    asc_w = western["ascendant"]
    
    sun_v = next(p for p in vedic["planets"] if p["id"] == "sun")
    moon_v = next(p for p in vedic["planets"] if p["id"] == "moon")
    asc_v = vedic["lagna"]
    
    ayanamsa_val = vedic["ayanamsha"]["value_degrees"]
    
    # Comparative Precession Commentary
    sun_shifted = sun_w["sign"] != sun_v["rashi"]
    moon_shifted = moon_w["sign"] != moon_v["rashi"]
    asc_shifted = asc_w["sign"] != asc_v["rashi"]
    
    comparison = {
        "precession_shift_degrees": ayanamsa_val,
        "ayanamsha_used": vedic["ayanamsha"]["name"],
        "sun_comparison": {
            "tropical_sign": sun_w["sign"],
            "tropical_degree": sun_w["degrees"],
            "tropical_formatted": sun_w["formatted"],
            "sidereal_rashi": sun_v["rashi"],
            "sanskrit_rashi": sun_v["sanskrit_rashi"],
            "sidereal_degree": sun_v["degrees"],
            "sidereal_formatted": sun_v["formatted"],
            "nakshatra": sun_v["nakshatra"]["name"],
            "pada": sun_v["nakshatra"]["pada"],
            "has_sign_shifted": sun_shifted,
            "explanation": (
                f"Your Sun shifts backward by approximately {round(ayanamsa_val, 1)}° from Tropical {sun_w['sign']} "
                f"to Sidereal {sun_v['rashi']} (Nakshatra: {sun_v['nakshatra']['name']})."
                if sun_shifted
                else f"Your Sun remains in {sun_w['sign']} across both systems, residing at {sun_v['degrees']}° in Sidereal {sun_v['rashi']} ({sun_v['nakshatra']['name']})."
            )
        },
        "moon_comparison": {
            "tropical_sign": moon_w["sign"],
            "tropical_degree": moon_w["degrees"],
            "tropical_formatted": moon_w["formatted"],
            "sidereal_rashi": moon_v["rashi"],
            "sanskrit_rashi": moon_v["sanskrit_rashi"],
            "sidereal_degree": moon_v["degrees"],
            "sidereal_formatted": moon_v["formatted"],
            "nakshatra": moon_v["nakshatra"]["name"],
            "pada": moon_v["nakshatra"]["pada"],
            "has_sign_shifted": moon_shifted,
            "explanation": (
                f"Your Moon shifts by ~{round(ayanamsa_val, 1)}° from Tropical {moon_w['sign']} "
                f"to Sidereal {moon_v['rashi']} (Nakshatra: {moon_v['nakshatra']['name']})."
                if moon_shifted
                else f"Your Moon remains in {moon_w['sign']} in both systems."
            )
        },
        "ascendant_comparison": {
            "tropical_sign": asc_w["sign"],
            "tropical_degree": asc_w["degrees"],
            "tropical_formatted": asc_w["formatted"],
            "sidereal_rashi": asc_v["rashi"],
            "sanskrit_rashi": asc_v["sanskrit_rashi"],
            "sidereal_degree": asc_v["degrees"],
            "sidereal_formatted": asc_v["formatted"],
            "nakshatra": asc_v["nakshatra"]["name"],
            "pada": asc_v["nakshatra"]["pada"],
            "has_sign_shifted": asc_shifted,
        },
        "synthesis_summary": (
            f"Due to the Earth's axial precession ({round(ayanamsa_val, 2)}° Ayanamsha difference), "
            f"Western Tropical astrology aligns with Earth's seasons, while Vedic Sidereal astrology "
            f"aligns with the visible fixed constellations."
        )
    }
    
    return {
        "status": "success",
        "western": western,
        "vedic": vedic,
        "comparison": comparison,
        "meta": western["meta"],
    }
