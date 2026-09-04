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
    raw_planets = western_chart.get("planets", [])
    planets = list(raw_planets.values()) if isinstance(raw_planets, dict) else raw_planets
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

    lines.append("\nTight Exact Aspects (Strict Orb <= 2.0° only):")
    # Strict Aspect Pruning: ONLY pass aspects to the LLM that have an orb <= 2.0°
    tight_aspects = [
        asp for asp in aspects 
        if float(asp.get("orb", 999.0)) <= 2.0
    ]
    tight_aspects.sort(key=lambda a: float(a.get("orb", 999.0)))

    if tight_aspects:
        for asp in tight_aspects:
            lines.append(
                f"- {asp.get('planet_1')} {asp.get('aspect')} {asp.get('planet_2')} (orb: {float(asp.get('orb', 0)):.2f}°, nature: {asp.get('nature')})"
            )
    else:
        lines.append("- None (no aspects with orb <= 2.0° detected in this chart)")

    return "\n".join(lines)

SYSTEM_PROMPT = """You are a master psychological astrologer. Your goal is to synthesize the provided chart into concrete, behavioral reality. 

STRICT RULES FOR WRITING:
1. NO ASTROLOGY WORD SALAD: Never use decorative, abstract phrases like 'conscious solar core,' 'navigational mask,' 'karmic responsibility,' or 'vibrational frequency.' Speak normally.
2. BE CONCRETE: Describe specific scenarios the reader can test against their own week. Instead of writing 'You communicate with poise,' write 'People probably clock you as a talker before they learn anything else.'
3. ACCURACY OVER VIBES: Never hallucinate traits. Taurus is steady, sensory, and resists being rushed; it is NEVER about 'unexplored frontiers.' 
4. SYNTHESIS IS REQUIRED: Do not read a planet and a house separately. If the Sun is in Gemini (curious, scattered) but sitting in the 2nd House (resources, stability), you must explain how the house grounds the sign (e.g., 'Your need to explain things is in service of building a specific skill that is genuinely yours. You want to own what you know.'). 
5. TONE: Keep the tone sharp, direct, empathetic, and highly specific. Write as if you are talking to a smart friend across a table."""

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
- Subsequent chapters should highlight the most important tensions or clusters in this specific chart.
- STRICT ASPECT PRUNING: Focus ONLY on aspects in the 'Tight Exact Aspects (Strict Orb <= 2.0° only)' list. Completely ignore and never mention or highlight any aspects with orbs greater than 2.0°.
- In each section:
  * 'heading': e.g., 'Sun in Gemini (19.5°), House 2' or 'Mercury Square Mars (0.34°)'
  * 'body': Concrete behavioral synthesis following the strict writing rules (MAXIMUM 60 WORDS per section).
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
            logger.info("Successfully generated AI Storyboard via Gemini with behavioral psychologist prompt")
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
STRICT ASPECT PRUNING: Focus ONLY on aspects with orb <= 2.0°. Completely ignore and never mention or highlight any aspects with orbs greater than 2.0°.
Each section body must be strictly maximum 60 words and adhere to the strict behavioral writing rules (no word salad, concrete, synthesized).
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
    raw_planets = western_chart.get("planets", [])
    planets = raw_planets if isinstance(raw_planets, dict) else {p.get("id", p.get("name", "").lower()): p for p in raw_planets}
    asc = western_chart.get("ascendant", {})
    mc = western_chart.get("midheaven", {})
    aspects = western_chart.get("aspects", [])
    tight_aspects = [
        asp for asp in aspects 
        if float(asp.get("orb", 999.0)) <= 2.0
    ]
    tight_aspects.sort(key=lambda a: float(a.get("orb", 999.0)))

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
                    body=f"Your core drive in {sun_sign} plays out directly in house {sun_house}. Rather than getting lost in theory, you test your identity through tangible output, focusing energy where you can build real, measurable traction.",
                    icon_hint=sun_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Moon in {moon_sign} ({moon_deg:.1f}°), House {moon_house}",
                    body=f"With your Moon in {moon_sign} in house {moon_house}, your emotional reset button is sensory and private. When stressed, you pull back from collective noise to decompress in a predictable, calm space before deciding what to do next.",
                    icon_hint=moon_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Ascendant in {asc_sign} ({asc_deg:.1f}°)",
                    body=f"With {asc_sign} rising, people clock your immediate presence and conversational pace before learning anything else. You enter unfamiliar rooms with an instinctual radar, sizing up dynamics before committing.",
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
                    body=f"Mercury in {mercury.get('sign', 'Gemini')} in house {mercury.get('house', 3)} shapes how you break down problems. You process facts quickly, cutting through fluff to translate raw data into clear, functional steps.",
                    icon_hint="mercury"
                ),
                StoryboardSection(
                    heading=f"Mars in {mars.get('sign', 'Aries')} ({mars.get('degrees', 0):.1f}°), House {mars.get('house', 1)}",
                    body=f"Mars in {mars.get('sign', 'Aries')} in house {mars.get('house', 1)} is your operational engine. You get restless when initiatives stall in discussion, preferring to take direct action and iterate in real time.",
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
                    body=f"Venus in {venus.get('sign', 'Taurus')} in house {venus.get('house', 2)} defines how you build trust. In relationships and work, you prioritize consistency and follow-through over performative promises, valuing bonds that hold up under pressure.",
                    icon_hint="venus"
                ),
                StoryboardSection(
                    heading=f"Jupiter in {jupiter.get('sign', 'Sagittarius')} ({jupiter.get('degrees', 0):.1f}°), House {jupiter.get('house', 9)}",
                    body=f"Jupiter in {jupiter.get('sign', 'Sagittarius')} in house {jupiter.get('house', 9)} points to where you take calculated risks. You broaden your perspective by testing assumptions against firsthand experience rather than taking conventional wisdom at face value.",
                    icon_hint="jupiter"
                ),
            ]
        ),
        # Chapter 4: Aspectual Tensions & Structural Crucible (Strict Orb <= 2.0°)
        StoryboardChapter(
            chapter_title="Aspectual Tensions & Clusters",
            sections=(
                [
                    StoryboardSection(
                        heading=f"{tight_aspects[0].get('planet_1')} {tight_aspects[0].get('aspect')} {tight_aspects[0].get('planet_2')} ({float(tight_aspects[0].get('orb', 0)):.2f}°)",
                        body=f"This tight alignment ({float(tight_aspects[0].get('orb', 0)):.2f}° orb) creates an acute behavioral trigger. When stress hits, you instinctively turn that internal tension into decisive focus rather than letting it sit idle.",
                        icon_hint=f"aspect_{str(tight_aspects[0].get('aspect', 'square')).lower()}"
                    ),
                    StoryboardSection(
                        heading=f"{tight_aspects[1].get('planet_1')} {tight_aspects[1].get('aspect')} {tight_aspects[1].get('planet_2')} ({float(tight_aspects[1].get('orb', 0)):.2f}°)",
                        body=f"A focused {tight_aspects[1].get('nature', 'flowing')} link ({float(tight_aspects[1].get('orb', 0)):.2f}° orb). This operates like reflexive muscle memory, letting you bridge these two areas smoothly without second-guessing yourself.",
                        icon_hint=f"aspect_{str(tight_aspects[1].get('aspect', 'trine')).lower()}"
                    ),
                ]
                if len(tight_aspects) >= 2
                else [
                    StoryboardSection(
                        heading=f"{tight_aspects[0].get('planet_1')} {tight_aspects[0].get('aspect')} {tight_aspects[0].get('planet_2')} ({float(tight_aspects[0].get('orb', 0)):.2f}°)",
                        body=f"This primary tension ({float(tight_aspects[0].get('orb', 0)):.2f}° orb) is your central psychological checkpoint. It forces you to balance assertion with patience during high-stakes moments.",
                        icon_hint=f"aspect_{str(tight_aspects[0].get('aspect', 'square')).lower()}"
                    ),
                    StoryboardSection(
                        heading="Singular Harmonic Crucible",
                        body="Without secondary acute collisions under 2°, your other habits operate with room to breathe rather than compounding into repetitive internal gridlock.",
                        icon_hint="stellium"
                    ),
                ]
                if len(tight_aspects) == 1
                else [
                    StoryboardSection(
                        heading="Unhindered Planetary Matrix",
                        body="This chart has no rigid angular collisions under 2° orb. Your day-to-day decisions operate with clean autonomy rather than chronic internal friction.",
                        icon_hint="stellium"
                    ),
                    StoryboardSection(
                        heading="Harmonic Diffusion",
                        body="Without harsh geometric gridlocks under 2°, your habits adjust smoothly across different settings instead of locking into acute conflict.",
                        icon_hint="aspect_trine"
                    ),
                ]
            )
        ),
        # Chapter 5: Career Signature & Calling
        StoryboardChapter(
            chapter_title="Career Signature & Calling",
            sections=[
                StoryboardSection(
                    heading=f"Midheaven (MC) in {mc_sign} ({mc_deg:.1f}°)",
                    body=f"Your vocational signature culminates in {mc_sign}. People respect you for delivering steady results, especially when untangling messy, ambiguous problems that overwhelm others.",
                    icon_hint=mc_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Saturn in {saturn.get('sign', 'Capricorn')} ({saturn.get('degrees', 0):.1f}°), House {saturn.get('house', 10)}",
                    body=f"Saturn in {saturn.get('sign', 'Capricorn')} in house {saturn.get('house', 10)} is about compound discipline. You do not rely on shortcuts; you build standing and authority through demonstrable competence and earned respect.",
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
                    body=f"Uranus in {uranus.get('sign', 'Aquarius')} in house {uranus.get('house', 11)} kicks in when you spot outdated procedures. You naturally advocate for cleaner, more practical systems that help groups move faster.",
                    icon_hint="uranus"
                ),
                StoryboardSection(
                    heading=f"Pluto in {pluto.get('sign', 'Scorpio')} ({pluto.get('degrees', 0):.1f}°), House {pluto.get('house', 6)}",
                    body=f"Pluto in {pluto.get('sign', 'Scorpio')} in house {pluto.get('house', 6)} shapes your working standard. You have low patience for superficial patches, digging into root causes until the underlying system actually functions.",
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
