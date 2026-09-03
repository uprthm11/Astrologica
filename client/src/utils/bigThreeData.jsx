import React from 'react'

// ─── High-Fidelity Custom Figma-Style Minimalist Zodiac SVG Icons ──────────────
// Strictly vector paths — Zero Unicode emojis / glyphs

export const AriesIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 82 V32" />
    <path d="M50 32 C42 16 18 16 18 36 C18 48 30 54 36 50" />
    <path d="M50 32 C58 16 82 16 82 36 C82 48 70 54 64 50" />
    <circle cx="50" cy="84" r="2" fill="currentColor" />
  </svg>
)

export const TaurusIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="50" cy="62" r="22" />
    <path d="M22 24 C26 42 42 42 50 42 C58 42 74 42 78 24" />
    <path d="M20 20 C22 28 26 32 32 30" />
    <path d="M80 20 C78 28 74 32 68 30" />
  </svg>
)

export const GeminiIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 22 C42 30 58 30 76 22" />
    <path d="M24 78 C42 70 58 70 76 78" />
    <line x1="38" y1="28" x2="38" y2="72" />
    <line x1="62" y1="28" x2="62" y2="72" />
    <circle cx="38" cy="50" r="1.5" fill="currentColor" />
    <circle cx="62" cy="50" r="1.5" fill="currentColor" />
  </svg>
)

export const CancerIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="34" cy="40" r="12" />
    <path d="M46 40 C46 22 72 20 78 38" />
    <circle cx="66" cy="60" r="12" />
    <path d="M54 60 C54 78 28 80 22 62" />
  </svg>
)

export const LeoIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="62" r="10" />
    <path d="M38 54 C46 32 64 22 72 38 C76 46 72 66 84 72" />
    <circle cx="84" cy="74" r="4" />
  </svg>
)

export const VirgoIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 74 V34 C24 26 34 26 34 34 V70" />
    <path d="M34 34 C34 26 46 26 46 34 V70" />
    <path d="M46 34 C46 26 58 26 58 34 V74 C58 84 74 84 78 68" />
    <path d="M68 62 L82 78" />
  </svg>
)

export const LibraIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="20" y1="74" x2="80" y2="74" />
    <line x1="20" y1="52" x2="38" y2="52" />
    <line x1="62" y1="52" x2="80" y2="52" />
    <path d="M38 52 C38 38 62 38 62 52" />
  </svg>
)

export const ScorpioIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 72 V34 C22 26 32 26 32 34 V68" />
    <path d="M32 34 C32 26 44 26 44 34 V68" />
    <path d="M44 34 C44 26 56 26 56 34 V66 C56 76 72 74 76 60" />
    <path d="M72 60 L78 60 L78 66" />
  </svg>
)

export const SagittariusIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="24" y1="76" x2="76" y2="24" />
    <path d="M54 24 H76 V46" />
    <line x1="36" y1="64" x2="52" y2="48" />
  </svg>
)

export const CapricornIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 28 L38 66 L52 34" />
    <path d="M52 34 C58 26 72 26 72 38 C72 58 56 64 62 76 C66 84 76 80 76 72" />
  </svg>
)

export const AquariusIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 40 L30 32 L40 40 L50 32 L60 40 L70 32 L80 40" />
    <path d="M20 60 L30 52 L40 60 L50 52 L60 60 L70 52 L80 60" />
  </svg>
)

export const PiscesIcon = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M34 22 C22 40 22 60 34 78" />
    <path d="M66 22 C78 40 78 60 66 78" />
    <line x1="20" y1="50" x2="80" y2="50" />
  </svg>
)

export const ZODIAC_SVG_COMPONENTS = {
  Aries:       AriesIcon,
  Taurus:      TaurusIcon,
  Gemini:      GeminiIcon,
  Cancer:      CancerIcon,
  Leo:         LeoIcon,
  Virgo:       VirgoIcon,
  Libra:       LibraIcon,
  Scorpio:     ScorpioIcon,
  Sagittarius: SagittariusIcon,
  Capricorn:   CapricornIcon,
  Aquarius:    AquariusIcon,
  Pisces:      PiscesIcon,
}

// ─── Big Three Astrological Text Dictionary ───────────────────────────────────

export const SUN_SIGN_DESCRIPTIONS = {
  Aries: {
    archetype: "The Fearless Pioneer",
    elementModality: "Fire · Cardinal",
    text: "Initiating change and inspiring courage through bold action."
  },
  Taurus: {
    archetype: "The Master Architect",
    elementModality: "Earth · Fixed",
    text: "Providing stability and teaching appreciation for enduring pleasures."
  },
  Gemini: {
    archetype: "The Quicksilver Weaver",
    elementModality: "Air · Mutable",
    text: "Connecting minds and facilitating communication through curiosity."
  },
  Cancer: {
    archetype: "The Sovereign Protector",
    elementModality: "Water · Cardinal",
    text: "Creating emotional security and nurturing unconditional love."
  },
  Leo: {
    archetype: "The Radiant Monarch",
    elementModality: "Fire · Fixed",
    text: "Expressing creative authenticity and inspiring others through charisma."
  },
  Virgo: {
    archetype: "The Sacred Alchemist",
    elementModality: "Earth · Mutable",
    text: "Serving through practical mastery and achieving perfection in details."
  },
  Libra: {
    archetype: "The Cosmic Diplomat",
    elementModality: "Air · Cardinal",
    text: "Creating harmony and balance through diplomacy and fairness."
  },
  Scorpio: {
    archetype: "The Phoenix Alchemist",
    elementModality: "Water · Fixed",
    text: "Facilitating deep transformation and emotional healing."
  },
  Sagittarius: {
    archetype: "The Visionary Archer",
    elementModality: "Fire · Mutable",
    text: "Seeking truth and expanding consciousness through adventure."
  },
  Capricorn: {
    archetype: "The Timeless Mountain",
    elementModality: "Earth · Cardinal",
    text: "Building lasting achievements through discipline and responsibility."
  },
  Aquarius: {
    archetype: "The Electric Awakener",
    elementModality: "Air · Fixed",
    text: "Advancing human evolution through innovation and humanitarian vision."
  },
  Pisces: {
    archetype: "The Mystic Ocean",
    elementModality: "Water · Mutable",
    text: "Embodying boundless compassion and spiritual intuition through fluid creativity."
  }
}

export const MOON_SIGN_DESCRIPTIONS = {
  Aries: {
    subconsciousNeed: "Direct Emotional Expression & Instinctive Autonomy",
    elementGroup: "Fire Moon",
    text: "Your emotional sanctuary requires immediate, authentic self-expression. You process feelings quickly and fiercely, needing physical outlets and autonomy rather than lingering in prolonged ambiguity."
  },
  Taurus: {
    subconsciousNeed: "Grounding Comfort & Sensory Predictability",
    elementGroup: "Earth Moon (Exalted)",
    text: "Exalted in Taurus, your subconscious mind is an anchor of profound peace. You process emotional waves through tactile grounding, serene environments, physical affection, and steady loyalty."
  },
  Gemini: {
    subconsciousNeed: "Verbal Processing & Intellectual Clarity",
    elementGroup: "Air Moon",
    text: "You achieve emotional equilibrium by articulating what you feel. Analyzing sentiments, conversational exchange, and mentally framing your experiences brings immediate relief and inner lightness."
  },
  Cancer: {
    subconsciousNeed: "Deep Emotional Rooting & Sacred Intimacy",
    elementGroup: "Water Moon (Domicile)",
    text: "Resting in its nocturnal home, your Cancer Moon grants unmatched empathic radar. You require a sacred domestic sanctuary, deeply trusted confidants, and cyclic retreats into your private emotional shell."
  },
  Leo: {
    subconsciousNeed: "Appreciation, Warmth & Creative Catharsis",
    elementGroup: "Fire Moon",
    text: "Your inner heart flourishes when cherished, celebrated, and creatively expressed. You express vulnerability with grand loyalty and protect loved ones with fierce, sovereign tenderness."
  },
  Virgo: {
    subconsciousNeed: "Order, Usefulness & Mindful Rhythm",
    elementGroup: "Earth Moon",
    text: "Your subconscious seeks comfort through practical usefulness and tidy environments. Emotional wellness for you is deeply tied to somatic health, daily rituals, and thoughtful acts of service."
  },
  Libra: {
    subconsciousNeed: "Relational Harmony & Aesthetic Peace",
    elementGroup: "Air Moon",
    text: "You process feelings best in peaceful, reciprocal partnerships and elegant surroundings. Conflict or aesthetic dissonance causes deep internal friction, making peaceful compromise essential."
  },
  Scorpio: {
    subconsciousNeed: "Absolute Truth & Psychological Depth",
    elementGroup: "Water Moon",
    text: "Your emotional depth is bottomless. You instinctively perceive hidden motives, demanding uncompromising emotional honesty. Intimacy for you is an all-or-nothing communion of souls."
  },
  Sagittarius: {
    subconsciousNeed: "Philosophical Freedom & Spacious Horizons",
    elementGroup: "Fire Moon",
    text: "Your emotional core craves freedom, fresh perspectives, and faith in the future. You process emotional distress by finding the philosophical lesson, humor, and wide-open sky beyond it."
  },
  Capricorn: {
    subconsciousNeed: "Emotional Mastery & Self-Sufficiency",
    elementGroup: "Earth Moon",
    text: "You manage vulnerability with stoic dignity and profound inner fortitude. You respect emotional commitments deeply and find peace through earned milestones, competence, and structured boundaries."
  },
  Aquarius: {
    subconsciousNeed: "Intellectual Space & Objective Belonging",
    elementGroup: "Air Moon",
    text: "You process emotions through a detached, panoramic lens. Needing mental autonomy, you observe feelings from a bird's-eye view, finding comfort in chosen soul families and egalitarian ideals."
  },
  Pisces: {
    subconsciousNeed: "Spiritual Transcendence & Empathetic Sanctuary",
    elementGroup: "Water Moon",
    text: "Your subconscious boundaries are naturally porous, soaking in the collective emotional atmosphere. You require periods of solitude, music, water immersion, and spiritual contemplation to reset your field."
  }
}

export const ASCENDANT_DESCRIPTIONS = {
  Aries: {
    outerMask: "Dynamic, Decisive, & Direct",
    firstImpression: "You project an aura of vibrant energy, physical readiness, and courageous candor. The world meets you as an assertive pioneer ready to tackle challenges head-on."
  },
  Taurus: {
    outerMask: "Serene, Grounded, & Poised",
    firstImpression: "You meet the world with an unshakeable, calm presence. Others immediately sense your reliability, sensory refinement, and steady, reassuring physical grounding."
  },
  Gemini: {
    outerMask: "Animated, Witty, & Perceptive",
    firstImpression: "You project quicksilver curiosity and communicative charm. People instantly recognize your conversational agility, youthful vitality, and keen observant gaze."
  },
  Cancer: {
    outerMask: "Gentle, Receptive, & Protective",
    firstImpression: "You project an aura of soulful warmth, intuitive sensitivity, and quiet protection. Others instinctively sense your empathic depth and emotional safety."
  },
  Leo: {
    outerMask: "Radiant, Regal, & Magnetic",
    firstImpression: "You command any room with natural dignity, charismatic warmth, and an unmistakable presence. Your outer expression invites others into confidence and creative play."
  },
  Virgo: {
    outerMask: "Composed, Elegant, & Discerning",
    firstImpression: "You project an aura of immaculate poise, analytical competence, and thoughtful discretion. Others perceive your sharp attention to detail and understated grace."
  },
  Libra: {
    outerMask: "Charming, Harmonious, & Graceful",
    firstImpression: "You meet the world with natural aesthetic refinement and diplomatic charm. You make others feel instantly heard, accepted, and appreciated."
  },
  Scorpio: {
    outerMask: "Enigmatic, Magnetizing, & Piercing",
    firstImpression: "You project an unmistakable aura of depth, intense presence, and mystery. Your gaze cuts through pretension, commanding immediate respect."
  },
  Sagittarius: {
    outerMask: "Expansive, Enthusiastic, & Candid",
    firstImpression: "You project vibrant warmth, infectious humor, and open-minded optimism. People perceive you as an adventurous seeker radiating zest for life."
  },
  Capricorn: {
    outerMask: "Authoritative, Competent, & Timeless",
    firstImpression: "You project seasoned maturity, quiet strength, and executive poise. Others instinctively respect your seriousness, work ethic, and dependable stature."
  },
  Aquarius: {
    outerMask: "Unique, Egalitarian, & Electric",
    firstImpression: "You project a visionary, delightfully unconventional vibe. People are intrigued by your intellectual clarity, friendly detachment, and forward-thinking perspective."
  },
  Pisces: {
    outerMask: "Dreamy, Luminous, & Empathetic",
    firstImpression: "You project an ethereal, gentle presence that feels otherworldly. Others sense your compassion, imaginative depth, and open-hearted receptivity."
  }
}

// ─── Sun Sign Psychological Dossier (Identity, Conscious Ego, Life Purpose) ──

export const sunIdentity = {
  Aries: "Aries (March 21 – April 19): Ruled by Mars, this Fire sign is Cardinal. You are decisive, action-oriented, and a natural leader with bold, assertive energy.",
  Taurus: "Taurus (April 20 – May 20): Ruled by Venus, this Earth sign is Fixed. You are reliable, diligent, and grounded, seeking stability and tangible results.",
  Gemini: "Gemini (May 21 – June 20): Ruled by Mercury, this Air sign is Mutable. You are quick-witted, curious, and communicative, adapting easily to new information.",
  Cancer: "Cancer (June 21 – July 22): Ruled by the Moon, this Water sign is Cardinal. You are sensitive, imaginative, and nurturing, driven by emotional depth and home.",
  Leo: "Leo (July 23 – August 22): Ruled by the Sun, this Fire sign is Fixed. You are charismatic, generous, and proud, naturally taking center stage and seeking creative expression.",
  Virgo: "Virgo (August 23 – September 22): Ruled by Mercury, this Earth sign is Mutable. You are analytical, practical, and diligent, striving for perfection and efficiency.",
  Libra: "Libra (September 23 – October 22): Ruled by Venus, this Air sign is Cardinal. You are equitable, charming, and diplomatic, seeking harmony and balance in relationships.",
  Scorpio: "Scorpio (October 23 – November 21): Ruled by Pluto (or Mars traditionally), this Water sign is Fixed. You are insightful, mysterious, and intense, capable of deep transformation and research.",
  Sagittarius: "Sagittarius (November 22 – December 21): Ruled by Jupiter, this Fire sign is Mutable. You are unconstrained, lively, and philosophical, seeking truth and adventure.",
  Capricorn: "Capricorn (December 22 – January 19): Ruled by Saturn, this Earth sign is Cardinal. You are disciplined, ambitious, and realistic, committed to long-term goals and structure.",
  Aquarius: "Aquarius (January 20 – February 18): Ruled by Uranus (or Saturn traditionally), this Air sign is Fixed. You are innovative, liberal, and independent, often focusing on collective ideals and reform.",
  Pisces: "Pisces (February 19 – March 20): Ruled by Neptune (or Jupiter traditionally), this Water sign is Mutable. You are romantic, kind, and sentimental, possessing strong intuition and empathy."
}

export const sunEgo = {
  Aries: "The ego is driven by action and individuality. It requires immediate autonomy, conquest, and praise, often acting before thinking to assert its unique presence.",
  Taurus: "The ego is rooted in the physical world, needing security, comfort, and material abundance. Self-worth is tied to stability, sensory pleasure, and tangible possessions.",
  Gemini: "The ego relies on communication and information. It thrives on variety, intellectual exchange, and adaptability, with self-esteem fluctuating based on mental stimulation and social interaction.",
  Cancer: "The ego is wrapped in emotional security. It is deeply sensitive, often hiding its true needs, and requires emotional understanding, nurturing, and a sense of home to feel validated.",
  Leo: "The ego is connected to recognition and self-expression. As the sign ruled by the Sun, it naturally seeks the spotlight, admiration, and authority, feeling essential and vital when appreciated.",
  Virgo: "The ego is driven by perfection and service. It can be critical and self-effacing, seeking worth through utility, order, and improvement, often neglecting its own needs for the sake of flawlessness.",
  Libra: "The ego revolves around harmony and acceptance. It often loses its identity in pleasing others to avoid conflict, needing self-love and balanced relationships to strengthen its sense of self.",
  Scorpio: "The ego is intense and transformative, reflecting past pain or reward. It feeds on deep emotional experiences and power dynamics, undergoing profound shifts in identity throughout life.",
  Sagittarius: "The ego is tied to belief systems and expansion. It seeks truth, freedom, and the ability to influence others through wisdom, needing recognition for its philosophical insights and adventurous spirit.",
  Capricorn: "The ego is expressed through ambition and achievement. It is tied to social status, career success, and material mastery, often appearing harsh or neglectful of emotional needs in pursuit of goals.",
  Aquarius: "The ego is unconventional and independent. It takes pride in being unique and different, focusing on humanitarian causes and intellectual innovation, sometimes at the expense of personal intimacy.",
  Pisces: "The ego is fluid and empathetic, strongly connected to emotions and the collective unconscious. It feeds on reassurance, closeness, and spiritual connection, often being influenced by the feelings of others."
}

export const sunPurpose = {
  // Mapped by House Number
  1: "First House (Aries Archetype): Identity & Leadership. Your purpose revolves around self-discovery, individuality, and leadership. You are meant to assert your unique personality, initiate new projects, and lead with courage, often thriving as an entrepreneur, athlete, or pioneer.",
  2: "Second House (Taurus Archetype): Values & Wealth. Your life purpose focuses on accumulating resources, material security, and aligning your work with your personal values. You are driven to build stability through practical skills, potentially in finance, real estate, or the arts.",
  3: "Third House (Gemini Archetype): Communication & Intellect. Your purpose lies in communication, education, and local community interaction. You are meant to share knowledge, travel, and connect ideas, often finding fulfillment in writing, teaching, or law.",
  4: "Fourth House (Cancer Archetype): Home & Family. Your life purpose is centered on nurturing, emotional foundations, and family. You find meaning in creating a secure home environment, often pursuing careers in caregiving, psychology, or real estate that support others' emotional well-being.",
  5: "Fifth House (Leo Archetype): Creativity & Romance. Your purpose involves creative expression, romance, and self-display. You are meant to shine through artistic endeavors, entertainment, or leadership roles that inspire joy and passion, often in the arts or performance.",
  6: "Sixth House (Virgo Archetype): Service & Health. Your life purpose is found in service, daily work, and health. You are driven to help others through practical solutions, often in healthcare, business administration, or any role requiring diligence and attention to detail.",
  7: "Seventh House (Libra Archetype): Partnerships & Justice. Your purpose revolves around relationships, diplomacy, and fairness. You thrive in partnerships, law, or public relations, where you can balance conflicting interests and create harmony in social or legal contexts.",
  8: "Eighth House (Scorpio Archetype): Transformation & Depth. Your life purpose involves deep transformation, research, and uncovering hidden truths. You are drawn to professions involving psychology, healing, finance, or spiritual exploration that deal with life’s profound mysteries.",
  9: "Ninth House (Sagittarius Archetype): Truth & Expansion. Your purpose is to seek truth, higher education, and broaden your horizons. You are meant to teach, lead civic institutions, or travel, sharing wisdom and philosophical insights with others.",
  10: "Tenth House (Capricorn Archetype): Career & Status. Your life purpose is tied to professional achievement, social status, and public recognition. You are driven to build lasting structures, lead organizations, and attain mastery in your chosen career field.",
  11: "Eleventh House (Aquarius Archetype): Community & Innovation. Your purpose lies in humanitarian work, innovation, and community building. You are meant to improve society through technology, social groups, or visionary ideas that benefit the collective.",
  12: "Twelfth House (Pisces Archetype): Spirituality & Service. Your life purpose involves selfless service, spiritual growth, and compassion for the underprivileged. You find meaning in healing, artistic expression, or working behind the scenes to support those in need.",

  // Mapped by Zodiac Sign Name Fallback
  Aries: "First House (Aries Archetype): Identity & Leadership. Your purpose revolves around self-discovery, individuality, and leadership. You are meant to assert your unique personality, initiate new projects, and lead with courage, often thriving as an entrepreneur, athlete, or pioneer.",
  Taurus: "Second House (Taurus Archetype): Values & Wealth. Your life purpose focuses on accumulating resources, material security, and aligning your work with your personal values. You are driven to build stability through practical skills, potentially in finance, real estate, or the arts.",
  Gemini: "Third House (Gemini Archetype): Communication & Intellect. Your purpose lies in communication, education, and local community interaction. You are meant to share knowledge, travel, and connect ideas, often finding fulfillment in writing, teaching, or law.",
  Cancer: "Fourth House (Cancer Archetype): Home & Family. Your life purpose is centered on nurturing, emotional foundations, and family. You find meaning in creating a secure home environment, often pursuing careers in caregiving, psychology, or real estate that support others' emotional well-being.",
  Leo: "Fifth House (Leo Archetype): Creativity & Romance. Your purpose involves creative expression, romance, and self-display. You are meant to shine through artistic endeavors, entertainment, or leadership roles that inspire joy and passion, often in the arts or performance.",
  Virgo: "Sixth House (Virgo Archetype): Service & Health. Your life purpose is found in service, daily work, and health. You are driven to help others through practical solutions, often in healthcare, business administration, or any role requiring diligence and attention to detail.",
  Libra: "Seventh House (Libra Archetype): Partnerships & Justice. Your purpose revolves around relationships, diplomacy, and fairness. You thrive in partnerships, law, or public relations, where you can balance conflicting interests and create harmony in social or legal contexts.",
  Scorpio: "Eighth House (Scorpio Archetype): Transformation & Depth. Your life purpose involves deep transformation, research, and uncovering hidden truths. You are drawn to professions involving psychology, healing, finance, or spiritual exploration that deal with life’s profound mysteries.",
  Sagittarius: "Ninth House (Sagittarius Archetype): Truth & Expansion. Your purpose is to seek truth, higher education, and broaden your horizons. You are meant to teach, lead civic institutions, or travel, sharing wisdom and philosophical insights with others.",
  Capricorn: "Tenth House (Capricorn Archetype): Career & Status. Your life purpose is tied to professional achievement, social status, and public recognition. You are driven to build lasting structures, lead organizations, and attain mastery in your chosen career field.",
  Aquarius: "Eleventh House (Aquarius Archetype): Community & Innovation. Your purpose lies in humanitarian work, innovation, and community building. You are meant to improve society through technology, social groups, or visionary ideas that benefit the collective.",
  Pisces: "Twelfth House (Pisces Archetype): Spirituality & Service. Your life purpose involves selfless service, spiritual growth, and compassion for the underprivileged. You find meaning in healing, artistic expression, or working behind the scenes to support those in need."
}
