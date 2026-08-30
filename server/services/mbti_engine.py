"""
Psychometric Assessment & Jungian Cognitive Function Engine
"""
from typing import Dict, Any, List, Optional, Tuple

COGNITIVE_FUNCTIONS: Dict[str, Dict[str, Any]] = {
    "Ni": {
        "code": "Ni",
        "name": "Introverted Intuition",
        "attitude": "Introverted",
        "process": "Intuition (Perceiving)",
        "glyph": "🧠",
        "color": "#a855f7",
        "description": "Synthesizes deep underlying patterns, unconscious symbols, and strategic future vision into holistic insights."
    },
    "Ne": {
        "code": "Ne",
        "name": "Extraverted Intuition",
        "attitude": "Extraverted",
        "process": "Intuition (Perceiving)",
        "glyph": "💡",
        "color": "#38bdf8",
        "description": "Explores emerging possibilities, interdisciplinary connections, conceptual brainstorming, and alternative scenarios."
    },
    "Si": {
        "code": "Si",
        "name": "Introverted Sensing",
        "attitude": "Introverted",
        "process": "Sensing (Perceiving)",
        "glyph": "📜",
        "color": "#10b981",
        "description": "Compares present occurrences with rich internal repositories of past experiences, somatic memory, and proven precedents."
    },
    "Se": {
        "code": "Se",
        "name": "Extraverted Sensing",
        "attitude": "Extraverted",
        "process": "Sensing (Perceiving)",
        "glyph": "⚡",
        "color": "#fbbf24",
        "description": "Engages directly with immediate tactile reality, physical aesthetics, real-time environment cues, and swift concrete action."
    },
    "Ti": {
        "code": "Ti",
        "name": "Introverted Thinking",
        "attitude": "Introverted",
        "process": "Thinking (Judging)",
        "glyph": "🔬",
        "color": "#34d399",
        "description": "Constructs refined internal logical frameworks, deconstructs first principles, and seeks absolute conceptual precision."
    },
    "Te": {
        "code": "Te",
        "name": "Extraverted Thinking",
        "attitude": "Extraverted",
        "process": "Thinking (Judging)",
        "glyph": "⚙️",
        "color": "#6366f1",
        "description": "Organizes external resources, structures logical workflows, prioritizes empirical efficiency, and drives objective execution."
    },
    "Fi": {
        "code": "Fi",
        "name": "Introverted Feeling",
        "attitude": "Introverted",
        "process": "Feeling (Judging)",
        "glyph": "💎",
        "color": "#f472b6",
        "description": "Honors personal authenticity, deeply felt moral integrity, individual values, and empathetic emotional resonance."
    },
    "Fe": {
        "code": "Fe",
        "name": "Extraverted Feeling",
        "attitude": "Extraverted",
        "process": "Feeling (Judging)",
        "glyph": "🤝",
        "color": "#ec4899",
        "description": "Fosters interpersonal harmony, nurtures community rapport, attends to collective cultural values, and synchronizes social emotions."
    }
}

MBTI_ARCHETYPES_DATABASE: Dict[str, Dict[str, Any]] = {
    "INTJ": {
        "mbti_type": "INTJ",
        "archetype": "The Architect",
        "title": "Strategic Visionary & Systems Builder",
        "description": "Innovative, highly independent strategic thinkers driven by cognitive precision, ambitious vision, and systematic execution.",
        "strengths": ["Strategic Long-term Vision", "High Intellectual Independence", "Determined System Builder", "Decisive & Objective"],
        "growth_areas": ["Openness to Emotional Nuance", "Patience with Unstructured Environments", "Balancing Vision with Physical Reality"],
        "astrological_synergy": "Synergizes strongly with Saturnian discipline (Capricorn/Aquarius) and Uranian original insight, channeled through focused Mercury."
    },
    "INTP": {
        "mbti_type": "INTP",
        "archetype": "The Logician",
        "title": "Abstract Theorist & Conceptual Analyst",
        "description": "Inquisitive, analytical philosophers fascinated by universal principles, theoretical systems, and intricate intellectual puzzles.",
        "strengths": ["First-Principles Logic", "Creative Ideation & Openness", "Objective Problem Decomposition", "Voracious Curiosity"],
        "growth_areas": ["Translating Concepts into Action", "Emotional Attunement with Others", "Navigating Repetitive Routines"],
        "astrological_synergy": "Reflects Mercurial analytical curiosity (Gemini/Virgo) and Jupiterian theoretical breadth, probing universal laws."
    },
    "ENTJ": {
        "mbti_type": "ENTJ",
        "archetype": "The Commander",
        "title": "Decisive Leader & Architect of Change",
        "description": "Charismatic, formidable leaders who naturally organize complex resources, drive organizational strategy, and manifest ambitious goals.",
        "strengths": ["Strategic Organizational Leadership", "Decisive Execution & Drive", "High Efficiency & Directness", "Transformational Vision"],
        "growth_areas": ["Practicing Empathetic Listening", "Appreciating Incremental Processes", "Managing Chronic Stress & Rest"],
        "astrological_synergy": "Embodies Solar executive willpower (Leo/Aries) combined with Martian tactical initiative and Saturnian governance."
    },
    "ENTP": {
        "mbti_type": "ENTP",
        "archetype": "The Debater",
        "title": "Dynamic Innovator & Boundary Breaker",
        "description": "Quick-witted, intellectually versatile nonconformists who thrive on challenging status-quo paradigms and discovering novel opportunities.",
        "strengths": ["Rapid Lateral Brainstorming", "Charismatic Intellectual Agility", "Fearless Challenging of Dogma", "Adaptive Resilience"],
        "growth_areas": ["Following Through to Completion", "Sensitivity to Others' Emotional Boundaries", "Grounding in Routine Logistics"],
        "astrological_synergy": "Mirrors Mercurial wit (Gemini) combined with Uranian revolutionary spark and Jupiterian expansive dialogue."
    },
    "INFJ": {
        "mbti_type": "INFJ",
        "archetype": "The Advocate",
        "title": "Mystic Idealist & Compassionate Sage",
        "description": "Quiet, deeply intuitive visionaries guided by profound humanistic values, empathetic insight, and a passion for spiritual growth.",
        "strengths": ["Deep Psychological Intuition", "Compassionate Visionary Guidance", "Principled Moral Clarity", "Holistic Global Thinking"],
        "growth_areas": ["Preventing Emotional Burnout", "Releasing Perfectionist Pressures", "Grounding in Everyday Sensory Life"],
        "astrological_synergy": "Resonates with Neptunian/Piscean spiritual depth, Moon/Cancer emotional empathy, and Jupiterian philosophical insight."
    },
    "INFP": {
        "mbti_type": "INFP",
        "archetype": "The Mediator",
        "title": "Authentic Poet & Soul Alchemist",
        "description": "Gentle, imaginative idealists dedicated to personal authenticity, moral beauty, poetic expression, and individual potential.",
        "strengths": ["Profound Authenticity & Empathy", "Vivid Creative Imagination", "Open-Minded Compassion", "Deep Dedication to Values"],
        "growth_areas": ["Handling Constructive Criticism", "Maintaining Structured Daily Routines", "Asserting Personal Boundaries"],
        "astrological_synergy": "Harmonizes with Venusian artistic sensitivity (Taurus/Pisces) and Lunar emotional nuance, seeking authentic soul harmony."
    },
    "ENFJ": {
        "mbti_type": "ENFJ",
        "archetype": "The Protagonist",
        "title": "Inspirational Catalyst & Community Builder",
        "description": "Radiant, empathetic mentors who intuitively understand people, cultivate collective harmony, and inspire purposeful transformation.",
        "strengths": ["Charismatic Interpersonal Warmth", "Empathetic Community Leadership", "Inspirational Communication", "Collaborative Catalyst"],
        "growth_areas": ["Setting Healthy Personal Boundaries", "Honoring Personal Needs Over Group Demands", "Tolerating Inevitable Conflict"],
        "astrological_synergy": "Channeled through Solar warmth (Leo), Jupiterian mentorship (Sagittarius), and Venusian social harmony (Libra)."
    },
    "ENFP": {
        "mbti_type": "ENFP",
        "archetype": "The Campaigner",
        "title": "Enthusiastic Pioneer & Free Spirit",
        "description": "Vibrant, creative catalysts who see boundless potential in people and ideas, inspiring positive change with boundless passion.",
        "strengths": ["Infectious Optimism & Energy", "Dynamic Creative Versatility", "Deep Empathetic Connection", "Original Perspective"],
        "growth_areas": ["Focusing Long-Term Energy", "Managing Practical Administrative Detail", "Overcommitting to New Pursuits"],
        "astrological_synergy": "Radiates Solar exuberance (Sagittarius/Leo), Mercurial associative spark, and Venusian aesthetic warmth."
    },
    "ISTJ": {
        "mbti_type": "ISTJ",
        "archetype": "The Logistician",
        "title": "Steadfast Anchor & Pillar of Integrity",
        "description": "Dependable, meticulous realists who uphold institutional integrity, organizational order, precision, and loyal commitment.",
        "strengths": ["Unwavering Reliability & Integrity", "Systematic Practical Organization", "Direct & Honest Communication", "Calm Under Pressure"],
        "growth_areas": ["Adapting to Sudden Paradigm Shifts", "Expressing Emotional Reassurance", "Embracing Unconventional Methods"],
        "astrological_synergy": "Directly embodies Saturnian stewardship (Capricorn) and Mercurial precision (Virgo), grounding celestial archetypes in solid reality."
    },
    "ISFJ": {
        "mbti_type": "ISFJ",
        "archetype": "The Defender",
        "title": "Devoted Caregiver & Quiet Guardian",
        "description": "Warm, conscientious protectors who quietly maintain stability, care for loved ones, and uphold cherished traditions with grace.",
        "strengths": ["Compassionate Attentiveness", "Patience & Practical Support", "Exceptional Memory for People", "Devoted Loyalty"],
        "growth_areas": ["Advocating for Personal Needs", "Embracing Necessary Systemic Changes", "Avoiding Overextension for Others"],
        "astrological_synergy": "Rooted in Lunar nurturing (Cancer) and Venusian grace (Taurus), creating harmonious and protective sanctuaries."
    },
    "ESTJ": {
        "mbti_type": "ESTJ",
        "archetype": "The Executive",
        "title": "Organized Administrator & Community Pillar",
        "description": "Pragmatic, structured leaders who bring order, operational excellence, clear ethical standards, and direct accountability.",
        "strengths": ["Exceptional Project Management", "Clear Direct Accountability", "Dedication to Order & Quality", "Reliable Pillar of Community"],
        "growth_areas": ["Flexibility with Emerging Unorthodoxies", "Softening Direct Critiques", "Validating Subjective Emotions"],
        "astrological_synergy": "Channels Martian decisiveness (Aries) anchored by Saturnian law and order (Capricorn) with Solar authority."
    },
    "ESFJ": {
        "mbti_type": "ESFJ",
        "archetype": "The Consul",
        "title": "Gracious Host & Social Anchor",
        "description": "Supportive, attentive community builders who foster togetherness, celebrate traditions, and ensure everyone feels valued and supported.",
        "strengths": ["Exceptional Social Attunement", "Dependable Practical Organization", "Warm Harmonious Energy", "Loyal Supportive Ally"],
        "growth_areas": ["Coping with Social Disapproval", "Navigating Ambiguous Conflict", "Carving Out Sacred Solo Time"],
        "astrological_synergy": "Shines with Venusian social cohesion (Libra/Taurus) and Lunar protective instinct (Cancer), nurturing community life."
    },
    "ISTP": {
        "mbti_type": "ISTP",
        "archetype": "The Virtuoso",
        "title": "Master Artisan & Tactical Problem Solver",
        "description": "Calm, observant craftspeople who master physical tools, dissect mechanical systems, and resolve crises with agile precision.",
        "strengths": ["Calm Tactical Crisis Management", "Technical & Mechanical Mastery", "Adaptable Practical Efficiency", "Independent Composure"],
        "growth_areas": ["Long-Range Emotional Commitments", "Verbalizing Inner Thoughts", "Navigating Strict Bureaucracies"],
        "astrological_synergy": "Blends Martian technical precision (Scorpio/Aries) with Mercurial dexterity (Gemini/Virgo), mastering physical systems."
    },
    "ISFP": {
        "mbti_type": "ISFP",
        "archetype": "The Adventurer",
        "title": "Spontaneous Artist & Quiet Explorer",
        "description": "Gentle, aesthetically gifted individualists who live in spontaneous sensory flow, expressing inner emotion through tactile art.",
        "strengths": ["Keen Aesthetic & Sensory Sense", "Authentic Nonjudgmental Presence", "Spontaneous Adaptability", "Deep Empathy for Nature"],
        "growth_areas": ["Long-Term Financial & Career Planning", "Assertive Conflict Resolution", "Avoiding Excessive Self-Isolation"],
        "astrological_synergy": "Vibrates with Venusian artistic grace (Taurus/Libra) and Neptunian poetic intuition (Pisces), experiencing the world as living art."
    },
    "ESTP": {
        "mbti_type": "ESTP",
        "archetype": "The Entrepreneur",
        "title": "Dynamic Catalyst & Bold Risk-Taker",
        "description": "High-energy, charismatic realists who navigate dynamic social and physical environments with sharp instincts and fearless action.",
        "strengths": ["Instantaneous Crisis Reaction", "High Social Magnetism & Charm", "Pragmatic Hands-On Solutionism", "Fearless Adventure"],
        "growth_areas": ["Anticipating Long-Term Repercussions", "Navigating Theoretical Constraints", "Patience with Deliberate Processes"],
        "astrological_synergy": "Fires up Martian dynamic courage (Aries) and Solar magnetism (Leo), thriving in the immediate moment."
    },
    "ESFP": {
        "mbti_type": "ESFP",
        "archetype": "The Entertainer",
        "title": "Vibrant Performer & Joyous Catalyst",
        "description": "Playful, warm-hearted enthusiasts who bring joy, vibrancy, aesthetic flair, and generous camaraderie wherever they go.",
        "strengths": ["Irresistible Joie de Vivre", "Warm Generous Inclusiveness", "Spontaneous Aesthetic Expression", "Practical Empathy"],
        "growth_areas": ["Structuring Long-Term Responsibilities", "Navigating Complex Theoretical Analysis", "Avoiding Impulsive Escapism"],
        "astrological_synergy": "Exudes Solar radiance (Leo) and Venusian celebration (Taurus/Libra), turning daily life into an uplifting stage."
    }
}

# --- 24-Item Psychometric Question Bank (6 per axis) ---
ASSESSMENT_QUESTIONS: List[Dict[str, Any]] = [
    # --- Axis 1: Energy (Extraversion vs Introversion) ---
    {
        "id": 1,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "When facing a high-energy social weekend with numerous gatherings:",
        "option_a": {
            "text": "I feel energized, invigorated, and excited to actively participate and connect with many people.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "I feel the need to preserve personal space and recharge in quiet solitude with focused activities.",
            "trait": "I",
            "val": -1
        }
    },
    {
        "id": 2,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "When working through a complex, unfamiliar challenge:",
        "option_a": {
            "text": "I prefer to talk it through out loud, brainstorm dynamically with peers, and externalize my thoughts.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "I prefer to contemplate it internally in depth before presenting a refined conclusion.",
            "trait": "I",
            "val": -1
        }
    },
    {
        "id": 3,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "In your daily environment and professional rhythm, you feel most in your element when:",
        "option_a": {
            "text": "Engaged in multiple active conversations, collaborative initiatives, and dynamic stimuli.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "Immersed in sustained deep-focus sessions with minimal external interruptions.",
            "trait": "I",
            "val": -1
        }
    },
    {
        "id": 4,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "When entering a room of unfamiliar people, your natural inclination is to:",
        "option_a": {
            "text": "Introduce yourself freely, initiate lively rapport, and seek out new connections.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "Observe the atmosphere quietly, wait for organic openings, or connect deeply with one or two individuals.",
            "trait": "I",
            "val": -1
        }
    },
    {
        "id": 5,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "Regarding your circle of friends and intellectual collaborators:",
        "option_a": {
            "text": "I maintain a broad, diverse network of acquaintances across varied walks of life.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "I invest deeply in a select, intimate inner circle built on profound trust and mutual understanding.",
            "trait": "I",
            "val": -1
        }
    },
    {
        "id": 6,
        "axis": "EI",
        "axis_name": "Energy Orientation (Extraversion vs Introversion)",
        "prompt": "After a long, demanding week of intense work, what truly restores your vitality?",
        "option_a": {
            "text": "Meeting friends for dinner, attending an event, or engaging in active external stimulation.",
            "trait": "E",
            "val": 1
        },
        "option_b": {
            "text": "A calm, quiet evening at home with a book, personal project, or restful atmosphere.",
            "trait": "I",
            "val": -1
        }
    },

    # --- Axis 2: Information / Mind (Sensing vs Intuition) ---
    {
        "id": 7,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "When learning a new subject or evaluating an opportunity, you first gravitate toward:",
        "option_a": {
            "text": "Concrete facts, verified data, tangible applications, and immediate practical details.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "Underlying theories, future possibilities, abstract frameworks, and symbolic patterns.",
            "trait": "N",
            "val": -1
        }
    },
    {
        "id": 8,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "When describing an event or experience to others, you naturally focus on:",
        "option_a": {
            "text": "Chronological, sequential accuracy and vivid sensory descriptions of what actually occurred.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "The overall thematic impression, underlying meaning, and symbolic significance.",
            "trait": "N",
            "val": -1
        }
    },
    {
        "id": 9,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "When presented with a novel, unorthodox idea, your instinctive instinct is to:",
        "option_a": {
            "text": "Examine whether it has proven precedent, realistic viability, and immediate utility.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "Envision how it could disrupt existing paradigms and branch into uncharted future territory.",
            "trait": "N",
            "val": -1
        }
    },
    {
        "id": 10,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "In your daily perspective, you tend to see the world primarily through the lens of:",
        "option_a": {
            "text": "What is concrete, present, observable, and measurable in current reality.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "What could be, speculative potential, hidden implications, and future trajectories.",
            "trait": "N",
            "val": -1
        }
    },
    {
        "id": 11,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "When solving practical problems, you feel most confident when relying on:",
        "option_a": {
            "text": "Proven methodologies, established best practices, and direct sensory verification.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "Original intuitive hunches, conceptual models, and novel lateral connections.",
            "trait": "N",
            "val": -1
        }
    },
    {
        "id": 12,
        "axis": "SN",
        "axis_name": "Information Processing (Sensing vs Intuition)",
        "prompt": "You are more naturally admired for being:",
        "option_a": {
            "text": "Grounded, realistic, accurate, and deeply attuned to tangible detail.",
            "trait": "S",
            "val": 1
        },
        "option_b": {
            "text": "Visionary, conceptual, innovative, and attuned to the bigger picture.",
            "trait": "N",
            "val": -1
        }
    },

    # --- Axis 3: Decisions / Nature (Thinking vs Feeling) ---
    {
        "id": 13,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "When making an important critical decision, your ultimate benchmark is:",
        "option_a": {
            "text": "Objective logic, rigorous consistency, impartial fairness, and empirical efficacy.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "Human empathy, core personal values, relational impact, and individual authenticity.",
            "trait": "F",
            "val": -1
        }
    },
    {
        "id": 14,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "When someone close to you shares a distressing problem, your first natural response is to:",
        "option_a": {
            "text": "Analyze the root cause and systematically formulate an actionable, rational solution.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "Offer warm emotional presence, active validation, and deep empathetic understanding.",
            "trait": "F",
            "val": -1
        }
    },
    {
        "id": 15,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "When evaluating a debate or argument, you are most unsettled by:",
        "option_a": {
            "text": "Logical fallacies, sloppy reasoning, factual inconsistencies, and flawed premises.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "Cruelty, callousness, disrespect for human dignity, and lack of compassion.",
            "trait": "F",
            "val": -1
        }
    },
    {
        "id": 16,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "In teamwork and leadership, you believe it is more vital to be:",
        "option_a": {
            "text": "Direct, fair, and uncompromising in pursuing high standards of competence.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "Encouraging, supportive, and dedicated to building emotional safety and harmony.",
            "trait": "F",
            "val": -1
        }
    },
    {
        "id": 17,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "When providing feedback to a colleague or collaborator:",
        "option_a": {
            "text": "I prioritize clear, frank critique focused on optimizing performance and fixing errors.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "I carefully cushion my observations with encouragement to protect morale and connection.",
            "trait": "F",
            "val": -1
        }
    },
    {
        "id": 18,
        "axis": "TF",
        "axis_name": "Decision Making (Thinking vs Feeling)",
        "prompt": "When a rule or policy conflicts with an individual's unique emotional circumstances:",
        "option_a": {
            "text": "The rule must be upheld impartially to maintain justice and systematic integrity.",
            "trait": "T",
            "val": 1
        },
        "option_b": {
            "text": "Compassion and individual extenuating circumstances should allow for flexible grace.",
            "trait": "F",
            "val": -1
        }
    },

    # --- Axis 4: Lifestyle / Tactics (Judging vs Perceiving) ---
    {
        "id": 19,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "When organizing your schedule, vacations, or projects, you prefer:",
        "option_a": {
            "text": "A clear, well-structured plan with defined milestones, deadlines, and booked itineraries.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "A flexible, open-ended framework that allows for spontaneous changes and unexpected detours.",
            "trait": "P",
            "val": -1
        }
    },
    {
        "id": 20,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "When working on a major deadline-driven project, your working style tends to be:",
        "option_a": {
            "text": "Steady, disciplined progression scheduled well in advance to avoid last-minute rush.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "Dynamic bursts of creative adrenaline and intense flow close to the target deadline.",
            "trait": "P",
            "val": -1
        }
    },
    {
        "id": 21,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "In your physical space and digital desktop, you feel most at peace with:",
        "option_a": {
            "text": "Orderly, categorized, tidy environments with designated spaces for everything.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "Organic, dynamic arrangements where ongoing projects remain visibly accessible.",
            "trait": "P",
            "val": -1
        }
    },
    {
        "id": 22,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "When a settled decision is unexpectedly reopened for deliberation:",
        "option_a": {
            "text": "I feel frustrated by the inefficiency and disruption to closure and momentum.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "I welcome the opportunity to explore new data, refine possibilities, and adapt.",
            "trait": "P",
            "val": -1
        }
    },
    {
        "id": 23,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "Your ideal lifestyle is best characterized as:",
        "option_a": {
            "text": "Structured, predictable, deliberate, with clear boundaries and steady commitments.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "Spontaneous, adventurous, adaptable, responsive to emerging opportunities.",
            "trait": "P",
            "val": -1
        }
    },
    {
        "id": 24,
        "axis": "JP",
        "axis_name": "Lifestyle & Execution (Judging vs Perceiving)",
        "prompt": "Once you have completed a task or reached a conclusion, your immediate feeling is:",
        "option_a": {
            "text": "Deep satisfaction at checking it off, settling the matter, and archiving closure.",
            "trait": "J",
            "val": 1
        },
        "option_b": {
            "text": "Curiosity regarding what interesting new door or avenue this has unlocked next.",
            "trait": "P",
            "val": -1
        }
    }
]

def calculate_jungian_cognitive_stack(mbti_type: str) -> Dict[str, Any]:
    """
    Computes the full 8-function Jungian cognitive architecture (John Beebe 8-Function Model)
    for any of the 16 MBTI personality types.
    """
    mbti = mbti_type.upper().strip()
    if len(mbti) != 4 or not all(c in "EISNTFJP" for c in mbti):
        mbti = "INTJ"
        
    e_i, s_n, t_f, j_p = mbti[0], mbti[1], mbti[2], mbti[3]
    
    p_func = "N" if s_n == "N" else "S"
    j_func = "T" if t_f == "T" else "F"
    
    if e_i == "E":
        if j_p == "J":
            dom_code = j_func + "e"
            aux_code = p_func + "i"
        else:
            dom_code = p_func + "e"
            aux_code = j_func + "i"
    else:
        if j_p == "J":
            dom_code = p_func + "i"
            aux_code = j_func + "e"
        else:
            dom_code = j_func + "i"
            aux_code = p_func + "e"
            
    def opposite_dim(f: str) -> str:
        dim_map = {"N": "S", "S": "N", "T": "F", "F": "T"}
        return dim_map[f[0]] + f[1]
        
    tert_code = opposite_dim(aux_code)[0] + dom_code[1]
    inf_code = opposite_dim(dom_code)[0] + aux_code[1]
    
    # Shadow stack (opposing attitudes)
    opposing_code = dom_code[0] + ("i" if dom_code[1] == "e" else "e")
    witch_code = aux_code[0] + ("i" if aux_code[1] == "e" else "e")
    trickster_code = tert_code[0] + ("i" if tert_code[1] == "e" else "e")
    demon_code = inf_code[0] + ("i" if inf_code[1] == "e" else "e")
    
    primary_stack = [
        {"position": 1, "archetype": "Dominant (Hero)", "role": "Lead conscious cognitive lens & primary identity driver", **COGNITIVE_FUNCTIONS[dom_code]},
        {"position": 2, "archetype": "Auxiliary (Parent)", "role": "Supportive balancing function providing wisdom & responsibility", **COGNITIVE_FUNCTIONS[aux_code]},
        {"position": 3, "archetype": "Tertiary (Child)", "role": "Playful, creative relief function that can become defensive under stress", **COGNITIVE_FUNCTIONS[tert_code]},
        {"position": 4, "archetype": "Inferior (Aspirant)", "role": "Vulnerable doorway to the unconscious & source of lifelong aspiration", **COGNITIVE_FUNCTIONS[inf_code]},
    ]
    
    shadow_stack = [
        {"position": 5, "archetype": "Opposing Role", "role": "Defensive shadow mirroring the dominant function with stubborn skepticism", **COGNITIVE_FUNCTIONS[opposing_code]},
        {"position": 6, "archetype": "Witch / Senex (Critical Parent)", "role": "Critical shadow holding harsh internal judgment and authoritarian limits", **COGNITIVE_FUNCTIONS[witch_code]},
        {"position": 7, "archetype": "Trickster", "role": "Deceptive shadow creating cognitive paradoxes to defend the tertiary child", **COGNITIVE_FUNCTIONS[trickster_code]},
        {"position": 8, "archetype": "Demon / Daimon", "role": "Deepest unconscious function that can either undermine or facilitate profound rebirth", **COGNITIVE_FUNCTIONS[demon_code]},
    ]
    
    return {
        "mbti_type": mbti,
        "primary_stack": primary_stack,
        "shadow_stack": shadow_stack,
        "dominant": primary_stack[0],
        "auxiliary": primary_stack[1],
        "tertiary": primary_stack[2],
        "inferior": primary_stack[3],
    }

def get_pci_band(pci_score: int) -> str:
    """Classifies numerical Preference Clarity Index into standardized psychometric bands."""
    if pci_score >= 30:
        return "Very Clear"
    elif pci_score >= 20:
        return "Clear"
    elif pci_score >= 10:
        return "Moderate"
    else:
        return "Slight"

def evaluate_psychometric_assessment(responses: List[Any]) -> Dict[str, Any]:
    """
    Evaluates responses to the psychometric assessment.
    Supports:
    - 24-item array of integers (+1 for Option A, -1 for Option B) or strings ('A' / 'B')
    - 4-item array (legacy fallback: [a1, a2, a3, a4])
    """
    # Initialize dimension counts
    counts = {"E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0}
    
    if len(responses) == 4:
        # Legacy 4-question mapping
        a1, a2, a3, a4 = responses[0], responses[1], responses[2], responses[3]
        counts["E" if a1 > 0 else "I"] = 6
        counts["S" if a2 > 0 else "N"] = 6
        counts["T" if a3 > 0 else "F"] = 6
        counts["J" if a4 > 0 else "P"] = 6
    else:
        # Full 24-question evaluation
        for idx, item in enumerate(ASSESSMENT_QUESTIONS):
            if idx < len(responses):
                resp = responses[idx]
                # Accept int (+1/-1), or dict, or string
                val = 1
                if isinstance(resp, dict):
                    val = resp.get("val", 1 if resp.get("value") == "A" else -1)
                elif isinstance(resp, str):
                    val = 1 if resp.upper().strip() in ["A", "1", "TRUE", "+1", item["option_a"]["trait"]] else -1
                elif isinstance(resp, (int, float)):
                    val = 1 if resp > 0 else -1
                
                axis = item["axis"]
                if val > 0:
                    counts[item["option_a"]["trait"]] += 1
                else:
                    counts[item["option_b"]["trait"]] += 1
    
    # Calculate Axis Preferences, Percentages, and PCIs
    def process_axis(dim1: str, dim2: str, axis_label: str) -> Dict[str, Any]:
        c1 = counts[dim1]
        c2 = counts[dim2]
        total = c1 + c2 or 6
        
        pref = dim1 if c1 >= c2 else dim2
        p1_pct = round((c1 / total) * 100)
        p2_pct = 100 - p1_pct
        
        diff = abs(c1 - c2)
        # Scaled PCI formula: maps diff (0 to 6) to 0-36 scale
        pci_score = int(round((diff / 6.0) * 36))
        band = get_pci_band(pci_score)
        
        return {
            "dimension": axis_label,
            "preferred_letter": pref,
            "counts": {dim1: c1, dim2: c2},
            "percentages": {dim1: p1_pct, dim2: p2_pct},
            "pci_score": pci_score,
            "clarity_band": band,
            "formatted": f"{pref} ({band} &bull; {max(p1_pct, p2_pct)}%)"
        }
        
    energy_axis = process_axis("E", "I", "Energy Orientation")
    mind_axis = process_axis("S", "N", "Information Processing")
    nature_axis = process_axis("T", "F", "Decision Making")
    tactics_axis = process_axis("J", "P", "Lifestyle & Execution")
    
    mbti_type = f"{energy_axis['preferred_letter']}{mind_axis['preferred_letter']}{nature_axis['preferred_letter']}{tactics_axis['preferred_letter']}"
    
    archetype_info = MBTI_ARCHETYPES_DATABASE.get(
        mbti_type, MBTI_ARCHETYPES_DATABASE["INTJ"]
    )
    
    cognitive_stack = calculate_jungian_cognitive_stack(mbti_type)
    
    return {
        "status": "success",
        "mbti_type": mbti_type,
        "archetype": archetype_info["archetype"],
        "title": archetype_info["title"],
        "description": archetype_info["description"],
        "strengths": archetype_info["strengths"],
        "growth_areas": archetype_info["growth_areas"],
        "astrological_synergy": archetype_info["astrological_synergy"],
        "breakdown": {
            "energy": {"letter": energy_axis["preferred_letter"], "trait": "Extraverted" if energy_axis["preferred_letter"] == "E" else "Introverted", "details": energy_axis},
            "mind": {"letter": mind_axis["preferred_letter"], "trait": "Observant (Sensing)" if mind_axis["preferred_letter"] == "S" else "Intuitive", "details": mind_axis},
            "nature": {"letter": nature_axis["preferred_letter"], "trait": "Thinking" if nature_axis["preferred_letter"] == "T" else "Feeling", "details": nature_axis},
            "tactics": {"letter": tactics_axis["preferred_letter"], "trait": "Judging (Structured)" if tactics_axis["preferred_letter"] == "J" else "Prospecting (Spontaneous)", "details": tactics_axis},
        },
        "preference_clarity": {
            "EI": energy_axis,
            "SN": mind_axis,
            "TF": nature_axis,
            "JP": tactics_axis,
        },
        "cognitive_stack": cognitive_stack,
    }

def synthesize_astrology_and_mbti(astrology_data: Dict[str, Any], mbti_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates a deep synthesis report combining the user's astrological placements
    (Tropical Sun, Sidereal Surya, Chandra Rashi, Lagna) with their Jungian cognitive functions.
    """
    mbti_type = mbti_data.get("mbti_type", "INTJ")
    archetype = mbti_data.get("archetype", "The Architect")
    cog_stack = mbti_data.get("cognitive_stack", {})
    dom_fn = cog_stack.get("dominant", {})
    
    # Extract celestial points
    western = astrology_data.get("western", {})
    vedic = astrology_data.get("vedic", {})
    
    tropical_sun = western.get("planets", [{}])[0].get("sign", "Gemini") if western else astrology_data.get("sun", {}).get("sign", "Gemini")
    sidereal_moon = vedic.get("chandra_rashi", {}).get("sanskrit_rashi", "Tula") if vedic else "Tula"
    lagna = vedic.get("lagna", {}).get("sanskrit_rashi", "Simha") if vedic else "Simha"
    
    synthesis_title = f"The {tropical_sun} {archetype} ({mbti_type})"
    
    synthesis_narrative = (
        f"Your {tropical_sun} Sun channels conscious drive through your Dominant {dom_fn.get('name', 'Cognitive Function')} "
        f"({dom_fn.get('code', 'Hero')}), synthesizing strategic foresight with active purposeful ambition. "
        f"Subconsciously, your Sidereal Chandra in {sidereal_moon} grounds emotional resilience through intuitive attunement, "
        f"while your {lagna} Lagna shapes how you project authority and interface with the external realm."
    )
    
    return {
        "synthesis_title": synthesis_title,
        "narrative": synthesis_narrative,
        "dominant_function_channel": f"Hero {dom_fn.get('code', 'Ni')} ({dom_fn.get('name', 'Function')})",
        "astrological_anchor": f"Tropical {tropical_sun} Sun &bull; Sidereal {sidereal_moon} Moon",
    }
