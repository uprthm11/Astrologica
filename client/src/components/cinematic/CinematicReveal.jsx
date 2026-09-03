import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'
import InteractiveBubble from './InteractiveBubble'
import {
  ZODIAC_SVG_COMPONENTS,
  SUN_SIGN_DESCRIPTIONS,
  MOON_SIGN_DESCRIPTIONS,
  ASCENDANT_DESCRIPTIONS,
} from '../../utils/bigThreeData'

// ─── Defensive String Helper ──────────────────────────────────────────────────
const safeLower = (val) => String(val || '').toLowerCase()

// ─── General Category SVG Icons ───────────────────────────────────────────────
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
const TimelineIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ─── Sign Database ────────────────────────────────────────────────────────────
const SIGN_DATA = {
  Aries: {
    element: 'Fire', modality: 'Cardinal', ruling: 'Mars/Mangal',
    stone: 'Diamond / Red Coral', metal: 'Copper', day: 'Tuesday',
    domain: 'Pioneering drive, instinctive courage, and direct initiative.',
  },
  Taurus: {
    element: 'Earth', modality: 'Fixed', ruling: 'Venus/Shukra',
    stone: 'Emerald / Diamond', metal: 'Silver / White Gold', day: 'Friday',
    domain: 'Resource preservation, sensory elegance, and grounded stability.',
  },
  Gemini: {
    element: 'Air', modality: 'Mutable', ruling: 'Mercury/Budha',
    stone: 'Pearl / Emerald', metal: 'Gold', day: 'Wednesday',
    domain: 'Quicksilver intellect, dual curiosity, and articulate agility.',
  },
  Cancer: {
    element: 'Water', modality: 'Cardinal', ruling: 'Moon/Chandra',
    stone: 'Ruby / Pearl', metal: 'Silver', day: 'Monday',
    domain: 'Deep empathic intuition, protective roots, and lunar sensitivity.',
  },
  Leo: {
    element: 'Fire', modality: 'Fixed', ruling: 'Sun/Surya',
    stone: 'Peridot / Ruby', metal: 'Gold / Copper', day: 'Sunday',
    domain: 'Radiant authority, magnetic warmth, and sovereign creative flame.',
  },
  Virgo: {
    element: 'Earth', modality: 'Mutable', ruling: 'Mercury/Budha',
    stone: 'Sapphire / Emerald', metal: 'Gold', day: 'Wednesday',
    domain: 'Analytical mastery, sacred devotion, and bodily harmony.',
  },
  Libra: {
    element: 'Air', modality: 'Cardinal', ruling: 'Venus/Shukra',
    stone: 'Opal / Diamond', metal: 'Silver', day: 'Friday',
    domain: 'Cosmic harmony, aesthetic justice, and relational diplomacy.',
  },
  Scorpio: {
    element: 'Water', modality: 'Fixed', ruling: 'Mars/Mangal',
    stone: 'Topaz / Red Coral', metal: 'Copper', day: 'Tuesday',
    domain: 'Transformative depth, alchemical perception, and intense magnetism.',
  },
  Sagittarius: {
    element: 'Fire', modality: 'Mutable', ruling: 'Jupiter/Guru',
    stone: 'Turquoise / Yellow Sapphire', metal: 'Gold', day: 'Thursday',
    domain: 'Expansive philosophy, boundless freedom, and truth-seeking arrows.',
  },
  Capricorn: {
    element: 'Earth', modality: 'Cardinal', ruling: 'Saturn/Shani',
    stone: 'Garnet / Blue Sapphire', metal: 'Iron / Steel', day: 'Saturday',
    domain: 'Architectural ambition, timeless discipline, and mountain resilience.',
  },
  Aquarius: {
    element: 'Air', modality: 'Fixed', ruling: 'Saturn/Shani',
    stone: 'Amethyst / Blue Sapphire', metal: 'Iron / Steel', day: 'Saturday',
    domain: 'Visionary innovation, collective ideals, and electric originality.',
  },
  Pisces: {
    element: 'Water', modality: 'Mutable', ruling: 'Jupiter/Guru',
    stone: 'Aquamarine / Yellow Sapphire', metal: 'Gold', day: 'Thursday',
    domain: 'Mystic transcendence, fluid compassion, and oceanic imagination.',
  },
}

const DEFAULT_SIGN_INFO = SIGN_DATA.Aries

function normalizeSign(rawSign) {
  if (!rawSign || typeof rawSign !== 'string') return 'Aries'
  const clean = rawSign.trim()
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()
  return SIGN_DATA[capitalized] ? capitalized : 'Aries'
}

const ELEMENT_COLORS = {
  Fire:  '#f97316',
  Earth: '#10b981',
  Air:   '#06b6d4',
  Water: '#3858f6',
}

const ELEMENT_GLOW_CLASSES = {
  Fire:  'drop-shadow-[0_0_24px_rgba(249,115,22,0.85)] text-orange-400',
  Earth: 'drop-shadow-[0_0_24px_rgba(16,185,129,0.85)] text-emerald-400',
  Air:   'drop-shadow-[0_0_24px_rgba(6,182,212,0.85)] text-cyan-400',
  Water: 'drop-shadow-[0_0_24px_rgba(56,88,246,0.85)] text-blue-400',
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.4 } },
}

export default function CinematicReveal() {
  const { astrologyData, birthData, userName, revealSlide, setRevealSlide, advanceStep, goBack } = useAppStore()
  const [downloading, setDownloading] = useState(false)
  const exportRef = useRef(null)

  // Planetary sign extraction
  const planets = astrologyData?.western?.planets || []
  const rawSunSign  = planets.find(p => p?.id === 'sun')?.sign
  const rawMoonSign = planets.find(p => p?.id === 'moon')?.sign
  const rawAscSign  = astrologyData?.western?.ascendant?.sign

  const sunSign  = normalizeSign(rawSunSign)
  const moonSign = normalizeSign(rawMoonSign)
  const ascSign  = normalizeSign(rawAscSign)

  const sunData  = SIGN_DATA[sunSign]  || DEFAULT_SIGN_INFO
  const moonData = SIGN_DATA[moonSign] || DEFAULT_SIGN_INFO
  const ascData  = SIGN_DATA[ascSign]  || DEFAULT_SIGN_INFO

  const primaryElement = sunData?.element || 'Air'
  const bubbleGlow = ELEMENT_COLORS[primaryElement] || '#06b6d4'

  const SunZodiacIcon = ZODIAC_SVG_COMPONENTS[sunSign] || ZODIAC_SVG_COMPONENTS.Aries
  const MoonZodiacIcon = ZODIAC_SVG_COMPONENTS[moonSign] || ZODIAC_SVG_COMPONENTS.Taurus
  const AscZodiacIcon = ZODIAC_SVG_COMPONENTS[ascSign] || ZODIAC_SVG_COMPONENTS.Gemini

  const sunInfo = SUN_SIGN_DESCRIPTIONS[sunSign] || SUN_SIGN_DESCRIPTIONS.Aries
  const moonInfo = MOON_SIGN_DESCRIPTIONS[moonSign] || MOON_SIGN_DESCRIPTIONS.Taurus
  const ascInfo = ASCENDANT_DESCRIPTIONS[ascSign] || ASCENDANT_DESCRIPTIONS.Gemini

  const sunGlowClass = ELEMENT_GLOW_CLASSES[sunData.element] || ELEMENT_GLOW_CLASSES.Fire
  const moonGlowClass = ELEMENT_GLOW_CLASSES[moonData.element] || ELEMENT_GLOW_CLASSES.Water
  const ascGlowClass = ELEMENT_GLOW_CLASSES[ascData.element] || ELEMENT_GLOW_CLASSES.Air

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
      link.download = `astrologica-psychological-depth-${safeLower(userName || 'blueprint').replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }, [userName])

  // ═════════════════════════════════════════════════════════════════════════════
  // 11-SLIDE PSYCHOLOGICAL DEPTH PIPELINE
  // ═════════════════════════════════════════════════════════════════════════════
  const SLIDES = [
    // ── Slide 1 (The Sun Sign) ──
    <div key="slide-1" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 1 of 11 · The Sun Sign
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        The Core Solar Identity
      </div>
      <p className="text-base md:text-lg font-light text-blue-100/75 max-w-lg mx-auto leading-relaxed drop-shadow-md">
        The Sun sign represents your core identity, conscious ego, and life purpose, acting as the central axis of your personality and the "I AM" statement of your chart.
      </p>

      {/* Dynamic Center Display with Custom Figma SVG */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className={`p-4 rounded-full ${sunGlowClass} transition-transform hover:scale-105 duration-300`}>
          <SunZodiacIcon className="w-24 h-24 md:w-28 md:h-28" />
        </div>
        <div className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mt-3">
          {sunSign.toUpperCase()}
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/60 mt-1">
          {sunInfo.elementModality} · {sunInfo.archetype}
        </div>
      </div>

      {/* Personalized Narrative Text */}
      <div className="max-w-lg mx-auto p-4 bg-white/[0.015] border border-blue-200/10 rounded-2xl">
        <p className="text-base md:text-lg font-light text-white/90 leading-relaxed drop-shadow-md">
          {sunInfo.text}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={goBack}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 2 (The Moon Sign) ──
    <div key="slide-2" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 2 of 11 · The Moon Sign
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        The Subconscious & Emotional Realm
      </div>
      <p className="text-base md:text-lg font-light text-blue-100/75 max-w-lg mx-auto leading-relaxed drop-shadow-md">
        The Western moon sign governs your emotional instincts, subconscious patterns, and inner comfort needs, revealing your private inner world distinct from your public sun sign identity.
      </p>

      {/* Dynamic Center Display with Custom Figma SVG */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className={`p-4 rounded-full ${moonGlowClass} transition-transform hover:scale-105 duration-300`}>
          <MoonZodiacIcon className="w-24 h-24 md:w-28 md:h-28" />
        </div>
        <div className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mt-3">
          {moonSign.toUpperCase()}
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/60 mt-1">
          {moonInfo.elementGroup} · {moonInfo.subconsciousNeed}
        </div>
      </div>

      {/* Personalized Narrative Text */}
      <div className="max-w-lg mx-auto p-4 bg-white/[0.015] border border-blue-200/10 rounded-2xl">
        <p className="text-base md:text-lg font-light text-white/90 leading-relaxed drop-shadow-md">
          {moonInfo.text}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(0)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 3 (The Ascendant / Rising) ──
    <div key="slide-3" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 3 of 11 · The Ascendant (Rising)
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        The Outer Persona & Horizon
      </div>
      <p className="text-base md:text-lg font-light text-blue-100/75 max-w-lg mx-auto leading-relaxed drop-shadow-md">
        The Western Ascendant is the zodiac sign rising on the eastern horizon at the exact moment of birth, acting as the "outer mask" that governs first impressions and outward persona.
      </p>

      {/* Dynamic Center Display with Custom Figma SVG */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className={`p-4 rounded-full ${ascGlowClass} transition-transform hover:scale-105 duration-300`}>
          <AscZodiacIcon className="w-24 h-24 md:w-28 md:h-28" />
        </div>
        <div className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mt-3">
          {ascSign.toUpperCase()}
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/60 mt-1">
          {ascData.element} Element · {ascInfo.outerMask}
        </div>
      </div>

      {/* Personalized Narrative Text */}
      <div className="max-w-lg mx-auto p-4 bg-white/[0.015] border border-blue-200/10 rounded-2xl">
        <p className="text-base md:text-lg font-light text-white/90 leading-relaxed drop-shadow-md">
          {ascInfo.firstImpression}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(1)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 4: Inner Planetary Placements ──
    <div key="slide-4" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 4 of 11 · Inner Planetary Placements
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        Cognitive & Relational Engines
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Mercury (Cognition & Intellect) · ${sunSign}`}
          subtitle="Communication & Logic"
          icon={PlanetIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Domain: Communication, intellect, learning, logic."
          details={`Mercury governs thought patterns, speech, data processing, and decision-making logic. In ${sunSign}, your mind processes through ${safeLower(sunData.domain)}`}
        />
        <InteractiveBubble
          title={`Venus (Love & Aesthetics) · ${moonSign}`}
          subtitle="Relational Values"
          icon={PlanetIcon} glowColor={bubbleGlow}
          summary="Domain: Love, aesthetics, values, harmony."
          details={`Venus rules how you bond, express affection, evaluate beauty, and manage financial value. In ${moonSign}, you seek relational harmony through ${safeLower(moonData.domain)}`}
        />
        <InteractiveBubble
          title="Mars (Drive & Ambition)"
          subtitle="Executive Willpower"
          icon={PlanetIcon} glowColor={bubbleGlow}
          summary="Domain: Drive, assertiveness, courage, conflict style."
          details="Mars is your engine of desire, anger management, physical stamina, and competitive instinct. It defines your conflict style and active courage."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(2)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(4)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 5: Outer Planetary Expansion ──
    <div key="slide-5" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 5 of 11 · Outer Planetary Expansion
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        Transpersonal Horizons
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Jupiter & Saturn (Growth vs. Structure)"
          subtitle="Social & Karmic Expansion"
          icon={PlanetIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Jupiter (Growth, optimism, abundance) and Saturn (Discipline, structure, limitation)."
          details="Jupiter expands your philosophy, optimism, and fortune. Saturn enforces discipline, structure, boundary setting, and mature responsibility through time."
        />
        <InteractiveBubble
          title="Uranus, Neptune & Pluto (Transpersonal Shift)"
          subtitle="Generational Transformation"
          icon={PlanetIcon} glowColor={bubbleGlow}
          summary="Uranus (Innovation), Neptune (Imagination, spirituality), Pluto (Transformation, depth, rebirth)."
          details="Uranus breaks outdated paradigms with electric innovation. Neptune dissolves boundaries into imagination and spirituality. Pluto drives total psychological rebirth and deep transformation."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(3)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(5)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 6: Astrological Aspects ──
    <div key="slide-6" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 6 of 11 · Astrological Aspects (Geometry)
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        Planetary Aspects & Clusters
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Harmonious Aspects (Flow)"
          subtitle="0°, 60°, 120° Geometry"
          icon={ModalityIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Conjunction (0° - Fusion/Intensified), Sextile (60° - Easy talent), Trine (120° - Natural flow/ease)."
          details="Harmonious aspects link planetary energies in smooth elemental cooperation, generating effortless talent, creative synchronicity, and internal alignment."
        />
        <InteractiveBubble
          title="Frictional Aspects (Catalysts)"
          subtitle="90°, 180° Geometry"
          icon={ModalityIcon} glowColor={bubbleGlow}
          summary="Square (90° - Tension/Growth edge), Opposition (180° - Polarity/Balance-seeking)."
          details="Frictional geometry generates constructive tension. Squares challenge you to build resilience, while Oppositions push you to seek balance between opposing life polarities."
        />
        <InteractiveBubble
          title="Stellium Clusters (Dominant Themes)"
          subtitle="Concentrated Energy"
          icon={ModalityIcon} glowColor={bubbleGlow}
          summary="3+ planets in one sign/house create a dominant personality theme."
          details="A Stellium concentrates intense focus into a single zodiac sign or house, making that life domain the central focal point of your psychological journey."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(4)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(6)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 7: Elemental Balance ──
    <div key="slide-7" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 7 of 11 · Elemental Balance
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        {primaryElement} Element Alignment
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Fire & Earth (Passionate Realism)"
          subtitle="Initiative & Stability"
          icon={ElementIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Fire (Aries, Leo, Sag: Initiative, passion) and Earth (Taurus, Virgo, Cap: Practicality, stability)."
          details="Fire supplies spontaneous motivation, vision, and creative energy. Earth provides practical execution, material stability, and physical endurance."
        />
        <InteractiveBubble
          title="Air & Water (Intellectual Emotion)"
          subtitle="Cognition & Intuition"
          icon={ElementIcon} glowColor={bubbleGlow}
          summary="Air (Gemini, Libra, Aqua: Intellect, social) and Water (Cancer, Scorpio, Pisces: Emotion, intuition)."
          details="Air processes abstract concepts, social connection, and objective logic. Water provides deep emotional bonding, empathetic intuition, and subconscious memory."
        />
        <InteractiveBubble
          title="Elemental Synthesis & Life Lessons"
          subtitle="Chart Balance Analysis"
          icon={ElementIcon} glowColor={bubbleGlow}
          summary="Fire-heavy creates drive, Water-heavy creates intuition, missing elements represent life lessons."
          details="Your chart's elemental ratio shows where your energy naturally flows. A Fire-heavy chart creates raw drive, Water-heavy creates deep intuition, while missing elements highlight key life development areas."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(5)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(7)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 8: Modality (Style of Expression) ──
    <div key="slide-8" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 8 of 11 · Modality (Style of Expression)
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        {sunData.modality} Operational Mode
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Cardinal (Initiator)"
          subtitle="Action Spark"
          icon={ModalityIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Initiating momentum, sparking new seasons."
          details="Cardinal modality (Aries, Cancer, Libra, Capricorn) equips you as a pioneer. You spark new projects, take directional initiative, and lead with active impulse."
        />
        <InteractiveBubble
          title="Fixed (Sustainer)"
          subtitle="Foundational Focus"
          icon={ModalityIcon} glowColor={bubbleGlow}
          summary="Preserving foundations, building unshakeable concentration."
          details="Fixed modality (Taurus, Leo, Scorpio, Aquarius) endows you with endurance. You sustain momentum, safeguard foundations, and maintain deep concentration."
        />
        <InteractiveBubble
          title="Mutable (Adapter)"
          subtitle="Fluid Synthesis"
          icon={ModalityIcon} glowColor={bubbleGlow}
          summary="Adapting to changing tides, synthesizing opposing forces."
          details="Mutable modality (Gemini, Virgo, Sagittarius, Pisces) empowers you as a flexible adapter. You synthesize complex information and navigate changing environments."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(6)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(8)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 9: The Calculation Engine ──
    <div key="slide-9" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 9 of 11 · The Calculation Engine
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        Behind the Scenes Precision
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Stage 1 & 2: UT Time & Swiss Ephemeris"
          subtitle="Sub-Arcsecond Precision"
          icon={TimelineIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Local time converted to Universal Time (UT), generating planetary positions via Swiss Ephemeris (<1 arc-second precision)."
          details="Your local birth time is converted to Universal Time (UT). Swiss Ephemeris algorithms then compute exact geocentric planetary coordinates accurate to within less than 1 arc-second."
        />
        <InteractiveBubble
          title="Stage 3 & 4: LST Sidereal Time & House Cusps"
          subtitle="Placidus & Koch Geometry"
          icon={HouseIcon} glowColor={bubbleGlow}
          summary="Local Sidereal Time (LST) used to calculate the Ascendant and Placidus/Koch house cusps."
          details="Using your exact geographic longitude and latitude, Local Sidereal Time (LST) is derived to calculate the precise Ascendant degree and divide the sky into 12 Placidus or Koch house cusps."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(7)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(9)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 10: Gemstone Correspondence ──
    <div key="slide-10" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 10 of 11 · Gemstone Correspondence
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        Vibrational Frequency Alignment
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Vibrational Frequency & Gemstone Logic"
          subtitle="Resonance Alignment"
          icon={GemIcon} glowColor={bubbleGlow} defaultExpanded
          summary="Gemstones carry vibrational frequencies of their planets to amplify well-placed energies or balance weak points."
          details="In classical and modern psychological astrology, gemstones act as physical crystalline resonators. They help focus planetary frequencies to strengthen executive focus or balance energy imbalances."
        />
        <InteractiveBubble
          title="Inner Planetary Gemstones"
          subtitle="Personal Planet Resonance"
          icon={GemIcon} glowColor={bubbleGlow}
          summary="Sun (Ruby), Moon (Pearl), Mercury (Emerald), Venus (Diamond/Opal), Mars (Red Coral)."
          details="Sun resonates with Ruby (vitality), Moon with Pearl (emotional peace), Mercury with Emerald (intellect), Venus with Diamond/Opal (relational balance), and Mars with Red Coral (courage)."
        />
        <InteractiveBubble
          title="Outer & Major Gemstones"
          subtitle="Transpersonal Resonance"
          icon={GemIcon} glowColor={bubbleGlow}
          summary="Jupiter (Yellow Sapphire), Saturn (Blue Sapphire), Uranus (Aquamarine), Neptune (Amethyst)."
          details="Jupiter aligns with Yellow Sapphire (wisdom & wealth), Saturn with Blue Sapphire (discipline & focus), Uranus with Aquamarine (innovation), and Neptune with Amethyst (transcendence)."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(8)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(10)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 11: Putting It All Together & Poster Export ──
    <div key="slide-11" className="space-y-6 text-center">
      <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/50">
        Slide 11 of 11 · Putting It All Together
      </div>
      <div className="text-2xl md:text-3xl font-light text-white tracking-widest drop-shadow-md">
        The Interpretation Stack
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="The Interpretation Stack"
          subtitle="Multi-Layered Framework"
          icon={DignityIcon} glowColor={bubbleGlow} defaultExpanded
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

  const currentSlide = SLIDES[Math.min(revealSlide, SLIDES.length - 1)]

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 py-8 relative">
      {/* ── Hidden Dedicated High-Res Infographic Poster Export Template (800px x 1200px) ── */}
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
            Psychological Depth Blueprint
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

        {/* The Core Triad Grid with High-Fidelity Custom Figma SVGs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Sun Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Sun (Core Identity)</div>
            <div style={{ display: 'flex', justifyContent: 'center', color: ELEMENT_COLORS[sunData.element] || '#f97316', marginBottom: '0.5rem' }}>
              <SunZodiacIcon className="w-14 h-14" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{sunSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.4rem' }}>{sunData.element} · {sunData.modality}</div>
          </div>
          {/* Moon Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Moon (Subconscious)</div>
            <div style={{ display: 'flex', justifyContent: 'center', color: ELEMENT_COLORS[moonData.element] || '#3858f6', marginBottom: '0.5rem' }}>
              <MoonZodiacIcon className="w-14 h-14" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{moonSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.4rem' }}>{moonData.element} · {moonData.modality}</div>
          </div>
          {/* Ascendant Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Ascendant (Rising)</div>
            <div style={{ display: 'flex', justifyContent: 'center', color: ELEMENT_COLORS[ascData.element] || '#06b6d4', marginBottom: '0.5rem' }}>
              <AscZodiacIcon className="w-14 h-14" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{ascSign}</div>
            <div style={{ fontSize: '11px', color: 'rgba(200, 220, 255, 0.65)', marginTop: '0.4rem' }}>{ascData.element} · {ascData.modality}</div>
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
          key={`reveal-pipeline-slide-${revealSlide}`}
          {...SLIDE_TRANSITION}
          className="w-full max-w-xl"
        >
          {currentSlide}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
