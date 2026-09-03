import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'

// ─── SVG Icons (Zero Emojis) ──────────────────────────────────────────────────
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

// ─── Sign Database ────────────────────────────────────────────────────────────
const SIGN_DATA = {
  Aries:       { element: 'Fire',  modality: 'Cardinal', ruling: 'Mars',    stone: 'Diamond',    domain: 'Initiation, courage, and pioneering momentum.', houseFocus: '1st House of Self & Physical Expression' },
  Taurus:      { element: 'Earth', modality: 'Fixed',    ruling: 'Venus',   stone: 'Emerald',    domain: 'Resource preservation, sensory elegance, and material security.', houseFocus: '2nd House of Values & Possessions' },
  Gemini:      { element: 'Air',   modality: 'Mutable',  ruling: 'Mercury', stone: 'Pearl',      domain: 'Intellectual synthesis, dual perception, and eloquent communication.', houseFocus: '3rd House of Cognition & Local Connections' },
  Cancer:      { element: 'Water', modality: 'Cardinal', ruling: 'Moon',    stone: 'Ruby',       domain: 'Emotional rooting, intuitive protection, and ancestral memory.', houseFocus: '4th House of Home, Roots & Inner Sanctuary' },
  Leo:         { element: 'Fire',  modality: 'Fixed',    ruling: 'Sun',     stone: 'Peridot',    domain: 'Sovereign authority, creative radiance, and warm heart-centered expression.', houseFocus: '5th House of Sovereignty & Creative Creation' },
  Virgo:       { element: 'Earth', modality: 'Mutable',  ruling: 'Mercury', stone: 'Sapphire',   domain: 'Precision analysis, sacred service, and bodily harmony.', houseFocus: '6th House of Devotion, Mastery & Wellness' },
  Libra:       { element: 'Air',   modality: 'Cardinal', ruling: 'Venus',   stone: 'Opal',       domain: 'Relational equilibrium, aesthetic justice, and diplomatic synthesis.', houseFocus: '7th House of Sacred Union & Counterparts' },
  Scorpio:     { element: 'Water', modality: 'Fixed',    ruling: 'Mars',    stone: 'Topaz',      domain: 'Alchemical transformation, psychological depth, and hidden power.', houseFocus: '8th House of Transformation & Shared Mysteries' },
  Sagittarius: { element: 'Fire',  modality: 'Mutable',  ruling: 'Jupiter', stone: 'Turquoise', domain: 'Philosophical expansion, truth-seeking exploration, and higher wisdom.', houseFocus: '9th House of Higher Learning & Worldly Horizons' },
  Capricorn:   { element: 'Earth', modality: 'Cardinal', ruling: 'Saturn',  stone: 'Garnet',     domain: 'Architectural mastery, disciplined ambition, and long-term legacy.', houseFocus: '10th House of Public Destiny & Master Legacy' },
  Aquarius:    { element: 'Air',   modality: 'Fixed',    ruling: 'Saturn',  stone: 'Amethyst',   domain: 'Visionary reform, collective consciousness, and electric innovation.', houseFocus: '11th House of Higher Networks & Universal Ideals' },
  Pisces:      { element: 'Water', modality: 'Mutable',  ruling: 'Jupiter', stone: 'Aquamarine', domain: 'Transcendent compassion, oceanic imagination, and spiritual dissolution.', houseFocus: '12th House of Cosmic Unity & Transcendent Subconscious' },
}

const ELEMENT_GLOWS = {
  Fire:  'drop-shadow(0 0 24px rgba(249, 115, 22, 0.75))',
  Earth: 'drop-shadow(0 0 24px rgba(16, 185, 129, 0.75))',
  Air:   'drop-shadow(0 0 24px rgba(6, 182, 212, 0.75))',
  Water: 'drop-shadow(0 0 24px rgba(99, 102, 241, 0.75))',
}

const ELEMENT_COLORS = {
  Fire:  'text-orange-400',
  Earth: 'text-emerald-400',
  Air:   'text-cyan-400',
  Water: 'text-indigo-400',
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.6 } },
}

export default function CinematicReveal() {
  const { astrologyData, userName, preferredSystem, revealSlide, setRevealSlide, advanceStep } = useAppStore()
  const [downloading, setDownloading] = useState(false)
  const chartRef = useRef(null)

  const isVedic = preferredSystem === 'vedic'
  const sysName = isVedic ? 'Vedic Sidereal (Jyotish)' : 'Western Tropical'

  // Extract signs based on preferredSystem
  let sunSign = 'Aries'
  let moonSign = 'Aries'
  let ascSign = 'Aries'

  if (isVedic) {
    sunSign  = astrologyData?.vedic?.surya_rashi?.rashi || 'Aries'
    moonSign = astrologyData?.vedic?.chandra_rashi?.rashi || 'Taurus'
    ascSign  = astrologyData?.vedic?.lagna?.rashi || 'Gemini'
  } else {
    const planets = astrologyData?.western?.planets || []
    sunSign  = planets.find(p => p.id === 'sun')?.sign || 'Aries'
    moonSign = planets.find(p => p.id === 'moon')?.sign || 'Taurus'
    ascSign  = astrologyData?.western?.ascendant?.sign || 'Gemini'
  }

  const sunData = SIGN_DATA[sunSign] || SIGN_DATA.Aries
  const moonData = SIGN_DATA[moonSign] || SIGN_DATA.Taurus
  const ascData = SIGN_DATA[ascSign] || SIGN_DATA.Gemini

  const primaryElement = sunData.element
  const glowStyle = { filter: ELEMENT_GLOWS[primaryElement] || ELEMENT_GLOWS.Air }
  const elemColorClass = ELEMENT_COLORS[primaryElement] || 'text-cyan-400'

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

  // ─── 9 Single-Column Slides ──────────────────────────────────────────────────
  const SLIDES = [
    // ── Slide 1: The Core ──
    <div key="s1" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 1 of 9 · {sysName}
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        The Core Triad
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-2">
        <div className="space-y-2 p-4 rounded-xl bg-white/[0.02]" style={glowStyle}>
          <SunIcon className="w-7 h-7 mx-auto text-white" />
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">Sun</div>
          <div className="text-lg font-light text-white">{sunSign}</div>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-white/[0.02]" style={glowStyle}>
          <MoonIcon className="w-7 h-7 mx-auto text-white" />
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">Moon</div>
          <div className="text-lg font-light text-white">{moonSign}</div>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-white/[0.02]" style={glowStyle}>
          <AscendantIcon className="w-7 h-7 mx-auto text-white" />
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">Rising</div>
          <div className="text-lg font-light text-white">{ascSign}</div>
        </div>
      </div>

      <div className="space-y-3 pt-4 text-sm font-light text-white/80 max-w-md mx-auto">
        <div className="flex justify-between border-b border-blue-200/10 pb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-200/40">Ruling Planet</span>
          <span className="text-white font-medium">{sunData.ruling}</span>
        </div>
        <div className="flex justify-between border-b border-blue-200/10 pb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-200/40">Cosmic Gemstone</span>
          <span className="text-white font-medium">{sunData.stone}</span>
        </div>
        <div className="flex justify-between border-b border-blue-200/10 pb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-200/40">Primary Element</span>
          <span className={`font-semibold ${elemColorClass}`}>{primaryElement}</span>
        </div>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 2: Planetary Traits & Domain ──
    <div key="s2" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 2 of 9 · Planetary Domain
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        {sunData.ruling} Governance
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]" style={glowStyle}>
        <PlanetIcon className="w-10 h-10 mx-auto text-white" />
        <div className="text-xs font-mono uppercase tracking-widest text-blue-200/50">
          Lord of {sunSign}
        </div>
        <p className="text-sm font-light text-white/85 leading-relaxed italic">
          "{sunData.domain}"
        </p>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 3: Element Expression ──
    <div key="s3" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 3 of 9 · Elemental Essence
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        {primaryElement} Energy Expression
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]" style={glowStyle}>
        <div className={`text-xs font-mono uppercase tracking-widest ${elemColorClass}`}>
          {primaryElement} Element Alignment
        </div>
        <p className="text-sm font-light text-white/85 leading-relaxed">
          {primaryElement === 'Fire' && "Your elemental core operates through passionate inspiration, direct action, and a spontaneous creative flame that motivates those around you."}
          {primaryElement === 'Earth' && "Your elemental core operates through physical grounding, tangible results, steady endurance, and an unshakeable commitment to reality."}
          {primaryElement === 'Air' && "Your elemental core operates through intellectual synthesis, social connectivity, conceptual clarity, and objective perspective."}
          {primaryElement === 'Water' && "Your elemental core operates through deep emotional intuition, empathetic bonding, subconscious memory, and spiritual fluidity."}
        </p>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 4: Modality ──
    <div key="s4" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 4 of 9 · Dynamic Modality
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        {sunData.modality} Quality
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]" style={glowStyle}>
        <div className="text-xs font-mono uppercase tracking-widest text-blue-200/50">
          Style of Momentum
        </div>
        <p className="text-sm font-light text-white/85 leading-relaxed">
          {sunData.modality === 'Cardinal' && "Cardinal modality equips you as an initiator. You spark new seasons, launch projects naturally, and lead through directional impulse."}
          {sunData.modality === 'Fixed' && "Fixed modality endows you as a stabilizer. You sustain momentum, build impenetrable foundations, and master long-term concentration."}
          {sunData.modality === 'Mutable' && "Mutable modality empowers you as a synthesizer. You adapt to changing tides, bridge opposing forces, and refine systems with ease."}
        </p>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(4)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 5: House - Life Area ──
    <div key="s5" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 5 of 9 · Ascendant House Focus
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        Primary Life Focus
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]" style={glowStyle}>
        <AscendantIcon className="w-8 h-8 mx-auto text-white" />
        <div className="text-xs font-mono uppercase tracking-widest text-blue-200/50">
          Ascendant Lens ({ascSign})
        </div>
        <div className="text-base font-light text-white">{ascData.houseFocus}</div>
        <p className="text-xs text-white/70 leading-relaxed pt-1">
          This House dictates your primary vantage point in this incarnation, channeling how your soul navigates environmental challenges.
        </p>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(5)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 6: Life Aspects (Love, Career, Growth) ──
    <div key="s6" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 6 of 9 · Life Spectrum
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        Triad Breakdown
      </div>

      <div className="space-y-4 max-w-md mx-auto text-left">
        <div className="p-4 rounded-xl bg-white/[0.02] space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-rose-300">Love & Relations</div>
          <p className="text-xs text-white/80 leading-relaxed">
            Your Moon in {moonSign} seeks partners who honor your {moonData.element.toLowerCase()} need for {moonData.domain.toLowerCase()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00d2ff]">Career & Destiny</div>
          <p className="text-xs text-white/80 leading-relaxed">
            Your Sun in {sunSign} thrives in vocations allowing {sunData.domain.toLowerCase()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-300">Soul Growth</div>
          <p className="text-xs text-white/80 leading-relaxed">
            Evolving your Rising {ascSign} energy unlocks freedom from subconscious friction.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(6)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 7: Element & Modality Counting Tally ──
    <div key="s7" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 7 of 9 · Chart Tally
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        Elemental Composition
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]">
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/50 uppercase">Sun Element</div>
            <div className={`text-base font-bold ${elemColorClass}`}>{primaryElement}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/50 uppercase">Moon Element</div>
            <div className="text-base font-bold text-white">{moonData.element}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/50 uppercase">Rising Element</div>
            <div className="text-base font-bold text-white">{ascData.element}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 space-y-1">
            <div className="text-blue-200/50 uppercase">Sun Modality</div>
            <div className="text-base font-bold text-white">{sunData.modality}</div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(7)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 8: Gemstone Assignment & Amplification ──
    <div key="s8" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 8 of 9 · Cosmic Amplification
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        {sunData.stone} Resonance
      </div>

      <div className="space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white/[0.02]" style={glowStyle}>
        <GemIcon className="w-10 h-10 mx-auto text-white" />
        <div className="text-xs font-mono uppercase tracking-widest text-blue-200/50">
          Assigned Stone of {sunSign}
        </div>
        <p className="text-sm font-light text-white/85 leading-relaxed">
          Wearing or meditating with <strong>{sunData.stone}</strong> aligns your physical aura with the governance of {sunData.ruling}, amplifying clarity, physical vitality, and protecting against energetic dissonance.
        </p>
      </div>

      <div className="pt-4">
        <CinematicButton onClick={() => setRevealSlide(8)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 9: Put It All Together (Synthesis & Download) ──
    <div key="s9" className="text-center space-y-8">
      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
        Slide 9 of 9 · Complete Synthesis
      </div>
      <div className="text-3xl font-light text-white tracking-widest">
        The Complete Blueprint
      </div>

      {/* Printable Single-Column Synthesis Card */}
      <div className="flex justify-center" ref={chartRef}>
        <div
          style={{
            background: 'linear-gradient(160deg, #050816 0%, #080c26 60%, #030511 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '420px',
            fontFamily: 'system-ui, sans-serif',
            color: 'white',
            textAlign: 'center',
            border: '1px solid rgba(160,200,255,0.1)',
          }}
        >
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Astrologica · {sysName}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.12em', color: 'white', marginBottom: '1.2rem' }}>
            {userName || 'Cosmic Traveller'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid rgba(160,200,255,0.1)', borderBottom: '1px solid rgba(160,200,255,0.1)', padding: '1rem 0', marginBottom: '1rem', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sun Sign</span>
              <span style={{ fontWeight: 500 }}>{sunSign}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Moon Sign</span>
              <span style={{ fontWeight: 500 }}>{moonSign}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Ascendant</span>
              <span style={{ fontWeight: 500 }}>{ascSign}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Ruler</span>
              <span style={{ fontWeight: 500 }}>{sunData.ruling}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Gemstone</span>
              <span style={{ fontWeight: 500 }}>{sunData.stone}</span>
            </div>
          </div>

          <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', marginBottom: '1rem' }}>
            "You embody the {sunData.element.toLowerCase()} power of {sunSign} with {sunData.modality.toLowerCase()} momentum, guided by {sunData.ruling} to illuminate {sunData.domain.toLowerCase()}"
          </p>

          <div style={{ fontSize: '8px', color: 'rgba(160,200,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Swiss Ephemeris v2.10 · Pratham Upadhyay
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <CinematicButton onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download Chart'}
        </CinematicButton>

        <CinematicGhostButton onClick={() => advanceStep(2, `${userName} returned to Main Menu`)}>
          Return to Main Menu
        </CinematicGhostButton>
      </div>
    </div>,
  ]

  const currentSlide = SLIDES[Math.min(revealSlide, SLIDES.length - 1)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`slide-${revealSlide}`}
          {...SLIDE_TRANSITION}
          className="w-full max-w-xl"
        >
          {currentSlide}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
