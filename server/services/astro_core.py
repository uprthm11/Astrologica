"""
Core Astrological Constants, Swiss Ephemeris Utilities, and Dignities Matrix
"""
import swisseph as swe
import re
from datetime import datetime, timezone, timedelta
from typing import Tuple, Dict, Any, List, Optional
try:
    from zoneinfo import ZoneInfo
except ImportError:
    ZoneInfo = None
import pytz
from timezonefinder import TimezoneFinder

# Initialize Swiss Ephemeris built-in path
swe.set_ephe_path("")

_tf: Optional[TimezoneFinder] = None

def get_timezone_finder() -> TimezoneFinder:
    global _tf
    if _tf is None:
        _tf = TimezoneFinder()
    return _tf

def parse_offset_to_hours(offset_str: str) -> float:
    """
    Parses any offset format like '+05:30', '-04:00', '+5.5', '5.5', '+0530', 'UTC+05:30'
    into precise fractional hours, e.g. 5.5 for +05:30.
    """
    s = str(offset_str).strip()
    s = re.sub(r'^(UTC|GMT)', '', s, flags=re.IGNORECASE).strip()
    sign = -1.0 if s.startswith('-') else 1.0
    s_clean = s.lstrip('+-')
    
    if ':' in s_clean:
        parts = s_clean.split(':')
        h = float(parts[0])
        m = float(parts[1]) if len(parts) > 1 else 0.0
        s_sec = float(parts[2]) if len(parts) > 2 else 0.0
        return sign * (h + m / 60.0 + s_sec / 3600.0)
    elif '.' in s_clean:
        return sign * float(s_clean)
    elif len(s_clean) == 4 and s_clean.isdigit():
        h = float(s_clean[:2])
        m = float(s_clean[2:])
        return sign * (h + m / 60.0)
    else:
        try:
            return sign * float(s_clean)
        except ValueError:
            return 0.0

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

def parse_julian_day(
    date_str: str,
    time_str: str,
    utc_offset_str: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    tz_str: Optional[str] = None
) -> Tuple[float, datetime]:
    """
    Parse date, time, and timezone/UTC offset into Julian Day (UT) and localized datetime object.
    Overhauled to use pytz and zoneinfo with geographical timezone resolution (e.g. Asia/Kolkata)
    to prevent fractional timezone truncation and accurately compute time-dependent house cusps.
    """
    clean_date = str(date_str).strip().replace("-", "/")
    parts_date = [int(p) for p in clean_date.split("/")]
    year, month, day = parts_date[0], parts_date[1], parts_date[2]
    
    clean_time = str(time_str).strip()
    parts_time = clean_time.split(":")
    hour = int(parts_time[0])
    minute = int(parts_time[1])
    second = int(parts_time[2]) if len(parts_time) > 2 else 0

    resolved_tz = None
    tz_name = None

    # 1. Attempt explicit IANA timezone name if provided
    if tz_str and str(tz_str).strip():
        cand = str(tz_str).strip()
        if ZoneInfo:
            try:
                resolved_tz = ZoneInfo(cand)
                tz_name = cand
            except Exception:
                pass
        if resolved_tz is None:
            try:
                resolved_tz = pytz.timezone(cand)
                tz_name = cand
            except Exception:
                pass

    # 2. Attempt geographical timezone lookup from latitude & longitude
    if resolved_tz is None and lat is not None and lon is not None:
        try:
            tf = get_timezone_finder()
            cand = tf.timezone_at(lat=float(lat), lng=float(lon))
            if cand:
                if ZoneInfo:
                    try:
                        resolved_tz = ZoneInfo(cand)
                        tz_name = cand
                    except Exception:
                        pass
                if resolved_tz is None:
                    try:
                        resolved_tz = pytz.timezone(cand)
                        tz_name = cand
                    except Exception:
                        pass
        except Exception:
            resolved_tz = None

    # 3. If IANA timezone was resolved, localize and compute exact UTC datetime
    if resolved_tz is not None:
        try:
            if ZoneInfo and isinstance(resolved_tz, ZoneInfo):
                dt_local = datetime(year, month, day, hour, minute, second, tzinfo=resolved_tz)
                dt_utc = dt_local.astimezone(timezone.utc)
            else:
                dt_naive = datetime(year, month, day, hour, minute, second)
                dt_local = resolved_tz.localize(dt_naive)
                dt_utc = dt_local.astimezone(pytz.utc)

            ut_decimal_hour = (
                dt_utc.hour 
                + (dt_utc.minute / 60.0) 
                + (dt_utc.second / 3600.0) 
                + (dt_utc.microsecond / 3600000000.0)
            )
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_decimal_hour)
            return jd, dt_local
        except Exception:
            pass

    # 4. Fallback: Parse explicit fractional UTC offset string
    if utc_offset_str is not None and str(utc_offset_str).strip():
        total_offset_hours = parse_offset_to_hours(str(utc_offset_str))
    else:
        total_offset_hours = 0.0

    dt_local = datetime(year, month, day, hour, minute, second)
    dt_utc = dt_local - timedelta(hours=total_offset_hours)
    
    ut_decimal_hour = (
        dt_utc.hour 
        + (dt_utc.minute / 60.0) 
        + (dt_utc.second / 3600.0) 
        + (dt_utc.microsecond / 3600000000.0)
    )
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_decimal_hour)
    
    return jd, dt_local
