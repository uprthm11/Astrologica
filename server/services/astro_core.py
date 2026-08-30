"""
Core Astrological Constants, Swiss Ephemeris Utilities, and Dignities Matrix
"""
import swisseph as swe
from datetime import datetime
from typing import Tuple, Dict, Any, List

# Initialize Swiss Ephemeris built-in path
swe.set_ephe_path("")

ZODIAC_SIGNS: List[Dict[str, Any]] = [
    {"index": 1, "name": "Aries", "sanskrit": "Mesha", "glyph": "♈", "element": "Fire", "modality": "Cardinal", "ruler": "Mars"},
    {"index": 2, "name": "Taurus", "sanskrit": "Vrishabha", "glyph": "♉", "element": "Earth", "modality": "Fixed", "ruler": "Venus"},
    {"index": 3, "name": "Gemini", "sanskrit": "Mithuna", "glyph": "♊", "element": "Air", "modality": "Mutable", "ruler": "Mercury"},
    {"index": 4, "name": "Cancer", "sanskrit": "Karka", "glyph": "♋", "element": "Water", "modality": "Cardinal", "ruler": "Moon"},
    {"index": 5, "name": "Leo", "sanskrit": "Simha", "glyph": "♌", "element": "Fire", "modality": "Fixed", "ruler": "Sun"},
    {"index": 6, "name": "Virgo", "sanskrit": "Kanya", "glyph": "♍", "element": "Earth", "modality": "Mutable", "ruler": "Mercury"},
    {"index": 7, "name": "Libra", "sanskrit": "Tula", "glyph": "♎", "element": "Air", "modality": "Cardinal", "ruler": "Venus"},
    {"index": 8, "name": "Scorpio", "sanskrit": "Vrishchika", "glyph": "♏", "element": "Water", "modality": "Fixed", "ruler": "Mars"},
    {"index": 9, "name": "Sagittarius", "sanskrit": "Dhanu", "glyph": "♐", "element": "Fire", "modality": "Mutable", "ruler": "Jupiter"},
    {"index": 10, "name": "Capricorn", "sanskrit": "Makara", "glyph": "♑", "element": "Earth", "modality": "Cardinal", "ruler": "Saturn"},
    {"index": 11, "name": "Aquarius", "sanskrit": "Kumbha", "glyph": "♒", "element": "Air", "modality": "Fixed", "ruler": "Saturn"},
    {"index": 12, "name": "Pisces", "sanskrit": "Meena", "glyph": "♓", "element": "Water", "modality": "Mutable", "ruler": "Jupiter"},
]

PLANET_DEFS: List[Dict[str, Any]] = [
    {"id": "sun", "swe_id": swe.SUN, "name": "Sun", "vedic_name": "Surya", "glyph": "☉", "color": "#fbbf24"},
    {"id": "moon", "swe_id": swe.MOON, "name": "Moon", "vedic_name": "Chandra", "glyph": "☽", "color": "#e0e7ff"},
    {"id": "mercury", "swe_id": swe.MERCURY, "name": "Mercury", "vedic_name": "Budha", "glyph": "☿", "color": "#34d399"},
    {"id": "venus", "swe_id": swe.VENUS, "name": "Venus", "vedic_name": "Shukra", "glyph": "♀", "color": "#f472b6"},
    {"id": "mars", "swe_id": swe.MARS, "name": "Mars", "vedic_name": "Mangala", "glyph": "♂", "color": "#f87171"},
    {"id": "jupiter", "swe_id": swe.JUPITER, "name": "Jupiter", "vedic_name": "Guru", "glyph": "♃", "color": "#fb923c"},
    {"id": "saturn", "swe_id": swe.SATURN, "name": "Saturn", "vedic_name": "Shani", "glyph": "♄", "color": "#94a3b8"},
    {"id": "uranus", "swe_id": swe.URANUS, "name": "Uranus", "vedic_name": "Uranus", "glyph": "♅", "color": "#38bdf8"},
    {"id": "neptune", "swe_id": swe.NEPTUNE, "name": "Neptune", "vedic_name": "Neptune", "glyph": "♆", "color": "#818cf8"},
    {"id": "pluto", "swe_id": swe.PLUTO, "name": "Pluto", "vedic_name": "Pluto", "glyph": "♇", "color": "#c084fc"},
    {"id": "rahu", "swe_id": swe.TRUE_NODE, "name": "Rahu", "vedic_name": "Rahu (North Node)", "glyph": "☊", "color": "#a855f7"},
    {"id": "ketu", "swe_id": -1, "name": "Ketu", "vedic_name": "Ketu (South Node)", "glyph": "☋", "color": "#ec4899"},
]

# Exaltation, Debilitation and Combustion Orbs
PLANET_DIGNITIES = {
    "sun": {"exalted": "Aries", "exalt_deg": 10.0, "debilitated": "Libra", "own": ["Leo"], "combust_orb": 0.0},
    "moon": {"exalted": "Taurus", "exalt_deg": 3.0, "debilitated": "Scorpio", "own": ["Cancer"], "combust_orb": 12.0},
    "mercury": {"exalted": "Virgo", "exalt_deg": 15.0, "debilitated": "Pisces", "own": ["Gemini", "Virgo"], "combust_orb": 14.0},
    "venus": {"exalted": "Pisces", "exalt_deg": 27.0, "debilitated": "Virgo", "own": ["Taurus", "Libra"], "combust_orb": 10.0},
    "mars": {"exalted": "Capricorn", "exalt_deg": 28.0, "debilitated": "Cancer", "own": ["Aries", "Scorpio"], "combust_orb": 17.0},
    "jupiter": {"exalted": "Cancer", "exalt_deg": 5.0, "debilitated": "Capricorn", "own": ["Sagittarius", "Pisces"], "combust_orb": 11.0},
    "saturn": {"exalted": "Libra", "exalt_deg": 20.0, "debilitated": "Aries", "own": ["Capricorn", "Aquarius"], "combust_orb": 15.0},
    "rahu": {"exalted": "Taurus", "exalt_deg": 20.0, "debilitated": "Scorpio", "own": ["Aquarius"], "combust_orb": 0.0},
    "ketu": {"exalted": "Scorpio", "exalt_deg": 20.0, "debilitated": "Taurus", "own": ["Scorpio"], "combust_orb": 0.0},
}

NAKSHATRAS_LIST: List[Tuple[str, str, str]] = [
    ("Ashwini", "Ketu", "Horse's Head"),
    ("Bharani", "Venus", "Yoni / Womb"),
    ("Krittika", "Sun", "Razor / Flame"),
    ("Rohini", "Moon", "Chariot / Temple"),
    ("Mrigashira", "Mars", "Deer's Head"),
    ("Ardra", "Rahu", "Teardrop / Diamond"),
    ("Punarvasu", "Jupiter", "Bow and Quiver"),
    ("Pushya", "Saturn", "Cow's Udder / Flower"),
    ("Ashlesha", "Mercury", "Coiled Serpent"),
    ("Magha", "Ketu", "Royal Throne"),
    ("Purva Phalguni", "Venus", "Front Legs of Couch"),
    ("Uttara Phalguni", "Sun", "Back Legs of Couch"),
    ("Hasta", "Moon", "Open Hand"),
    ("Chitra", "Mars", "Bright Jewel"),
    ("Swati", "Rahu", "Young Shoot / Coral"),
    ("Vishakha", "Jupiter", "Triumphal Arch"),
    ("Anuradha", "Saturn", "Lotus Flower"),
    ("Jyeshtha", "Mercury", "Earring / Umbrella"),
    ("Mula", "Ketu", "Bunch of Roots"),
    ("Purva Ashadha", "Venus", "Elephant Tusk / Fan"),
    ("Uttara Ashadha", "Sun", "Small Bed / Planks"),
    ("Shravana", "Moon", "Three Footprints / Ear"),
    ("Dhanishta", "Mars", "Drum / Flute"),
    ("Shatabhisha", "Rahu", "Hundred Physicians"),
    ("Purva Bhadrapada", "Jupiter", "Front of Funeral Cot"),
    ("Uttara Bhadrapada", "Saturn", "Back of Funeral Cot"),
    ("Revati", "Mercury", "Pair of Fish / Drum"),
]

def format_dms(degrees_decimal: float) -> str:
    """Format decimal degrees into DD° MM' SS\" string."""
    total_sec = round(degrees_decimal * 3600)
    d = total_sec // 3600
    m = (total_sec % 3600) // 60
    s = total_sec % 60
    return f"{d:02d}° {m:02d}' {s:02d}\""

def to_sign_and_degree(longitude: float) -> Dict[str, Any]:
    """Convert absolute ecliptic longitude (0-360°) to Zodiac Sign and local sign degree."""
    lon = longitude % 360.0
    sign_idx = int(lon // 30.0)
    deg_in_sign = lon % 30.0
    sign_info = ZODIAC_SIGNS[sign_idx]
    
    return {
        "sign": sign_info["name"],
        "sanskrit_sign": sign_info["sanskrit"],
        "glyph": sign_info["glyph"],
        "element": sign_info["element"],
        "modality": sign_info["modality"],
        "ruler": sign_info["ruler"],
        "sign_index": sign_idx + 1,
        "degrees": round(deg_in_sign, 4),
        "total_degrees": round(lon, 4),
        "formatted": f"{sign_info['name']} {format_dms(deg_in_sign)}",
        "dms": format_dms(deg_in_sign),
    }

def parse_julian_day(date_str: str, time_str: str, utc_offset_str: str) -> Tuple[float, datetime]:
    """
    Parse date, time, and UTC offset string into Julian Day (UT) and localized datetime object.
    """
    clean_date = str(date_str).strip().replace("-", "/")
    parts_date = [int(p) for p in clean_date.split("/")]
    year, month, day = parts_date[0], parts_date[1], parts_date[2]
    
    clean_time = str(time_str).strip()
    parts_time = clean_time.split(":")
    hour = int(parts_time[0])
    minute = int(parts_time[1])
    second = int(parts_time[2]) if len(parts_time) > 2 else 0
    
    # Parse UTC offset, e.g. "+05:30", "-04:00", "+00:00"
    raw_offset = str(utc_offset_str).strip()
    sign = -1.0 if raw_offset.startswith("-") else 1.0
    cleaned_offset = raw_offset.lstrip("+-")
    offset_parts = cleaned_offset.split(":")
    offset_hours = float(offset_parts[0])
    offset_mins = float(offset_parts[1]) if len(offset_parts) > 1 else 0.0
    total_offset_hours = sign * (offset_hours + (offset_mins / 60.0))
    
    local_decimal_hour = hour + (minute / 60.0) + (second / 3600.0)
    ut_decimal_hour = local_decimal_hour - total_offset_hours
    
    jd = swe.julday(year, month, day, ut_decimal_hour)
    dt_obj = datetime(year, month, day, hour, minute, second)
    
    return jd, dt_obj
