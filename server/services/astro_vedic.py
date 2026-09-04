"""
Vedic (Sidereal / Jyotish) Astrological Calculation Service
"""
import swisseph as swe
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple, Optional
from .astro_core import (
    PLANET_DEFS,
    ZODIAC_SIGNS,
    PLANET_DIGNITIES,
    NAKSHATRAS_LIST,
    format_dms,
    to_sign_and_degree,
    parse_julian_day,
)

AYANAMSHA_MODES = {
    "lahiri": {"mode": swe.SIDM_LAHIRI, "name": "Lahiri (Chitrapaksha)"},
    "raman": {"mode": swe.SIDM_RAMAN, "name": "B.V. Raman"},
    "kp": {"mode": swe.SIDM_KRISHNAMURTI, "name": "Krishnamurti Paddhati (KP)"},
}

VIMSHOTTARI_LORDS: List[Tuple[str, int]] = [
    ("Ketu", 7),
    ("Venus", 20),
    ("Sun", 6),
    ("Moon", 10),
    ("Mars", 7),
    ("Rahu", 18),
    ("Jupiter", 16),
    ("Saturn", 19),
    ("Mercury", 17),
]

def calculate_nakshatra_and_pada(longitude: float) -> Dict[str, Any]:
    """Calculates Nakshatra (1-27), Pada (1-4), Lord, and degree span."""
    lon = longitude % 360.0
    nak_len = 360.0 / 27.0  # 13° 20' = 13.333333°
    pada_len = nak_len / 4.0 # 3° 20' = 3.333333°
    
    nak_idx = int(lon // nak_len) % 27
    deg_in_nak = lon % nak_len
    pada = int(deg_in_nak // pada_len) + 1
    
    name, lord, symbol = NAKSHATRAS_LIST[nak_idx]
    
    return {
        "index": nak_idx + 1,
        "name": name,
        "lord": lord,
        "symbol": symbol,
        "pada": pada,
        "degrees_in_nakshatra": round(deg_in_nak, 4),
        "formatted": f"{name} (Pada {pada})",
        "lord_formatted": f"Lord: {lord}",
    }

def calculate_navamsha_d9(longitude: float) -> Dict[str, Any]:
    """Calculates Navamsha (D9) sign index (0-11) and sign details."""
    lon = longitude % 360.0
    d9_len = 360.0 / 108.0 # 3° 20' = 3.333333°
    d9_idx = int(lon // d9_len) % 12
    sign_info = ZODIAC_SIGNS[d9_idx]
    
    return {
        "sign": sign_info["name"],
        "sanskrit": sign_info["sanskrit"],
        "glyph": sign_info["glyph"],
        "ruler": sign_info["ruler"],
        "sign_index": d9_idx + 1,
    }

def calculate_vimshottari_dashas(birth_dt: datetime, moon_sid_lon: float) -> Dict[str, Any]:
    """
    Computes 120-year Vimshottari Mahadasha timeline starting from the Moon's birth Nakshatra.
    Also calculates current active Mahadasha.
    """
    nak_len = 360.0 / 27.0
    nak_idx = int(moon_sid_lon // nak_len) % 27
    pos_in_nak = moon_sid_lon % nak_len
    fraction_spent = pos_in_nak / nak_len
    
    lord_start_idx = nak_idx % 9
    first_lord, total_years = VIMSHOTTARI_LORDS[lord_start_idx]
    remaining_years = total_years * (1.0 - fraction_spent)
    
    timeline = []
    current_start = birth_dt
    now = datetime.now(birth_dt.tzinfo) if birth_dt.tzinfo is not None else datetime.utcnow()
    current_active_dasha = None
    
    # 1st Mahadasha (balance at birth)
    first_end = current_start + timedelta(days=remaining_years * 365.25)
    first_entry = {
        "lord": first_lord,
        "start_date": current_start.strftime("%Y-%m-%d"),
        "end_date": first_end.strftime("%Y-%m-%d"),
        "duration_years": round(remaining_years, 2),
        "is_active": (current_start <= now < first_end),
    }
    timeline.append(first_entry)
    if first_entry["is_active"]:
        current_active_dasha = first_entry
    current_start = first_end
    
    # Subsequent 8 Mahadashas
    for i in range(1, 9):
        idx = (lord_start_idx + i) % 9
        lord, yrs = VIMSHOTTARI_LORDS[idx]
        end_dt = current_start + timedelta(days=yrs * 365.25)
        entry = {
            "lord": lord,
            "start_date": current_start.strftime("%Y-%m-%d"),
            "end_date": end_dt.strftime("%Y-%m-%d"),
            "duration_years": yrs,
            "is_active": (current_start <= now < end_dt),
        }
        timeline.append(entry)
        if entry["is_active"]:
            current_active_dasha = entry
        current_start = end_dt
    
    return {
        "birth_nakshatra_lord": first_lord,
        "balance_years_at_birth": round(remaining_years, 2),
        "current_mahadasha": current_active_dasha or timeline[0],
        "timeline": timeline,
    }

def calculate_vedic_chart(
    date_str: str,
    time_str: str,
    utc_offset_str: str,
    lat: float,
    lon: float,
    ayanamsha_name: str = "lahiri",
    tz_str: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes full Vedic (Sidereal / Jyotish) Astrological Chart with Rashis,
    Nakshatras, Padas, 12 Bhavas from Lagna, Navamsha (D9), and Vimshottari Dashas.
    """
    jd, dt_obj = parse_julian_day(date_str, time_str, utc_offset_str, lat=lat, lon=lon, tz_str=tz_str)
    
    # Configure Sidereal Ayanamsha
    ay_key = ayanamsha_name.lower().strip()
    ay_info = AYANAMSHA_MODES.get(ay_key, AYANAMSHA_MODES["lahiri"])
    swe.set_sid_mode(ay_info["mode"])
    ayanamsa_val = swe.get_ayanamsa_ut(jd)
    
    # Calculate Sidereal Ascendant (Lagna)
    raw_cusps_sid, ascmc_sid = swe.houses_ex(jd, lat, lon, b"W", swe.FLG_SIDEREAL)
    lagna_lon = ascmc_sid[0]
    lagna_sign_info = to_sign_and_degree(lagna_lon)
    lagna_nakshatra = calculate_nakshatra_and_pada(lagna_lon)
    lagna_d9 = calculate_navamsha_d9(lagna_lon)
    
    lagna_sign_idx = lagna_sign_info["sign_index"] # 1-12
    
    # Calculate Sidereal Planets
    planets = []
    planet_positions_map = {}
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
    
    # First pass: calculate all longitudes
    for p_def in PLANET_DEFS:
        p_id = p_def["id"]
        swe_id = p_def["swe_id"]
        
        if p_id == "ketu":
            rahu_pos = planet_positions_map.get("rahu")
            p_lon = (rahu_pos["longitude"] + 180.0) % 360.0 if rahu_pos else 0.0
            p_speed = rahu_pos["speed"] if rahu_pos else 0.0
        else:
            calc_res, _ = swe.calc_ut(jd, swe_id, flags)
            p_lon = calc_res[0]
            p_speed = calc_res[3]
        
        planet_positions_map[p_id] = {
            "longitude": p_lon,
            "speed": p_speed,
            "p_def": p_def,
        }
    
    sun_lon = planet_positions_map["sun"]["longitude"]
    
    # Second pass: compute Vedic metrics, Bhavas, Dignities
    for p_def in PLANET_DEFS:
        p_id = p_def["id"]
        p_info = planet_positions_map[p_id]
        p_lon = p_info["longitude"]
        p_speed = p_info["speed"]
        
        sign_info = to_sign_and_degree(p_lon)
        nak_info = calculate_nakshatra_and_pada(p_lon)
        d9_info = calculate_navamsha_d9(p_lon)
        
        # Calculate Bhava (House from Lagna in Whole Sign system)
        # Bhava 1 = Lagna sign, Bhava 2 = next sign, etc.
        bhava_num = ((sign_info["sign_index"] - lagna_sign_idx) % 12) + 1
        
        # Calculate Dignities / States
        dignity_cfg = PLANET_DIGNITIES.get(p_id, {})
        is_retrograde = bool(p_speed < 0 and p_id not in ["sun", "moon", "rahu", "ketu"])
        
        # Combustion from Sun
        combust_orb = dignity_cfg.get("combust_orb", 0.0)
        is_combust = False
        if combust_orb > 0 and p_id not in ["sun", "rahu", "ketu"]:
            diff_sun = abs(p_lon - sun_lon)
            dist_to_sun = min(diff_sun, 360.0 - diff_sun)
            is_combust = bool(dist_to_sun <= combust_orb)
        
        # Exalted / Debilitated / Own Sign
        exalted_sign = dignity_cfg.get("exalted")
        debilitated_sign = dignity_cfg.get("debilitated")
        own_signs = dignity_cfg.get("own", [])
        
        dignity_state = "Neutral"
        if sign_info["sign"] == exalted_sign:
            dignity_state = "Exalted (Uchcha)"
        elif sign_info["sign"] == debilitated_sign:
            dignity_state = "Debilitated (Neecha)"
        elif sign_info["sign"] in own_signs:
            dignity_state = "Own Sign (Swakshetra)"
        
        p_data = {
            "id": p_id,
            "name": p_def["name"],
            "vedic_name": p_def["vedic_name"],
            "glyph": p_def["glyph"],
            "color": p_def["color"],
            "longitude": round(p_lon, 4),
            "speed": round(p_speed, 6),
            "is_retrograde": is_retrograde,
            "is_combust": is_combust,
            "dignity": dignity_state,
            "rashi": sign_info["sign"],
            "sanskrit_rashi": sign_info["sanskrit_sign"],
            "rashi_glyph": sign_info["glyph"],
            "degrees": sign_info["degrees"],
            "dms": sign_info["dms"],
            "formatted": f"{p_def['name']} in {sign_info['sanskrit_sign']} ({sign_info['sign']}) {sign_info['dms']}",
            "bhava": bhava_num,
            "nakshatra": nak_info,
            "navamsha_d9": d9_info,
        }
        planets.append(p_data)
    
    # 12 Bhavas (Houses)
    bhavas = []
    for h in range(1, 13):
        rashi_idx = ((lagna_sign_idx - 1 + (h - 1)) % 12)
        rashi_info = ZODIAC_SIGNS[rashi_idx]
        occupying_planets = [p for p in planets if p["bhava"] == h]
        
        bhavas.append({
            "bhava": h,
            "rashi": rashi_info["name"],
            "sanskrit_rashi": rashi_info["sanskrit"],
            "rashi_glyph": rashi_info["glyph"],
            "lord": rashi_info["ruler"],
            "occupying_planets": [p["name"] for p in occupying_planets],
            "formatted": f"Bhava {h} ({rashi_info['sanskrit']}): {', '.join([p['name'] for p in occupying_planets]) or 'Empty'}",
        })
    
    # Vimshottari Dashas from Moon's Sidereal Longitude
    moon_lon = planet_positions_map["moon"]["longitude"]
    dashas = calculate_vimshottari_dashas(dt_obj, moon_lon)
    
    moon_data = next(p for p in planets if p["id"] == "moon")
    sun_data = next(p for p in planets if p["id"] == "sun")
    
    return {
        "zodiac_system": "Vedic (Sidereal / Jyotish)",
        "ayanamsha": {
            "name": ay_info["name"],
            "key": ay_key,
            "value_degrees": round(ayanamsa_val, 4),
            "formatted": f"{ay_info['name']} ({format_dms(ayanamsa_val)})",
        },
        "lagna": {
            "name": "Lagna (Ascendant)",
            "longitude": round(lagna_lon, 4),
            "rashi": lagna_sign_info["sign"],
            "sanskrit_rashi": lagna_sign_info["sanskrit_sign"],
            "degrees": lagna_sign_info["degrees"],
            "formatted": f"Lagna {lagna_sign_info['sanskrit_sign']} ({lagna_sign_info['sign']}) {lagna_sign_info['dms']}",
            "nakshatra": lagna_nakshatra,
            "navamsha_d9": lagna_d9,
        },
        "chandra_rashi": {
            "name": "Chandra Rashi (Moon Sign)",
            "rashi": moon_data["rashi"],
            "sanskrit_rashi": moon_data["sanskrit_rashi"],
            "degrees": moon_data["degrees"],
            "formatted": moon_data["formatted"],
            "nakshatra": moon_data["nakshatra"],
        },
        "surya_rashi": {
            "name": "Surya Rashi (Sun Sign)",
            "rashi": sun_data["rashi"],
            "sanskrit_rashi": sun_data["sanskrit_rashi"],
            "degrees": sun_data["degrees"],
            "formatted": sun_data["formatted"],
            "nakshatra": sun_data["nakshatra"],
        },
        "planets": planets,
        "bhavas": bhavas,
        "vimshottari_dashas": dashas,
        "meta": {
            "date": date_str,
            "time": time_str,
            "utc_offset": utc_offset_str,
            "lat": lat,
            "lon": lon,
            "julian_day": round(jd, 5),
        }
    }
