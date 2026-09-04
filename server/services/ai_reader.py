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

# ─── Gemini Structured Outputs Invocation ────────────────────────────────────

def generate_with_gemini(chart_summary: str, api_key: str) -> Optional[Dict[str, Any]]:
    """Invokes Google Gemini with structured JSON output using google-genai SDK."""
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""You are an elite psychological and archetypal astrologer.
Analyze the following Swiss Ephemeris astronomical calculation data:

{chart_summary}

Mission:
Synthesize the unique focal points of this specific chart and return a structured "storyboard" array.
Because every chart is unique, you determine the chapter titles based on this individual's standout signatures (e.g., 'The Big Three', 'Mental Wiring & Speech', 'Relational Geometry', 'Career Signature & Calling', 'Karmic & Transformative Edge').

Guidelines:
1. Each chapter must contain 2 to 4 concise sections.
2. In each section:
   - 'heading': e.g., 'Sun in Gemini (19.5°), House 2' or 'Moon Square Saturn'
   - 'body': Synthesized reading in tight, poetic, professional paragraphs (STRICTLY MAXIMUM 60 WORDS per section).
   - 'icon_hint': lowercase identifier keyword for visual rendering (e.g. 'gemini', 'taurus', 'sun', 'moon', 'saturn', 'mars', 'stellium', 'aspect_square', 'aspect_trine', 'mercury', 'pluto', 'ascendant').
3. Include an honest, grounding disclaimer string.
"""

        # Try gemini-2.5-flash, fallback to gemini-3.7-flash if needed
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_json_schema=StoryboardResponse.model_json_schema(),
                temperature=0.7,
            ),
        )

        if response and response.text:
            parsed = json.loads(response.text)
            validated = StoryboardResponse.model_validate(parsed)
            logger.info("Successfully generated AI Storyboard via Gemini")
            return validated.model_dump()
    except Exception as exc:
        logger.error(f"Gemini AI Reader invocation error: {exc}")
    return None

# ─── OpenAI Structured Outputs Invocation ────────────────────────────────────

def generate_with_openai(chart_summary: str, api_key: str) -> Optional[Dict[str, Any]]:
    """Invokes OpenAI API with structured JSON output."""
    try:
        import httpx

        prompt = f"""You are an elite psychological and archetypal astrologer.
Analyze the following Swiss Ephemeris astronomical calculation data:

{chart_summary}

Synthesize the unique focal points into a structured 'storyboard' of chapters and sections.
Follow this schema strictly:
{{
  "storyboard": [
    {{
      "chapter_title": "String (e.g., 'The Big Three', 'Career Signature')",
      "sections": [
        {{
          "heading": "String (e.g., 'Sun in Gemini (19.5°), House 2')",
          "body": "String (Synthesized reading, tight, poetic, professional, max 60 words)",
          "icon_hint": "String (e.g., 'gemini', 'stellium', 'aspect_square', 'saturn')"
        }}
      ]
    }}
  ],
  "disclaimer": "String"
}}
"""

        response = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                "messages": [{"role": "user", "content": prompt}],
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
            logger.info("Successfully generated AI Storyboard via OpenAI")
            return validated.model_dump()
    except Exception as exc:
        logger.error(f"OpenAI invocation error: {exc}")
    return None

# ─── High-Fidelity Algorithmic Synthesis Fallback ────────────────────────────

def generate_fallback_storyboard(western_chart: Dict[str, Any], user_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Deterministic synthesis engine that generates a fully compliant Storyboard
    directly from ephemeris planetary and house configurations when no API key is set.
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

    chapters = [
        StoryboardChapter(
            chapter_title="The Big Three: Core Axis",
            sections=[
                StoryboardSection(
                    heading=f"Sun in {sun_sign} ({sun_deg:.1f}°), House {sun_house}",
                    body=f"Your conscious solar fire radiates through {sun_sign} in the {sun_house} house. You lead through sovereign purpose, integrating will and vitality into tangible reality.",
                    icon_hint=sun_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Moon in {moon_sign} ({moon_deg:.1f}°), House {moon_house}",
                    body=f"Subconscious sanctuary anchored in {moon_sign} in the {moon_house} house. Emotional equilibrium demands visceral authenticity, cyclic retreat, and rooted inner safety.",
                    icon_hint=moon_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Ascendant in {asc_sign} ({asc_deg:.1f}°)",
                    body=f"Your eastern horizon projects the radiant mask of {asc_sign}. First impressions reflect immediate poise, navigational acuity, and instinctual curiosity toward the world.",
                    icon_hint=asc_sign.lower()
                ),
            ]
        ),
        StoryboardChapter(
            chapter_title="Mental Architecture & Drive",
            sections=[
                StoryboardSection(
                    heading=f"Mercury in {mercury.get('sign', 'Gemini')} ({mercury.get('degrees', 0):.1f}°), House {mercury.get('house', 3)}",
                    body=f"Cognitive faculties operate with precision in {mercury.get('sign', 'Gemini')}. Thought streams synthesize abstract connections swiftly, transforming observation into strategic articulation.",
                    icon_hint="mercury"
                ),
                StoryboardSection(
                    heading=f"Mars in {mars.get('sign', 'Aries')} ({mars.get('degrees', 0):.1f}°), House {mars.get('house', 1)}",
                    body=f"Volitional willpower and initiative driven through {mars.get('sign', 'Aries')}. Energy channels through decisive action, courage under ambiguity, and unwavering resolve.",
                    icon_hint="mars"
                ),
            ]
        ),
        StoryboardChapter(
            chapter_title="Relational & Value Dynamics",
            sections=[
                StoryboardSection(
                    heading=f"Venus in {venus.get('sign', 'Taurus')} ({venus.get('degrees', 0):.1f}°), House {venus.get('house', 2)}",
                    body=f"Aesthetic refinement and relational harmony calibrated in {venus.get('sign', 'Taurus')}. You magnetize resonance through mutual respect, loyalty, and organic elegance.",
                    icon_hint="venus"
                ),
                StoryboardSection(
                    heading=f"Jupiter in {jupiter.get('sign', 'Sagittarius')} ({jupiter.get('degrees', 0):.1f}°), House {jupiter.get('house', 9)}",
                    body=f"Philosophical expansion and abundance unfold through {jupiter.get('sign', 'Sagittarius')}. Fortune favors daring exploration, generous perspective, and lifelong learning.",
                    icon_hint="jupiter"
                ),
            ]
        ),
    ]

    # Add Aspect dynamics chapter if aspects are present
    if aspects:
        asp_sections = []
        for asp in aspects[:3]:
            icon = "aspect_trine" if asp.get("aspect") == "Trine" else ("aspect_square" if asp.get("aspect") == "Square" else "aspect_conjunction")
            asp_sections.append(
                StoryboardSection(
                    heading=f"{asp.get('planet_1')} {asp.get('aspect')} {asp.get('planet_2')}",
                    body=f"Dynamic {asp.get('nature')} tension linking {asp.get('planet_1')} and {asp.get('planet_2')} with an orb of {asp.get('orb', 0):.1f}°. Forges psychic depth and catalysts for personal mastery.",
                    icon_hint=icon
                )
            )
        chapters.append(
            StoryboardChapter(
                chapter_title="Aspectual Tension & Flow",
                sections=asp_sections
            )
        )

    # Add Career / Calling chapter
    chapters.append(
        StoryboardChapter(
            chapter_title="Career Signature & Calling",
            sections=[
                StoryboardSection(
                    heading=f"Midheaven (MC) in {mc_sign} ({mc_deg:.1f}°)",
                    body=f"Public legacy and overarching calling culminate in {mc_sign}. Vocational authority is achieved when merging personal integrity with societal contribution.",
                    icon_hint=mc_sign.lower()
                ),
                StoryboardSection(
                    heading=f"Saturn in {saturn.get('sign', 'Capricorn')} ({saturn.get('degrees', 0):.1f}°), House {saturn.get('house', 10)}",
                    body=f"Structural mastery and karmic patience anchored in {saturn.get('sign', 'Capricorn')}. Enduring achievements crystallize through consistent discipline and self-accountability.",
                    icon_hint="saturn"
                ),
            ]
        )
    )

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
