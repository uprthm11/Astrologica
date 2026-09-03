import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'
import InteractiveBubble from './InteractiveBubble'

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

// ─── Sign Database ────────────────────────────────────────────────────────────
const SIGN_DATA = {
  Aries:       { element: 'Fire',  modality: 'Cardinal', ruling: 'Mars/Mangal',    stone: 'Diamond / Red Coral (Moonga)',   vedicGem: 'Red Coral (Moonga)',   metal: 'Copper', day: 'Tuesday' },
  Taurus:      { element: 'Earth', modality: 'Fixed',    ruling: 'Venus/Shukra',   stone: 'Emerald / Diamond (Hira)',       vedicGem: 'Diamond (Hira)',       metal: 'Silver / White Gold', day: 'Friday' },
  Gemini:      { element: 'Air',   modality: 'Mutable',  ruling: 'Mercury/Budha', stone: 'Pearl / Emerald (Panna)',       vedicGem: 'Emerald (Panna)',      metal: 'Gold', day: 'Wednesday' },
  Cancer:      { element: 'Water', modality: 'Cardinal', ruling: 'Moon/Chandra',   stone: 'Ruby / Pearl (Moti)',            vedicGem: 'Natural Pearl (Moti)', metal: 'Silver', day: 'Monday' },
  Leo:         { element: 'Fire',  modality: 'Fixed',    ruling: 'Sun/Surya',     stone: 'Peridot / Ruby (Manik)',         vedicGem: 'Ruby (Manik)',         metal: 'Gold / Copper', day: 'Sunday' },
  Virgo:       { element: 'Earth', modality: 'Mutable',  ruling: 'Mercury/Budha', stone: 'Sapphire / Emerald (Panna)',     vedicGem: 'Emerald (Panna)',      metal: 'Gold', day: 'Wednesday' },
  Libra:       { element: 'Air',   modality: 'Cardinal', ruling: 'Venus/Shukra',   stone: 'Opal / Diamond (Hira)',          vedicGem: 'Diamond (Hira)',       metal: 'Silver', day: 'Friday' },
  Scorpio:     { element: 'Water', modality: 'Fixed',    ruling: 'Mars/Mangal',    stone: 'Topaz / Red Coral (Moonga)',     vedicGem: 'Red Coral (Moonga)',   metal: 'Copper', day: 'Tuesday' },
  Sagittarius: { element: 'Fire',  modality: 'Mutable',  ruling: 'Jupiter/Guru',  stone: 'Turquoise / Yellow Sapphire (Pukhraj)', vedicGem: 'Yellow Sapphire (Pukhraj)', metal: 'Gold', day: 'Thursday' },
  Capricorn:   { element: 'Earth', modality: 'Cardinal', ruling: 'Saturn/Shani',  stone: 'Garnet / Blue Sapphire (Neelam)', vedicGem: 'Blue Sapphire (Neelam)', metal: 'Iron / Steel', day: 'Saturday' },
  Aquarius:    { element: 'Air',   modality: 'Fixed',    ruling: 'Saturn/Shani',  stone: 'Amethyst / Blue Sapphire (Neelam)', vedicGem: 'Blue Sapphire (Neelam)', metal: 'Iron / Steel', day: 'Saturday' },
  Pisces:      { element: 'Water', modality: 'Mutable',  ruling: 'Jupiter/Guru',  stone: 'Aquamarine / Yellow Sapphire (Pukhraj)', vedicGem: 'Yellow Sapphire (Pukhraj)', metal: 'Gold', day: 'Thursday' },
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
  const { astrologyData, userName, preferredSystem, revealSlide, setRevealSlide, advanceStep, goBack } = useAppStore()
  const [downloading, setDownloading] = useState(false)
  const chartRef = useRef(null)

  const isVedic = preferredSystem === 'vedic'
  const sysLabel = isVedic ? 'Vedic Sidereal Formula' : 'Western Tropical Formula'

  // Data Extraction
  let sunSign = 'Aries'
  let moonSign = 'Aries'
  let ascSign = 'Aries'
  let nakshatra = 'Ashwini'
  let pada = 'Pada 1'
  let currentDasha = 'Ketu Mahadasha (Karmic Awakening)'

  if (isVedic) {
    sunSign   = astrologyData?.vedic?.surya_rashi?.rashi || 'Aries'
    moonSign  = astrologyData?.vedic?.chandra_rashi?.rashi || 'Taurus'
    ascSign   = astrologyData?.vedic?.lagna?.rashi || 'Gemini'
    nakshatra = astrologyData?.vedic?.chandra_rashi?.nakshatra?.name || 'Rohini'
    pada      = `Pada ${astrologyData?.vedic?.chandra_rashi?.nakshatra?.pada || 2}`
  } else {
    const planets = astrologyData?.western?.planets || []
    sunSign  = planets.find(p => p.id === 'sun')?.sign || 'Aries'
    moonSign = planets.find(p => p.id === 'moon')?.sign || 'Taurus'
    ascSign  = astrologyData?.western?.ascendant?.sign || 'Gemini'
  }

  const sunData  = SIGN_DATA[sunSign]  || SIGN_DATA.Aries
  const moonData = SIGN_DATA[moonSign] || SIGN_DATA.Taurus
  const ascData  = SIGN_DATA[ascSign]  || SIGN_DATA.Gemini

  const primaryElement = sunData.element
  const glow = ELEMENT_GLOWS[primaryElement] || ELEMENT_GLOWS.Air

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#050816', scale: 2, useCORS: true, logging: false
      })
      const link = document.createElement('a')
      link.download = `astrologica-${preferredSystem}-${(userName || 'chart').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }, [userName, preferredSystem])

  // ═════════════════════════════════════════════════════════════════════════════
  // WESTERN PIPELINE (9 SLIDES)
  // ═════════════════════════════════════════════════════════════════════════════
  const WESTERN_SLIDES = [
    // Slide 1: The Core
    <div key="w1" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 1 of 9 · Western Core Triad</div>
      <div className="text-2xl font-light text-white tracking-widest">Core Psychological Archetype</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Sun (Identity) · ${sunSign}`}
          subtitle="Solar Core & Ego Direction"
          icon={SunIcon} glowColor={glow} defaultExpanded
          summary={`Your central identity operates through ${sunData.element.toLowerCase()} drive.`}
          details={`Sun in ${sunSign} dictates your conscious purpose, core ego drives, and solar vitality. Governed by ${sunData.ruling}, you channel ${sunData.domain.toLowerCase()}`}
        />
        <InteractiveBubble
          title={`Moon (Emotions) · ${moonSign}`}
          subtitle="Subconscious Instincts"
          icon={MoonIcon} glowColor={glow}
          summary={`Emotional needs align with ${moonData.element.toLowerCase()} safety.`}
          details={`Moon in ${moonSign} rules your subconscious reactions, emotional safety needs, and private self. You process experiences through ${moonData.domain.toLowerCase()}`}
        />
        <InteractiveBubble
          title={`Ascendant (Rising Sign) · ${ascSign}`}
          subtitle="Outer Persona & First Impression"
          icon={AscendantIcon} glowColor={glow}
          summary={`Your environmental lens is shaped by ${ascSign}.`}
          details={`Rising Sign ${ascSign} determines your physical presence, initial approach to strangers, and the 1st House filter through which you meet the world.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={goBack}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 2: Planetary Placements
    <div key="w2" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 2 of 9 · Planetary Domains</div>
      <div className="text-2xl font-light text-white tracking-widest">Psychological Domains</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Mercury (Cognition & Intellect)"
          subtitle="Communication Engine"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary={`Mercury in ${sunSign} channels analytical processing.`}
          details={`Mercury governs thought patterns, speech, data processing, and decision-making logic. In ${sunSign}, your mind works through ${sunData.domain.toLowerCase()}`}
        />
        <InteractiveBubble
          title="Venus (Love & Aesthetics)"
          subtitle="Relational Value System"
          icon={PlanetIcon} glowColor={glow}
          summary={`Venus in ${moonSign} dictates relational attraction.`}
          details={`Venus rules how you bond, express affection, evaluate beauty, and manage financial value. You seek harmony through ${moonData.domain.toLowerCase()}`}
        />
        <InteractiveBubble
          title="Mars (Drive & Ambition)"
          subtitle="Executive Willpower"
          icon={PlanetIcon} glowColor={glow}
          summary={`Mars governs active initiative and drive.`}
          details={`Mars is your engine of desire, anger management, physical stamina, and competitive instinct. It pushes you to conquer challenges.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(0)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 3: House System
    <div key="w3" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 3 of 9 · Placidus Houses</div>
      <div className="text-2xl font-light text-white tracking-widest">Life Area Focus</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="1st House (Self & Temperament)"
          subtitle="Ascendant Domain"
          icon={HouseIcon} glowColor={glow} defaultExpanded
          summary={`Anchored by ${ascSign} energy.`}
          details={`The 1st House rules body chemistry, self-image, and primary life direction. ${ascData.houseFocus} forms your foundational anchor.`}
        />
        <InteractiveBubble
          title="10th House (Midheaven - Career & Public Legacy)"
          subtitle="Master Achievement"
          icon={HouseIcon} glowColor={glow}
          summary="Governs public reputation and vocational mastery."
          details="The Midheaven (MC) dictates your highest career zenith, authority in society, and the lasting legacy you build over decades."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(1)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 4: Aspects
    <div key="w4" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 4 of 9 · Planetary Geometry</div>
      <div className="text-2xl font-light text-white tracking-widest">Aspect Dynamics</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Trines & Sextiles (Harmonious Flow)"
          subtitle="Natural Talents"
          icon={ModalityIcon} glowColor={glow} defaultExpanded
          summary="120° and 60° geometric alignments create effortless talent."
          details="Trines link planets of the same element, generating innate gifts, creative synchronicity, and smooth energetic cooperation."
        />
        <InteractiveBubble
          title="Squares & Oppositions (Frictional Momentum)"
          subtitle="Catalysts for Growth"
          icon={ModalityIcon} glowColor={glow}
          summary="90° and 180° geometry generates internal drive and tension."
          details="Squares demand resolution through effort, transforming psychological friction into breakthrough ambition and character resilience."
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(2)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(4)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 5: Element Dominance
    <div key="s5" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 5 of 9 · Elemental Expression</div>
      <div className="text-2xl font-light text-white tracking-widest">{primaryElement} Element Dominance</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`${primaryElement} Core Expression`}
          subtitle="Elemental Fuel"
          icon={ElementIcon} glowColor={glow} defaultExpanded
          summary={`Your primary motivation is fueled by ${primaryElement.toLowerCase()} energy.`}
          details={`In Western Tropical astrology, ${primaryElement} dominance means your psychological system thrives on ${sunData.domain.toLowerCase()}`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(3)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(5)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 6: Modality
    <div key="w6" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 6 of 9 · Dynamic Modality</div>
      <div className="text-2xl font-light text-white tracking-widest">{sunData.modality} Quality</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`${sunData.modality} Momentum`}
          subtitle="Action Pattern"
          icon={ModalityIcon} glowColor={glow} defaultExpanded
          summary={`Operates with ${sunData.modality.toLowerCase()} operational rhythm.`}
          details={`${sunData.modality} modality defines how you handle projects: Cardinal initiates new seasons, Fixed preserves foundations, and Mutable adapts effortlessly.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(4)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(6)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 7: Element/Modality Tally
    <div key="w7" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 7 of 9 · Chart Balance</div>
      <div className="text-2xl font-light text-white tracking-widest">Chart Composition</div>
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-blue-200/10 max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-left">
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/40 uppercase">Sun Element</div>
            <div className="text-white font-bold">{sunData.element}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/40 uppercase">Moon Element</div>
            <div className="text-white font-bold">{moonData.element}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/40 uppercase">Rising Element</div>
            <div className="text-white font-bold">{ascData.element}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/40 uppercase">Sun Modality</div>
            <div className="text-white font-bold">{sunData.modality}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(5)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(7)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 8: Cosmic Gemstone
    <div key="w8" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 8 of 9 · Western Gemstone</div>
      <div className="text-2xl font-light text-white tracking-widest">{sunData.stone}</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Harmonizing Stone · ${sunData.stone}`}
          subtitle="Elemental Balance"
          icon={GemIcon} glowColor={glow} defaultExpanded
          summary={`Assigned stone to balance ${sunSign} solar energy.`}
          details={`In Western tradition, wearing or holding ${sunData.stone} aligns your energy field with ${sunData.ruling}, enhancing executive focus and vital stamina.`}
        />
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <CinematicGhostButton onClick={() => setRevealSlide(6)}>← BACK</CinematicGhostButton>
        <CinematicButton onClick={() => setRevealSlide(8)}>Next →</CinematicButton>
      </div>
    </div>,

    // Slide 9: Synthesis & Export
    <div key="w9" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 9 of 9 · Final Western Synthesis</div>
      <div className="text-2xl font-light text-white tracking-widest">Complete Psychological Dossier</div>

      {/* Printable Card */}
      <div className="flex justify-center" ref={chartRef}>
        <div style={{ background: 'linear-gradient(160deg, #050816 0%, #080c26 60%, #030511 100%)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '420px', color: 'white', textAlign: 'center', border: '1px solid rgba(160,200,255,0.1)' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Astrologica · Western Tropical</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.12em', color: 'white', marginBottom: '1rem' }}>{userName || 'Cosmic Traveller'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid rgba(160,200,255,0.1)', borderBottom: '1px solid rgba(160,200,255,0.1)', padding: '1rem 0', marginBottom: '1rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Sun Sign</span><span>{sunSign}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Moon Sign</span><span>{moonSign}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Ascendant</span><span>{ascSign}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Ruler</span><span>{sunData.ruling}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Gemstone</span><span>{sunData.stone}</span></div>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            "You embody the {sunData.element.toLowerCase()} drive of {sunSign} with {sunData.modality.toLowerCase()} momentum, guided by {sunData.ruling}."
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <CinematicButton onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download Chart'}
        </CinematicButton>
        <CinematicGhostButton onClick={() => advanceStep(2, `${userName} returned to Main Menu`)}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>,
  ]

  // ═════════════════════════════════════════════════════════════════════════════
  // VEDIC PIPELINE (9 SLIDES WITH MANDATORY ENGLISH MEANINGS IN BRACKETS)
  // ═════════════════════════════════════════════════════════════════════════════
  const VEDIC_SLIDES = [
    // Slide 1: The Core
    <div key="v1" className="space-y-6 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">Slide 1 of 9 · Vedic Core Formula</div>
      <div className="text-2xl font-light text-white tracking-widest">Jyotish Core Triad</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Lagna Lord (Ascendant Ruler)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title={`Lagna Lord (Ascendant Ruler) · ${ascData.ruling}`}
          subtitle="Executive Temperament"
          icon={PlanetIcon} glowColor={glow} defaultExpanded
          summary={`Lagna Lord (Ascendant Ruler) ${ascData.ruling} guides your life force.`}
          details={`The placement of your Lagna Lord (Ascendant Ruler) ${ascData.ruling} determines where your life force is invested. In ${ascSign}, it grants ${ascData.domain.toLowerCase()}`}
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
      <div className="text-2xl font-light text-white tracking-widest">Planetary Bhavas (Houses)</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Sthana Bala (Positional Strength)</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Shadbala (Six-fold Strength) & Yogas</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Pancha Mahabhutas (Elements)</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Prakriti (Ayurvedic Dosha)</div>
      <div className="space-y-4 max-w-md mx-auto">
        <InteractiveBubble
          title="Dominant Ayurvedic Constitution"
          subtitle="Mind-Body Balance"
          icon={AyurvedaIcon} glowColor={glow} defaultExpanded
          summary={`Your chart reveals strong ${primaryElement === 'Fire' ? 'Pitta (Fiery/Intense)' : primaryElement === 'Earth' || primaryElement === 'Water' ? 'Kapha (Grounded/Nurturing)' : 'Vata (Airy/Restless)'} alignment.`}
          details={`Prakriti (Ayurvedic Constitution) reflects your innate mind-body blueprint: Pitta (Fiery/Intense) drives digestion & focus, Kapha (Grounded/Nurturing) builds immunity & composure, Vata (Airy/Restless) drives mental creativity & mobility.`}
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
      <div className="text-2xl font-light text-white tracking-widest">Dasha & Ratna (Gemstone)</div>
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
      <div className="text-2xl font-light text-white tracking-widest">Complete Jyotish Dossier</div>

      {/* Printable Card */}
      <div className="flex justify-center" ref={chartRef}>
        <div style={{ background: 'linear-gradient(160deg, #050816 0%, #080c26 60%, #030511 100%)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '420px', color: 'white', textAlign: 'center', border: '1px solid rgba(160,200,255,0.1)' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Astrologica · {sysLabel}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.12em', color: 'white', marginBottom: '1rem' }}>{userName || 'Cosmic Traveller'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid rgba(160,200,255,0.1)', borderBottom: '1px solid rgba(160,200,255,0.1)', padding: '1rem 0', marginBottom: '1rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justify: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Lagna (Ascendant)</span><span>{ascSign}</span></div>
            <div style={{ display: 'flex', justify: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Rashi (Moon Sign)</span><span>{moonSign}</span></div>
            <div style={{ display: 'flex', justify: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Janma Nakshatra</span><span>{nakshatra} ({pada})</span></div>
            <div style={{ display: 'flex', justify: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Lagna Lord</span><span>{ascData.ruling}</span></div>
            <div style={{ display: 'flex', justify: 'space-between' }}><span style={{ color: 'rgba(160,200,255,0.4)' }}>Ratna (Gemstone)</span><span>{sunData.vedicGem}</span></div>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            "Your soul path is guided by {nakshatra} Nakshatra ({pada}) with Lagna Lord {ascData.ruling} protecting your Dharma."
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <CinematicButton onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download Chart'}
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
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
