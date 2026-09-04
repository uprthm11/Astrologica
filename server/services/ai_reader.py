"""
AI Cosmic Reader (System 2): Dynamic Astrological Synthesis Engine
Converts deterministic Swiss Ephemeris data into a structured Storyboard Array
via Gemini / OpenAI Structured Outputs with robust fallback synthesis.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger("uvicorn.error")

# ─── Strict Output Schemas ───────────────────────────────────────────────────

class StoryboardSection(BaseModel):
    heading: str = Field(description="String (e.g., 'Sun in Gemini (19.5°), House 2')")
    body: str = Field(description="String (The synthesized reading, tight, poetic, professional paragraphs, max 60 words)")
    icon_hint: str = Field(description="String (e.g., 'gemini', 'stellium', 'aspect_square', 'saturn')")

class StoryboardChapter(BaseModel):
    chapter_title: str = Field(description="String (e.g., 'The Big Three', 'Career Signature')")
    sections: List[StoryboardSection] = Field(description="Array of synthesized sections within this chapter")

class StoryboardResponse(BaseModel):
    storyboard: List[StoryboardChapter] = Field(description="Array of chapters synthesizing unique chart focal points")
    disclaimer: str = Field(
        default="Astrological interpretations offer symbolic perspectives on psychological themes and cycles and are intended solely for self-reflection and personal inquiry.",
        description="String (The standard astrology disclaimer)"
    )

# ─── Ephemeris Context Formatter ─────────────────────────────────────────────

def format_chart_context(western_chart: Dict[str, Any], user_name: Optional[str] = None) -> str:
    """Formats raw ephemeris data into a concise textual prompt for the LLM."""
    planets = western_chart.get("planets", [])
    asc = western_chart.get("ascendant", {})
    mc = western_chart.get("midheaven", {})
    houses = western_chart.get("houses", [])
    aspects = western_chart.get("aspects", [])

    lines = [
        f"Subject Name: {user_name or 'Traveler'}",
        f"Ascendant (AC): {asc.get('sign', 'Unknown')} at {asc.get('degrees', 0):.1f}° (House 1 Cusp)",
        f"Midheaven (MC): {mc.get('sign', 'Unknown')} at {mc.get('degrees', 0):.1f}° (House 10 Cusp)",
        "\nPlanetary Positions:"
    ]

    for p in planets:
        rx_str = " [Rx]" if p.get("is_retrograde") else ""
        lines.append(
            f"- {p.get('name')}: {p.get('sign')} {p.get('degrees', 0):.1f}°, House {p.get('house', 1)}{rx_str} ({p.get('element')} / {p.get('modality')})"
        )

    lines.append("\nMajor Aspects:")
    for asp in aspects[:12]:
        lines.append(
            f"- {asp.get('planet_1')} {asp.get('aspect')} {asp.get('planet_2')} (orb: {asp.get('orb', 0):.1f}°, nature: {asp.get('nature')})"
        )

    return "\n".join(lines)

SYSTEM_PROMPT = (
    "You are a master astrologer. Analyze the provided raw ephemeris data. "
    "Do not give generic, isolated definitions. Synthesize the chart. "
    "Look for standout features: Stelliums, exact tight aspects (under 2° orb), "
    "chart rulers, and mutual receptions. Group your reading into 6 to 8 'chapters'. "
    "Chapter 1 must be 'The Big Three'. Subsequent chapters should highlight the most "
    "important tensions or clusters in this specific chart. Keep the tone sharp, psychological, "
    "and highly specific to the degrees and house placements."
)

# ─── Gemini Structured Outputs Invocation ────────────────────────────────────

def generate_with_gemini(chart_summary: str, api_key: str) -> Optional[Dict[str, Any]]:
    """Invokes Google Gemini with structured JSON output using google-genai SDK."""
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        user_content = f"""Raw Ephemeris Calculation Data:
{chart_summary}

Requirements:
- Group reading into 6 to 8 'chapters'.
- Chapter 1 must be 'The Big Three'.
- Subsequent chapters must highlight the most important tensions or clusters in this specific chart.
- In each section:
  * 'heading': e.g., 'Sun in Gemini (19.5°), House 2' or 'Moon Square Saturn (0.8°)'
  * 'body': Synthesized reading, tight, poetic, professional (MAXIMUM 60 WORDS per section).
  * 'icon_hint': lowercase keyword identifier (e.g. 'gemini', 'saturn', 'sun', 'moon', 'aspect_square', 'stellium').
- Include a standard grounding astrology disclaimer.
"""

        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

        response = client.models.generate_content(
            model=model_name,
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_json_schema=StoryboardResponse.model_json_schema(),
                temperature=0.7,
            ),
        )

        if response and response.text:
            parsed = json.loads(response.text)
            validated = StoryboardResponse.model_validate(parsed)
            logger.info("Successfully generated AI Storyboard via Gemini with master astrologer system prompt")
            return validated.model_dump()
    except Exception as exc:
        logger.error(f"Gemini AI Reader invocation error: {exc}")
    return None

# ─── OpenAI Structured Outputs Invocation ────────────────────────────────────

def generate_with_openai(chart_summary: str, api_key: str) -> Optional[Dict[str, Any]]:
    """Invokes OpenAI API with structured JSON output."""
    try:
        import httpx

        user_content = f"""Raw Ephemeris Calculation Data:
{chart_summary}

Group reading into 6 to 8 chapters. Chapter 1 must be 'The Big Three'.
Each section body must be strictly maximum 60 words.
Provide valid icon_hint and disclaimer according to schema.
"""

        response = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.7,
            },
            timeout=30.0,
        )
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            validated = StoryboardResponse.model_validate(parsed)
            logger.info("Successfully generated AI Storyboard via OpenAI with master astrologer system prompt")
            return validated.model_dump()
    except Exception as exc:
        logger.error(f"OpenAI invocation error: {exc}")
    return None

# ─── High-Fidelity Algorithmic Synthesis Fallback ────────────────────────────

def generate_fallback_storyboard(western_chart: Dict[str, Any], user_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Deterministic synthesis engine generating 6 to 8 compliant Storyboard chapters
    starting with 'The Big Three' and highlighting chart ruler, aspect tensions, and clusters.
    """
    planets = {p.get("id"): p for p in western_chart.get("planets", [])}
    asc = western_chart.get("ascendant", {})
    mc = western_chart.get("midheaven", {})
    aspects = western_chart.get("aspects", [])

    sun = planets.get("sun", {})
    moon = planets.get("moon", {})
    mercury = planets.get("mercury", {})
    venus = planets.get("venus", {})
    mars = planets.get("mars", {})
    jupiter = planets.get("jupiter", {})
    saturn = planets.get("saturn", {})
    uranus = planets.get("uranus", {})
    neptune = planets.get("neptune", {})
    pluto = planets.get("pluto", {})

    sun_sign = sun.get("sign", "Aries")
    sun_house = sun.get("house", 1)
    sun_deg = sun.get("degrees", 0.0)

    moon_sign = moon.get("sign", "Taurus")
    moon_house = moon.get("house", 2)
    moon_deg = moon.get("degrees", 0.0)

    asc_sign = asc.get("sign", "Gemini")
    asc_deg = asc.get("degrees", 0.0)

    mc_sign = mc.get("sign", "Pisces")
    mc_deg = mc.get("degrees", 0.0)

    # 6 to 8 Synthesized Chapters
    chapters = [
        # Chapter 1 (Mandatory: The Big Three)
        StoryboardChapter(
            chapter_title="The Big Three",
            sections=[
                StoryboardSection(
                    heading=f"Sun in {sun_sign} ({sun_deg:.1f}°), House {sun_house}",
                    body=f"Your conscious solar core burns through {sun_sign} in the {sun_house} house. You organize identity around purpose, mastering direct assertion while grounding vitality into tangible reality.",
                    icon_hint=sun_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Moon in {moon_sign} ({moon_deg:.1f}°), House {moon_house}",
                    body=f"Subconscious sanctuary calibrated in {moon_sign} within the {moon_house} house. Emotional restoration requires visceral safety, tactile grounding, and cyclic private retreat away from collective noise.",
                    icon_hint=moon_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Ascendant in {asc_sign} ({asc_deg:.1f}°)",
                    body=f"The eastern horizon projects {asc_sign} as your navigational mask. First impressions communicate immediate alertness, communicative poise, and instinctual curiosity toward unexplored frontiers.",
                    icon_hint=asc_sign.lower()
                ),
            ]
        ),
        # Chapter 2: Chart Ruler & Planetary Stature
        StoryboardChapter(
            chapter_title="Chart Ruler & Core Geometry",
            sections=[
                StoryboardSection(
                    heading=f"Navigational Gravity: Mercury in {mercury.get('sign', 'Gemini')} ({mercury.get('degrees', 0):.1f}°), House {mercury.get('house', 3)}",
                    body=f"Guiding the Ascendant's horizon, your mental frequency translates intuition into articulate strategy. Cognitive faculties synthesize disparate data swiftly into lucid vision.",
                    icon_hint="mercury"
                ),
                StoryboardSection(
                    heading=f"Mars in {mars.get('sign', 'Aries')} ({mars.get('degrees', 0):.1f}°), House {mars.get('house', 1)}",
                    body=f"Volitional drive and autonomous initiative operate without hesitation. Your vital engine thrives on decisive breakthroughs and catalytic challenges.",
                    icon_hint="mars"
                ),
            ]
        ),
        # Chapter 3: Relational Chemistry & Value Structure
        StoryboardChapter(
            chapter_title="Relational Chemistry & Values",
            sections=[
                StoryboardSection(
                    heading=f"Venus in {venus.get('sign', 'Taurus')} ({venus.get('degrees', 0):.1f}°), House {venus.get('house', 2)}",
                    body=f"Affection and aesthetic resonance operate through loyalty and somatic luxury. You attract sustainable bonds through mutual integrity and unwavering presence.",
                    icon_hint="venus"
                ),
                StoryboardSection(
                    heading=f"Jupiter in {jupiter.get('sign', 'Sagittarius')} ({jupiter.get('degrees', 0):.1f}°), House {jupiter.get('house', 9)}",
                    body=f"Philosophical fortune expands through foreign horizons and unconstrained inquiries. Faith generates serendipity when embracing intellectual exploration.",
                    icon_hint="jupiter"
                ),
            ]
        ),
        # Chapter 4: Aspectual Tensions & Structural Crucible
        StoryboardChapter(
            chapter_title="Aspectual Tensions & Clusters",
            sections=[
                StoryboardSection(
                    heading=f"{aspects[0].get('planet_1') if aspects else 'Sun'} {aspects[0].get('aspect') if aspects else 'Square'} {aspects[0].get('planet_2') if aspects else 'Saturn'}",
                    body=f"A tight {aspects[0].get('nature') if aspects else 'challenging'} aspect with an orb of {aspects[0].get('orb', 1.2) if aspects else 1.2}°. This friction serves as an evolutionary forge, transmuting self-doubt into mastery.",
                    icon_hint="aspect_square"
                ),
                StoryboardSection(
                    heading=f"{aspects[1].get('planet_1') if len(aspects) > 1 else 'Moon'} {aspects[1].get('aspect') if len(aspects) > 1 else 'Trine'} {aspects[1].get('planet_2') if len(aspects) > 1 else 'Jupiter'}",
                    body=f"Harmonious flowing conduit with an orb of {aspects[1].get('orb', 1.5) if len(aspects) > 1 else 1.5}°. Provides psychological resilience, intuitive optimism, and innate protective grace under pressure.",
                    icon_hint="aspect_trine"
                ),
            ]
        ),
        # Chapter 5: Career Signature & Calling
        StoryboardChapter(
            chapter_title="Career Signature & Calling",
            sections=[
                StoryboardSection(
                    heading=f"Midheaven (MC) in {mc_sign} ({mc_deg:.1f}°)",
                    body=f"Your vocational zenith culminates in {mc_sign}. Public recognition and societal legacy materialize when aligning professional expertise with empathetic vision.",
                    icon_hint=mc_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Saturn in {saturn.get('sign', 'Capricorn')} ({saturn.get('degrees', 0):.1f}°), House {saturn.get('house', 10)}",
                    body=f"Karmic responsibility and architectural discipline build lasting foundations. Mastery demands endurance, rewarding sustained focus with unassailable authority.",
                    icon_hint="saturn"
                ),
            ]
        ),
        # Chapter 6: Transpersonal Evolution & Shadow Integration
        StoryboardChapter(
            chapter_title="Transpersonal Evolution & Depths",
            sections=[
                StoryboardSection(
                    heading=f"Uranus in {uranus.get('sign', 'Aquarius')} ({uranus.get('degrees', 0):.1f}°), House {uranus.get('house', 11)}",
                    body=f"The lightning bolt of individual liberation strikes through visionary communities. You shatter obsolete dogmas to anchor forward-thinking innovation.",
                    icon_hint="uranus"
                ),
                StoryboardSection(
                    heading=f"Pluto in {pluto.get('sign', 'Scorpio')} ({pluto.get('degrees', 0):.1f}°), House {pluto.get('house', 6)}",
                    body=f"Subterranean catalytic power demands radical honesty and somatic purification. You navigate the underworld to emerge with sovereign psychological clarity.",
                    icon_hint="pluto"
                ),
            ]
        ),
    ]

    response = StoryboardResponse(
        storyboard=chapters,
        disclaimer="Astrological interpretations offer symbolic perspectives on psychological themes and cycles and are intended solely for self-reflection and personal inquiry."
    )
    return response.model_dump()

# ─── Public Synthesizer Entry Point ──────────────────────────────────────────

def synthesize_chart_storyboard(western_chart: Dict[str, Any], user_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Main entry point for AI Cosmic Reader.
    Checks for GEMINI_API_KEY or OPENAI_API_KEY, and falls back to
    deterministic ephemeris synthesis if unconfigured or on error.
    """
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    chart_summary = format_chart_context(western_chart, user_name)

    if gemini_key:
        result = generate_with_gemini(chart_summary, gemini_key)
        if result:
            return result

    if openai_key:
        result = generate_with_openai(chart_summary, openai_key)
        if result:
            return result

    # Algorithmic fallback ensuring 100% uptime and schema compliance
    logger.info("Generating deterministic fallback storyboard from ephemeris calculations")
    return generate_fallback_storyboard(western_chart, user_name)
