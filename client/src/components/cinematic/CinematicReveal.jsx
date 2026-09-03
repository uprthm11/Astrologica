import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'
import InteractiveBubble from './InteractiveBubble'

// ─── Defensive String Helper ──────────────────────────────────────────────────
const safeLower = (val) => String(val || '').toLowerCase()

// ─── Polished SVG Icons (0 Emojis) ───────────────────────────────────────────
const SunIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)
const MoonIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)
const AscendantIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
)
const PlanetIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5"/>
    <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-30 12 12)"/>
  </svg>
)
const GemIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 3h12l4 6-10 12L2 9z"/>
  </svg>
)
const HouseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
  </svg>
)
const ElementIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
  </svg>
)
const ModalityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/>
  </svg>
)
const DignityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const AyurvedaIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const TimelineIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ─── Complete Sign Database (Defensive with full properties) ──────────────────
const SIGN_DATA = {
  Aries: {
    element: 'Fire', modality: 'Cardinal', ruling: 'Mars/Mangal',
    stone: 'Diamond / Red Coral', vedicGem: 'Red Coral (Moonga)', metal: 'Copper', day: 'Tuesday',
    domain: 'Pioneering drive, instinctive courage, and direct initiative.',
    houseFocus: '1st House of Self & Physical Expression'
  },
  Taurus: {
    element: 'Earth', modality: 'Fixed', ruling: 'Venus/Shukra',
    stone: 'Emerald / Diamond', vedicGem: 'Diamond (Hira)', metal: 'Silver / White Gold', day: 'Friday',
    domain: 'Resource preservation, sensory elegance, and grounded stability.',
    houseFocus: '2nd House of Values & Possessions'
  },
  Gemini: {
    element: 'Air', modality: 'Mutable', ruling: 'Mercury/Budha',
    stone: 'Pearl / Emerald', vedicGem: 'Emerald (Panna)', metal: 'Gold', day: 'Wednesday',
    domain: 'Quicksilver intellect, dual curiosity, and articulate agility.',
    houseFocus: '3rd House of Cognition & Local Connections'
  },
  Cancer: {
    element: 'Water', modality: 'Cardinal', ruling: 'Moon/Chandra',
    stone: 'Ruby / Pearl', vedicGem: 'Natural Pearl (Moti)', metal: 'Silver', day: 'Monday',
    domain: 'Deep empathic intuition, protective roots, and lunar sensitivity.',
    houseFocus: '4th House of Home, Roots & Inner Sanctuary'
  },
  Leo: {
    element: 'Fire', modality: 'Fixed', ruling: 'Sun/Surya',
    stone: 'Peridot / Ruby', vedicGem: 'Ruby (Manik)', metal: 'Gold / Copper', day: 'Sunday',
    domain: 'Radiant authority, magnetic warmth, and sovereign creative flame.',
    houseFocus: '5th House of Sovereignty & Creative Creation'
  },
  Virgo: {
    element: 'Earth', modality: 'Mutable', ruling: 'Mercury/Budha',
    stone: 'Sapphire / Emerald', vedicGem: 'Emerald (Panna)', metal: 'Gold', day: 'Wednesday',
    domain: 'Analytical mastery, sacred devotion, and bodily harmony.',
    houseFocus: '6th House of Devotion, Mastery & Wellness'
  },
  Libra: {
    element: 'Air', modality: 'Cardinal', ruling: 'Venus/Shukra',
    stone: 'Opal / Diamond', vedicGem: 'Diamond (Hira)', metal: 'Silver', day: 'Friday',
    domain: 'Cosmic harmony, aesthetic justice, and relational diplomacy.',
    houseFocus: '7th House of Sacred Union & Counterparts'
  },
  Scorpio: {
    element: 'Water', modality: 'Fixed', ruling: 'Mars/Mangal',
    stone: 'Topaz / Red Coral', vedicGem: 'Red Coral (Moonga)', metal: 'Copper', day: 'Tuesday',
    domain: 'Transformative depth, alchemical perception, and intense magnetism.',
    houseFocus: '8th House of Transformation & Shared Mysteries'
  },
  Sagittarius: {
    element: 'Fire', modality: 'Mutable', ruling: 'Jupiter/Guru',
    stone: 'Turquoise / Yellow Sapphire', vedicGem: 'Yellow Sapphire (Pukhraj)', metal: 'Gold', day: 'Thursday',
    domain: 'Expansive philosophy, boundless freedom, and truth-seeking arrows.',
    houseFocus: '9th House of Higher Learning & Worldly Horizons'
  },
  Capricorn: {
    element: 'Earth', modality: 'Cardinal', ruling: 'Saturn/Shani',
    stone: 'Garnet / Blue Sapphire', vedicGem: 'Blue Sapphire (Neelam)', metal: 'Iron / Steel', day: 'Saturday',
    domain: 'Architectural ambition, timeless discipline, and mountain resilience.',
    houseFocus: '10th House of Public Destiny & Master Legacy'
  },
  Aquarius: {
    element: 'Air', modality: 'Fixed', ruling: 'Saturn/Shani',
    stone: 'Amethyst / Blue Sapphire', vedicGem: 'Blue Sapphire (Neelam)', metal: 'Iron / Steel', day: 'Saturday',
    domain: 'Visionary innovation, collective ideals, and electric originality.',
    houseFocus: '11th House of Higher Networks & Universal Ideals'
  },
  Pisces: {
    element: 'Water', modality: 'Mutable', ruling: 'Jupiter/Guru',
    stone: 'Aquamarine / Yellow Sapphire', vedicGem: 'Yellow Sapphire (Pukhraj)', metal: 'Gold', day: 'Thursday',
    domain: 'Mystic transcendence, fluid compassion, and oceanic imagination.',
    houseFocus: '12th House of Cosmic Unity & Transcendent Subconscious'
  },
}

const DEFAULT_SIGN_INFO = SIGN_DATA.Aries

function normalizeSign(rawSign) {
  if (!rawSign || typeof rawSign !== 'string') return 'Aries'
  const clean = rawSign.trim()
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()
  return SIGN_DATA[capitalized] ? capitalized : 'Aries'
}

const ELEMENT_GLOWS = {
  Fire:  'rgba(249, 115, 22, 0.65)',
  Earth: 'rgba(16, 185, 129, 0.65)',
  Air:   'rgba(6, 182, 212, 0.65)',
  Water: 'rgba(99, 102, 241, 0.65)',
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.5 } },
}

export default function CinematicReveal() {
  const { astrologyData, birthData, userName, preferredSystem, revealSlide, setRevealSlide, advanceStep, goBack } = useAppStore()
  const [downloading, setDownloading] = useState(false)

  // Dedicated offscreen poster ref for high-res html2canvas export
  const exportRef = useRef(null)

  const isVedic = preferredSystem === 'vedic'
  const sysLabel = isVedic ? 'Vedic Sidereal Formula' : 'Psychological Depth'

  // Robust Data Extraction
  let rawSunSign = 'Aries'
  let rawMoonSign = 'Taurus'
  let rawAscSign = 'Gemini'
  let nakshatra = 'Ashwini'
  let pada = 'Pada 1'
  let currentDasha = 'Ketu Mahadasha (Karmic Awakening)'

  if (isVedic) {
    rawSunSign   = astrologyData?.vedic?.surya_rashi?.rashi
    rawMoonSign  = astrologyData?.vedic?.chandra_rashi?.rashi
    rawAscSign   = astrologyData?.vedic?.lagna?.rashi
    nakshatra    = astrologyData?.vedic?.chandra_rashi?.nakshatra?.name || 'Rohini'
    pada         = `Pada ${astrologyData?.vedic?.chandra_rashi?.nakshatra?.pada || 2}`
  } else {
    const planets = astrologyData?.western?.planets || []
    rawSunSign  = planets.find(p => p?.id === 'sun')?.sign
    rawMoonSign = planets.find(p => p?.id === 'moon')?.sign
    rawAscSign  = astrologyData?.western?.ascendant?.sign
  }

  const sunSign  = normalizeSign(rawSunSign)
  const moonSign = normalizeSign(rawMoonSign)
  const ascSign  = normalizeSign(rawAscSign)

  const sunData  = SIGN_DATA[sunSign]  || DEFAULT_SIGN_INFO
  const moonData = SIGN_DATA[moonSign] || DEFAULT_SIGN_INFO
  const ascData  = SIGN_DATA[ascSign]  || DEFAULT_SIGN_INFO

  const primaryElement = sunData?.element || 'Air'
  const glow = ELEMENT_GLOWS[primaryElement] || ELEMENT_GLOWS.Air

  // Dedicated High-Res Poster Capture Handler
  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#030712',
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        height: 1200,
      })
      const link = document.createElement('a')
      link.download = `astrologica-${preferredSystem}-${safeLower(userName || 'blueprint').replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }, [userName, preferredSystem])

  // ═════════════════════════════════════════════════════════════════════════════
  // PSYCHOLOGICAL DEPTH PIPELINE (9 SLIDES)
  // ═════════════════════════════════════════════════════════════════════════════
  const WESTERN_SLIDES = [
    // Slide 1: Foundation (The Big Three)
    <div key="w1" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 1 of 9 · Foundation (The Big Three)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Core Psychological Archetype</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Sun (Core Identity) · ${sunSign}`}
          subtitle="Solar Core & Ego Direction"
          icon={SunIcon} glowColor={glow} defaultExpanded
          summary="Requires birth date. Governs ego, life purpose, and conscious will."
          details={`Requires birth date. Governs ego, life purpose, and conscious will. In ${sunSign}, you channel ${safeLower(sunData.domain)}`}
        />
        <InteractiveBubble
          title={`Moon (Emotional Nature) · ${moonSign}`}
          subtitle="Subconscious Instincts"
          icon={MoonIcon} glowColor={glow}
          summary="Requires exact time & location. Governs instincts, subconscious patterns, and inner comfort."
          details={`Requires exact time & location. Governs instincts, subconscious patterns, and inner comfort. In ${moonSign}, you seek emotional safety through ${safeLower(moonData.domain)}`}
        />
        <InteractiveBubble
          title={`Ascendant (Rising) · ${ascSign}`}
          subtitle="Outer Persona & First Impression"
          icon={AscendantIcon} glowColor={glow}
          summary="Requires exact lat/lon. Governs outward persona, first impressions, and physical appearance tendencies."
          details={`Requires exact lat/lon. Governs outward persona, first impressions, and physical appearance tendencies. Anchored in ${ascSign}.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={goBack}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 2: Inner Planetary Placements
    <div key="w2" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 2 of 9 · Inner Planetary Placements</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Cognitive & Relational Engines</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Mercury (Cognition & Intellect) · ${sunSign}`}
          subtitle="Communication & Logic"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary="Domain: Communication, intellect, learning, logic."
          details={`Mercury governs thought patterns, speech, data processing, and decision-making logic. In ${sunSign}, your mind processes through ${safeLower(sunData.domain)}`}
        />
        <InteractiveBubble
          title={`Venus (Love & Aesthetics) · ${moonSign}`}
          subtitle="Relational Values"
          icon={PlanetIcon} glowColor={glow}
          summary="Domain: Love, aesthetics, values, harmony."
          details={`Venus rules how you bond, express affection, evaluate beauty, and manage financial value. In ${moonSign}, you seek relational harmony through ${safeLower(moonData.domain)}`}
        />
        <InteractiveBubble
          title="Mars (Drive & Ambition)"
          subtitle="Executive Willpower"
          icon={PlanetIcon} glowColor={glow}
          summary="Domain: Drive, assertiveness, courage, conflict style."
          details="Mars is your engine of desire, anger management, physical stamina, and competitive instinct. It defines your conflict style and active courage."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(0)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 3: Outer Planetary Expansion
    <div key="w3" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 3 of 9 · Outer Planetary Expansion</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Transpersonal Horizons</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Jupiter & Saturn (Growth vs. Structure)"
          subtitle="Social & Karmic Expansion"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary="Jupiter (Growth, optimism, abundance) and Saturn (Discipline, structure, limitation)."
          details="Jupiter expands your philosophy, optimism, and fortune. Saturn enforces discipline, structure, boundary setting, and mature responsibility through time."
        />
        <InteractiveBubble
          title="Uranus, Neptune & Pluto (Transpersonal Shift)"
          subtitle="Generational Transformation"
          icon={PlanetIcon} glowColor={glow}
          summary="Uranus (Innovation), Neptune (Imagination, spirituality), Pluto (Transformation, depth, rebirth)."
          details="Uranus breaks outdated paradigms with electric innovation. Neptune dissolves boundaries into imagination and spirituality. Pluto drives total psychological rebirth and deep transformation."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(1)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 4: Astrological Aspects
    <div key="w4" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 4 of 9 · Astrological Aspects (Geometry)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Planetary Aspects & Clusters</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Harmonious Aspects (Flow)"
          subtitle="0°, 60°, 120° Geometry"
          icon={ModalityIcon} glowColor={glow} defaultExpanded
          summary="Conjunction (0° - Fusion/Intensified), Sextile (60° - Easy talent), Trine (120° - Natural flow/ease)."
          details="Harmonious aspects link planetary energies in smooth elemental cooperation, generating effortless talent, creative synchronicity, and internal alignment."
        />
        <InteractiveBubble
          title="Frictional Aspects (Catalysts)"
          subtitle="90°, 180° Geometry"
          icon={ModalityIcon} glowColor={glow}
          summary="Square (90° - Tension/Growth edge), Opposition (180° - Polarity/Balance-seeking)."
          details="Frictional geometry generates constructive tension. Squares challenge you to build resilience, while Oppositions push you to seek balance between opposing life polarities."
        />
        <InteractiveBubble
          title="Stellium Clusters (Dominant Themes)"
          subtitle="Concentrated Energy"
          icon={ModalityIcon} glowColor={glow}
          summary="3+ planets in one sign/house create a dominant personality theme."
          details="A Stellium concentrates intense focus into a single zodiac sign or house, making that life domain the central focal point of your psychological journey."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(2)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(4)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 5: Elemental Balance
    <div key="w5" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 5 of 9 · Elemental Balance</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">{primaryElement} Element Alignment</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Fire & Earth (Passionate Realism)"
          subtitle="Initiative & Stability"
          icon={ElementIcon} glowColor={glow} defaultExpanded
          summary="Fire (Aries, Leo, Sag: Initiative, passion) and Earth (Taurus, Virgo, Cap: Practicality, stability)."
          details="Fire supplies spontaneous motivation, vision, and creative energy. Earth provides practical execution, material stability, and physical endurance."
        />
        <InteractiveBubble
          title="Air & Water (Intellectual Emotion)"
          subtitle="Cognition & Intuition"
          icon={ElementIcon} glowColor={glow}
          summary="Air (Gemini, Libra, Aqua: Intellect, social) and Water (Cancer, Scorpio, Pisces: Emotion, intuition)."
          details="Air processes abstract concepts, social connection, and objective logic. Water provides deep emotional bonding, empathetic intuition, and subconscious memory."
        />
        <InteractiveBubble
          title="Elemental Synthesis & Life Lessons"
          subtitle="Chart Balance Analysis"
          icon={ElementIcon} glowColor={glow}
          summary="Fire-heavy creates drive, Water-heavy creates intuition, missing elements represent life lessons."
          details="Your chart's elemental ratio shows where your energy naturally flows. A Fire-heavy chart creates raw drive, Water-heavy creates deep intuition, while missing elements highlight key life development areas."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(3)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(5)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 6: Modality (Style of Expression)
    <div key="w6" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 6 of 9 · Modality (Style of Expression)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">{sunData.modality} Operational Mode</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Cardinal (Initiator)"
          subtitle="Action Spark"
          icon={ModalityIcon} glowColor={glow} defaultExpanded
          summary="Initiating momentum, sparking new seasons."
          details="Cardinal modality (Aries, Cancer, Libra, Capricorn) equips you as a pioneer. You spark new projects, take directional initiative, and lead with active impulse."
        />
        <InteractiveBubble
          title="Fixed (Sustainer)"
          subtitle="Foundational Focus"
          icon={ModalityIcon} glowColor={glow}
          summary="Preserving foundations, building unshakeable concentration."
          details="Fixed modality (Taurus, Leo, Scorpio, Aquarius) endows you with endurance. You sustain momentum, safeguard foundations, and maintain deep concentration."
        />
        <InteractiveBubble
          title="Mutable (Adapter)"
          subtitle="Fluid Synthesis"
          icon={ModalityIcon} glowColor={glow}
          summary="Adapting to changing tides, synthesizing opposing forces."
          details="Mutable modality (Gemini, Virgo, Sagittarius, Pisces) empowers you as a flexible adapter. You synthesize complex information and navigate changing environments."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(4)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(6)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 7: The Calculation Engine (Behind the Scenes)
    <div key="w7" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 7 of 9 · The Calculation Engine</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Behind the Scenes Precision</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Stage 1 & 2: UT Time & Swiss Ephemeris"
          subtitle="Sub-Arcsecond Precision"
          icon={TimelineIcon} glowColor={glow} defaultExpanded
          summary="Local time converted to Universal Time (UT), generating planetary positions via Swiss Ephemeris (<1 arc-second precision)."
          details="Your local birth time is converted to Universal Time (UT). Swiss Ephemeris algorithms then compute exact geocentric planetary coordinates accurate to within less than 1 arc-second."
        />
        <InteractiveBubble
          title="Stage 3 & 4: LST Sidereal Time & House Cusps"
          subtitle="Placidus & Koch Geometry"
          icon={HouseIcon} glowColor={glow}
          summary="Local Sidereal Time (LST) used to calculate the Ascendant and Placidus/Koch house cusps."
          details="Using your exact geographic longitude and latitude, Local Sidereal Time (LST) is derived to calculate the precise Ascendant degree and divide the sky into 12 Placidus or Koch house cusps."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(5)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(7)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 8: Gemstone Correspondence
    <div key="w8" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 8 of 9 · Gemstone Correspondence</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Vibrational Frequency Alignment</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Vibrational Frequency & Gemstone Logic"
          subtitle="Resonance Alignment"
          icon={GemIcon} glowColor={glow} defaultExpanded
          summary="Gemstones carry vibrational frequencies of their planets to amplify well-placed energies or balance weak points."
          details="In classical and modern psychological astrology, gemstones act as physical crystalline resonators. They help focus planetary frequencies to strengthen executive focus or balance energy imbalances."
        />
        <InteractiveBubble
          title="Inner Planetary Gemstones"
          subtitle="Personal Planet Resonance"
          icon={GemIcon} glowColor={glow}
          summary="Sun (Ruby), Moon (Pearl), Mercury (Emerald), Venus (Diamond/Opal), Mars (Red Coral)."
          details="Sun resonates with Ruby (vitality), Moon with Pearl (emotional peace), Mercury with Emerald (intellect), Venus with Diamond/Opal (relational balance), and Mars with Red Coral (courage)."
        />
        <InteractiveBubble
          title="Outer & Major Gemstones"
          subtitle="Transpersonal Resonance"
          icon={GemIcon} glowColor={glow}
          summary="Jupiter (Yellow Sapphire), Saturn (Blue Sapphire), Uranus (Aquamarine), Neptune (Amethyst)."
          details="Jupiter aligns with Yellow Sapphire (wisdom & wealth), Saturn with Blue Sapphire (discipline & focus), Uranus with Aquamarine (innovation), and Neptune with Amethyst (transcendence)."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(6)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(8)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 9: Putting It All Together (The Interpretation Stack & Export)
    <div key="w9" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 9 of 9 · Putting It All Together</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">The Interpretation Stack</div>

      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="The Interpretation Stack"
          subtitle="Multi-Layered Framework"
          icon={DignityIcon} glowColor={glow} defaultExpanded
          summary="Big Three → Placements → Houses → Aspects → Elements → Gemstones."
          details="A full astrological reading is an interpretive stack layering: Big Three → Placements → Houses → Aspects → Elements → Gemstones. There is no single equation; it is a multi-layered interpretive framework."
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
        <CinematicButton onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating Poster...' : 'Download Chart'}
        </CinematicButton>
        <CinematicGhostButton onClick={() => advanceStep(2, `${userName} returned to Main Menu`)}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>,
  ]

  // ═════════════════════════════════════════════════════════════════════════════
  // VEDIC PIPELINE (9 SLIDES WITH DEFENSIVE NORMALIZATION)
  // ═════════════════════════════════════════════════════════════════════════════
  const VEDIC_SLIDES = [
    // Slide 1: The Core
    <div key="v1" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 1 of 9 · Vedic Core Formula</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Jyotish Core Triad</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Lagna (Ascendant) · ${ascSign}`}
          subtitle="Physical Temperament & Life Direction"
          icon={AscendantIcon} glowColor={glow} defaultExpanded
          summary={`Lagna (Ascendant) in ${ascSign} rules physical embodiment.`}
          details={`Lagna (Ascendant) in ${ascSign} establishes your birth chart foundation. Governed by ${ascData.ruling}, it dictates your physical vitality, health tendencies, and outward journey in society.`}
        />
        <InteractiveBubble
          title={`Rashi (Moon Sign) · ${moonSign}`}
          subtitle="Mind & Subconscious Mind"
          icon={MoonIcon} glowColor={glow}
          summary={`Rashi (Moon Sign) in ${moonSign} governs your Manas (Mind).`}
          details={`In Vedic astrology, Rashi (Moon Sign) is paramount. It governs Manas (Mind), emotional comfort, mental stability, and how you experience daily joy and anxiety.`}
        />
        <InteractiveBubble
          title={`Janma Nakshatra (Lunar Mansion) · ${nakshatra} (${pada})`}
          subtitle="Soul Realm & Stellar Subconscious"
          icon={SunIcon} glowColor={glow}
          summary={`Moon placed in ${nakshatra} ${pada}.`}
          details={`Janma Nakshatra (Lunar Mansion) ${nakshatra} (${pada}) reveals your soul's karmic wiring and precise starting point for Vimshottari Dasha (Planetary Period timeline).`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={goBack}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 2: Lagna Lord
    <div key="v2" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 2 of 9 · Lagna Lord Governance</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Lagna Lord (Ascendant Ruler)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Lagna Lord (Ascendant Ruler) · ${ascData.ruling}`}
          subtitle="Executive Temperament"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary={`Lagna Lord (Ascendant Ruler) ${ascData.ruling} guides your life force.`}
          details={`The placement of your Lagna Lord (Ascendant Ruler) ${ascData.ruling} determines where your life force is invested. In ${ascSign}, it grants ${safeLower(ascData.domain)}`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(0)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 3: Navagrahas (The 9 Planets)
    <div key="v3" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 3 of 9 · Navagrahas (9 Planets)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Planetary Bhavas (Houses)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Jupiter / Guru (Wisdom / Dharma)"
          subtitle="Great Benefic Planet"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary="Jupiter / Guru (Wisdom / Dharma) expands higher knowledge and morality."
          details="Guru (Jupiter) governs Dharma (Righteousness), fortune, children, and spiritual wisdom. Its aspect grants grace and protection over your chart."
        />
        <InteractiveBubble
          title="Saturn / Shani (Karma / Discipline)"
          subtitle="Taskmaster Planet"
          icon={PlanetIcon} glowColor={glow}
          summary="Saturn / Shani (Karma / Discipline) enforces perseverance and life duty."
          details="Shani (Saturn) teaches patience, hard work, and endurance through trial. It rewards dedicated service and mature responsibility."
        />
        <InteractiveBubble
          title="Mercury / Budha (Intellect / Commerce)"
          subtitle="Cognitive Planet"
          icon={PlanetIcon} glowColor={glow}
          summary="Mercury / Budha (Intellect / Commerce) governs speech and analytical skill."
          details="Budha (Mercury) rules discernment, financial trade, mathematical logic, and witty communication."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(1)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 4: Planetary Dignity
    <div key="v4" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 4 of 9 · Planetary Dignity</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Sthana Bala (Positional Strength)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Uccha (Exalted / Amplified) Dignity"
          subtitle="Peak Strength"
          icon={DignityIcon} glowColor={glow} defaultExpanded
          summary="Planets in Uccha (Exalted / Amplified) status express maximum benefic energy."
          details="Uccha (Exalted) planets deliver pure, unhindered virtues with high efficiency and natural authority."
        />
        <InteractiveBubble
          title="Sthana (Own Sign) & Neecha (Debilitated / Weakened)"
          subtitle="Sign Status"
          icon={DignityIcon} glowColor={glow}
          summary="Planets in Sthana (Own Sign) offer stable safety; Neecha requires remedial discipline."
          details="Sthana (Own Sign) brings comfort and confidence. Neecha (Debilitated / Weakened) planets require conscious effort and gemstone alignment to overcome friction."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(2)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(4)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 5: Shadbala & Yogas
    <div key="v5" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 5 of 9 · Shadbala & Yogas</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Shadbala (Six-fold Strength) & Yogas</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Shadbala (Six-fold Planetary Strength)"
          subtitle="Quantitative Power"
          icon={TimelineIcon} glowColor={glow} defaultExpanded
          summary="Measures directional, temporal, and positional planetary power."
          details="Shadbala (Six-fold Planetary Strength) quantifies how effectively a planet can manifest its results during its Dasha (Planetary Period)."
        />
        <InteractiveBubble
          title="Yogas (Positive Combinations) & Doshas (Karmic Challenges)"
          subtitle="Astro Combinations"
          icon={DignityIcon} glowColor={glow}
          summary="Special planetary alignments shaping destiny."
          details="Yogas (Positive Combinations) like Raja Yoga (Royal Union) bring prominence, while Doshas (Karmic Challenges) highlight growth areas requiring spiritual maturity."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(3)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(5)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 6: Pancha Mahabhutas (Elements)
    <div key="v6" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 6 of 9 · Pancha Mahabhutas (5 Elements)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Pancha Mahabhutas (Elements)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Agni (Fire) & Vayu (Air)"
          subtitle="Active Elements"
          icon={ElementIcon} glowColor={glow} defaultExpanded
          summary="Agni (Fire) governs transformation; Vayu (Air) governs mental movement."
          details="Agni (Fire) provides digestion, ambition, and spiritual vision. Vayu (Air) provides intellectual agility and nervous system communication."
        />
        <InteractiveBubble
          title="Prithvi (Earth) & Jala (Water)"
          subtitle="Nurturing Elements"
          icon={ElementIcon} glowColor={glow}
          summary="Prithvi (Earth) governs physical structure; Jala (Water) governs emotional fluidity."
          details="Prithvi (Earth) bestows bodily stability, endurance, and material wealth. Jala (Water) bestows devotion, memory, and emotional healing."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(4)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(6)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 7: Prakriti (Ayurvedic Dosha)
    <div key="v7" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 7 of 9 · Prakriti (Ayurvedic Constitution)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Prakriti (Ayurvedic Dosha)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Dominant Ayurvedic Constitution"
          subtitle="Mind-Body Balance"
          icon={AyurvedaIcon} glowColor={glow} defaultExpanded
          summary={`Your chart reveals strong ${primaryElement === 'Fire' ? 'Pitta (Fiery/Intense)' : primaryElement === 'Earth' || primaryElement === 'Water' ? 'Kapha (Grounded/Nurturing)' : 'Vata (Airy/Restless)'} alignment.`}
          details="Prakriti (Ayurvedic Constitution) reflects your innate mind-body blueprint: Pitta (Fiery/Intense) drives digestion & focus, Kapha (Grounded/Nurturing) builds immunity & composure, Vata (Airy/Restless) drives mental creativity & mobility."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(5)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(7)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 8: Vimshottari Dasha & Gemstone
    <div key="v8" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 8 of 9 · Dasha & Ratna (Gemstone)</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Dasha & Ratna (Gemstone)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Vimshottari Dasha (Planetary Period timeline)"
          subtitle="Time Unfolding"
          icon={TimelineIcon} glowColor={glow} defaultExpanded
          summary={`Active Period: ${currentDasha}`}
          details="Vimshottari Dasha (Planetary Period timeline) determines which planet's energy dominates your current life phase, triggering career shifts, relationship milestones, and spiritual lessons."
        />
        <InteractiveBubble
          title={`Ratna (Gemstone Recommendation) · ${sunData.vedicGem}`}
          subtitle="Benefic Amplification"
          icon={GemIcon} glowColor={glow}
          summary={`Recommended Gemstone: ${sunData.vedicGem}`}
          details={`To strengthen your Lagna Lord (Ascendant Ruler) and weak benefic planets, wear ${sunData.vedicGem} set in ${sunData.metal} on a ${sunData.day} morning after consecration.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(6)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(8)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 9: Synthesis & Export
    <div key="v9" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 9 of 9 · Final Vedic Synthesis</div>
      <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Complete Jyotish Dossier</div>

      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Vedic Soul Blueprint Synthesis"
          subtitle="Karmic Vector"
          icon={DignityIcon} glowColor={glow} defaultExpanded
          summary={`Nakshatra Realm: ${nakshatra} (${pada})`}
          details={`Your soul path is guided by ${nakshatra} Nakshatra (${pada}) with Lagna Lord ${ascData.ruling} protecting your Dharma.`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
        <CinematicButton onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating Poster...' : 'Download Chart'}
        </CinematicButton>
        <CinematicGhostButton onClick={() => advanceStep(2, `${userName} returned to Main Menu`)}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>,
  ]

  const activeSlides = isVedic ? VEDIC_SLIDES : WESTERN_SLIDES
  const currentSlide = activeSlides[Math.min(revealSlide, activeSlides.length - 1)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative">
      {/* ── Hidden Dedicated Infographic Poster Export Template (800px x 1200px) ── */}
      <div
        ref={exportRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '800px',
          height: '1200px',
          background: '#030712',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '3.5rem 3.5rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(160, 200, 255, 0.2)',
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(160, 200, 255, 0.15)', paddingBottom: '2rem' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>
            ASTROLOGICA CELESTIAL BLUEPRINT
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 200, letterSpacing: '0.35em', color: '#ffffff', textShadow: '0 0 24px rgba(0, 210, 255, 0.6)' }}>
            ASTROLOGICA
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.25em', color: 'rgba(200, 220, 255, 0.85)', marginTop: '0.6rem' }}>
            {sysLabel}
          </div>
        </div>

        {/* User Identity Banner */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.12)', borderRadius: '1rem', padding: '1.6rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(160, 200, 255, 0.4)' }}>Traveller Identity</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 300, letterSpacing: '0.1em', color: '#ffffff', marginTop: '0.2rem' }}>{userName || 'Cosmic Traveller'}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'rgba(200, 220, 255, 0.8)', lineHeight: 1.7 }}>
            <div>Date: <strong style={{ color: '#fff' }}>{birthData?.date || '—'}</strong></div>
            <div>Time: <strong style={{ color: '#fff' }}>{birthData?.time || '—'}</strong></div>
            <div>Location: <strong style={{ color: '#fff' }}>{birthData?.locationName || 'Global Ephemeris'}</strong></div>
          </div>
        </div>

        {/* The Core Triad Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Sun Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.5rem' }}>Sun (Core Identity)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{sunSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.5rem' }}>Ruler: {sunData.ruling}</div>
          </div>
          {/* Moon Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.5rem' }}>Moon (Subconscious)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{moonSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.5rem' }}>Element: {moonData.element}</div>
          </div>
          {/* Ascendant Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.5rem' }}>Ascendant (Rising)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{ascSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.5rem' }}>Modality: {ascData.modality}</div>
          </div>
        </div>

        {/* Formula Breakdown Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.12)', borderRadius: '1rem', padding: '1.6rem' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.8rem' }}>Elemental Composition</div>
            <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.85)' }}>
              <div>• Primary Fuel: <strong style={{ color: '#38bdf8' }}>{primaryElement} Element Alignment</strong></div>
              <div>• Sun Modality: <strong>{sunData.modality} Operational Mode</strong></div>
              <div>• Behavioral Focus: <em>{sunData.domain}</em></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.12)', borderRadius: '1rem', padding: '1.6rem' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.8rem' }}>Resonance & Gemstone</div>
            <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.85)' }}>
              <div>• Assigned Gemstone: <strong style={{ color: '#fbbf24' }}>{sunData.stone}</strong></div>
              <div>• Ruling Gravity: <strong>{sunData.ruling}</strong></div>
              <div>• Metal Alignment: <strong>{sunData.metal} ({sunData.day})</strong></div>
            </div>
          </div>
        </div>

        {/* Algorithmic Synthesis Narrative */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.8rem', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(160, 200, 255, 0.4)', marginBottom: '0.5rem' }}>Algorithmic Synthesis</div>
          <div style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.9)' }}>
            "You embody the {safeLower(primaryElement)} power of {sunSign} with {safeLower(sunData.modality)} momentum, guided by {sunData.ruling} to illuminate your unique psychological blueprint."
          </div>
        </div>

        {/* Footer Stamp */}
        <div style={{ borderTop: '1px solid rgba(160, 200, 255, 0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.4)' }}>
          <div>Swiss Ephemeris v2.10 · Sub-Arcsecond Precision</div>
          <div>Designed by Pratham Upadhyay</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`reveal-pipeline-${preferredSystem}-slide-${revealSlide}`}
          {...SLIDE_TRANSITION}
          className="w-full max-w-xl"
        >
          {currentSlide}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
