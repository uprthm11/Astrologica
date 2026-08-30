"""
Western (Tropical) Astrological Calculation Service
"""
import swisseph as swe
from typing import Dict, Any, List
from .astro_core import (
    PLANET_DEFS,
    ZODIAC_SIGNS,
    format_dms,
    to_sign_and_degree,
    parse_julian_day,
)

MAJOR_ASPECTS = [
    {"name": "Conjunction", "angle": 0.0, "orb": 8.0, "glyph": "☌", "nature": "neutral"},
    {"name": "Sextile", "angle": 60.0, "orb": 6.0, "glyph": "⚹", "nature": "harmonious"},
    {"name": "Square", "angle": 90.0, "orb": 7.0, "glyph": "□", "nature": "challenging"},
    {"name": "Trine", "angle": 120.0, "orb": 8.0, "glyph": "△", "nature": "harmonious"},
    {"name": "Opposition", "angle": 180.0, "orb": 8.0, "glyph": "☍", "nature": "challenging"},
]

def find_house_for_lon(lon: float, cusps: List[float]) -> int:
    """Determine the house (1-12) where a given ecliptic longitude resides."""
    for i in range(12):
        cusp_start = cusps[i]
        cusp_end = cusps[(i + 1) % 12]
        
        if cusp_start <= cusp_end:
            if cusp_start <= lon < cusp_end:
                return i + 1
        else:
            # Crosses 0° Aries
            if lon >= cusp_start or lon < cusp_end:
                return i + 1
    return 1

def calculate_western_chart(
    date_str: str,
    time_str: str,
    utc_offset_str: str,
    lat: float,
    lon: float,
    house_system: str = "placidus"
) -> Dict[str, Any]:
    """
    Computes full Western (Tropical) Astrological Chart with planetary positions,
    houses (Placidus or Whole Sign), and major aspects.
    """
    jd, dt_obj = parse_julian_day(date_str, time_str, utc_offset_str)
    
    # House System code: 'P' = Placidus, 'W' = Whole Sign
    hsys_code = b"W" if house_system.lower() in ["whole_sign", "wholesign", "w"] else b"P"
    
    # Calculate Houses and Asc/MC
    raw_cusps, ascmc = swe.houses(jd, lat, lon, hsys_code)
    cusps_list = list(raw_cusps)
    
    asc_lon = ascmc[0]
    mc_lon = ascmc[1]
    
    asc_info = to_sign_and_degree(asc_lon)
    mc_info = to_sign_and_degree(mc_lon)
    
    # Houses metadata
    houses = []
    for idx, c_lon in enumerate(cusps_list):
        h_info = to_sign_and_degree(c_lon)
        houses.append({
            "house": idx + 1,
            "cusp_longitude": round(c_lon, 4),
            "sign": h_info["sign"],
            "glyph": h_info["glyph"],
            "degrees": h_info["degrees"],
            "formatted": f"House {idx + 1}: {h_info['formatted']}",
        })
    
    # Calculate Planets
    planets = []
    planet_positions_map = {}
    
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED
    
    for p_def in PLANET_DEFS:
        p_id = p_def["id"]
        swe_id = p_def["swe_id"]
        
        if p_id == "ketu":
            # Ketu is opposite Rahu (180°)
            rahu_pos = planet_positions_map.get("rahu")
            if rahu_pos:
                p_lon = (rahu_pos["longitude"] + 180.0) % 360.0
                p_speed = rahu_pos["speed"]
            else:
                p_lon = 0.0
                p_speed = 0.0
        else:
            calc_res, _ = swe.calc_ut(jd, swe_id, flags)
            p_lon = calc_res[0]
            p_speed = calc_res[3]
        
        sign_info = to_sign_and_degree(p_lon)
        house_num = find_house_for_lon(p_lon, cusps_list)
        is_retrograde = bool(p_speed < 0 and p_id not in ["sun", "moon", "rahu", "ketu"])
        
        p_data = {
            "id": p_id,
            "name": p_def["name"],
            "glyph": p_def["glyph"],
            "color": p_def["color"],
            "longitude": round(p_lon, 4),
            "speed": round(p_speed, 6),
            "is_retrograde": is_retrograde,
            "sign": sign_info["sign"],
            "sign_glyph": sign_info["glyph"],
            "element": sign_info["element"],
            "modality": sign_info["modality"],
            "degrees": sign_info["degrees"],
            "formatted": f"{p_def['name']} in {sign_info['formatted']}" + (" (Rx)" if is_retrograde else ""),
            "dms": sign_info["dms"],
            "house": house_num,
        }
        
        planets.append(p_data)
        planet_positions_map[p_id] = p_data
    
    # Calculate Aspects between Planets
    aspects = []
    p_keys = [p for p in planets if p["id"] not in ["rahu", "ketu"]]
    
    for i in range(len(p_keys)):
        for j in range(i + 1, len(p_keys)):
            p1 = p_keys[i]
            p2 = p_keys[j]
            
            lon1 = p1["longitude"]
            lon2 = p2["longitude"]
            
            diff = abs(lon1 - lon2)
            angular_dist = min(diff, 360.0 - diff)
            
            for asp_def in MAJOR_ASPECTS:
                target_ang = asp_def["angle"]
                max_orb = asp_def["orb"]
                actual_orb = abs(angular_dist - target_ang)
                
                if actual_orb <= max_orb:
                    aspects.append({
                        "planet_1": p1["name"],
                        "planet_1_glyph": p1["glyph"],
                        "planet_2": p2["name"],
                        "planet_2_glyph": p2["glyph"],
                        "aspect": asp_def["name"],
                        "aspect_glyph": asp_def["glyph"],
                        "nature": asp_def["nature"],
                        "angle": target_ang,
                        "actual_angle": round(angular_dist, 2),
                        "orb": round(actual_orb, 2),
                        "formatted": f"{p1['name']} {asp_def['name']} {p2['name']} (orb: {round(actual_orb, 2)}°)",
                    })
    
    return {
        "zodiac_system": "Western (Tropical)",
        "house_system": "Whole Sign" if hsys_code == b"W" else "Placidus",
        "ascendant": {
            "name": "Ascendant (AC)",
            "longitude": round(asc_lon, 4),
            "sign": asc_info["sign"],
            "degrees": asc_info["degrees"],
            "formatted": f"Ascendant {asc_info['formatted']}",
        },
        "midheaven": {
            "name": "Midheaven (MC)",
            "longitude": round(mc_lon, 4),
            "sign": mc_info["sign"],
            "degrees": mc_info["degrees"],
            "formatted": f"Midheaven {mc_info['formatted']}",
        },
        "planets": planets,
        "houses": houses,
        "aspects": aspects,
        "meta": {
            "date": date_str,
            "time": time_str,
            "utc_offset": utc_offset_str,
            "lat": lat,
            "lon": lon,
            "julian_day": round(jd, 5),
        }
    }
