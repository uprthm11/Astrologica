import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'

// ─── Sign Database with Elements, Rulers, Gems, Traits ───────────────────────
const SIGN_DB = {
  Aries:       { glyph: '♈', sanskrit: 'Mesha',      element: 'Fire',  ruling: 'Mars',    stone: 'Diamond',   vedicStone: 'Red Coral',   trait: 'Pioneering drive, instinctive courage, & direct initiative.' },
  Taurus:      { glyph: '♉', sanskrit: 'Vrishabha',  element: 'Earth', ruling: 'Venus',   stone: 'Emerald',   vedicStone: 'White Sapphire', trait: 'Immovable stability, sensory elegance, & grounded endurance.' },
  Gemini:      { glyph: '♊', sanskrit: 'Mithuna',    element: 'Air',   ruling: 'Mercury', stone: 'Pearl',     vedicStone: 'Emerald',     trait: 'Quicksilver intellect, dual curiosity, & articulate agility.' },
  Cancer:      { glyph: '♋', sanskrit: 'Karka',      element: 'Water', ruling: 'Moon',    stone: 'Ruby',      vedicStone: 'Natural Pearl', trait: 'Deep empathic intuition, protective roots, & lunar sensitivity.' },
  Leo:         { glyph: '♌', sanskrit: 'Simha',      element: 'Fire',  ruling: 'Sun',     stone: 'Peridot',   vedicStone: 'Ruby',        trait: 'Radiant authority, magnetic warmth, & sovereign creative flame.' },
  Virgo:       { glyph: '♍', sanskrit: 'Kanya',      element: 'Earth', ruling: 'Mercury', stone: 'Sapphire',  vedicStone: 'Emerald',     trait: 'Analytical mastery, sacred devotion, & subtle perfectionism.' },
  Libra:       { glyph: '♎', sanskrit: 'Tula',       element: 'Air',   ruling: 'Venus',   stone: 'Opal',      vedicStone: 'Diamond',     trait: 'Cosmic harmony, aesthetic justice, & relational diplomacy.' },
  Scorpio:     { glyph: '♏', sanskrit: 'Vrishchika', element: 'Water', ruling: 'Mars',    stone: 'Topaz',     vedicStone: 'Red Coral',   trait: 'Transformative depth, alchemical perception, & intense magnetism.' },
  Sagittarius: { glyph: '♐', sanskrit: 'Dhanu',      element: 'Fire',  ruling: 'Jupiter', stone: 'Turquoise', vedicStone: 'Yellow Sapphire', trait: 'Expansive philosophy, boundless freedom, & truth-seeking arrows.' },
  Capricorn:   { glyph: '♑', sanskrit: 'Makara',    element: 'Earth', ruling: 'Saturn',  stone: 'Garnet',    vedicStone: 'Blue Sapphire', trait: 'Architectural ambition, timeless discipline, & mountain resilience.' },
  Aquarius:    { glyph: '♒', sanskrit: 'Kumbha',    element: 'Air',   ruling: 'Saturn',  stone: 'Amethyst',  vedicStone: 'Blue Sapphire', trait: 'Visionary innovation, collective ideals, & electric originality.' },
  Pisces:      { glyph: '♓', sanskrit: 'Meena',      element: 'Water', ruling: 'Jupiter', stone: 'Aquamarine',vedicStone: 'Yellow Sapphire', trait: 'Mystic transcendence, fluid compassion, & oceanic imagination.' },
}

const ELEMENT_GLYPHS = {
  Fire: '🔥', Earth: '🏔️', Air: '💨', Water: '🌊'
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.6 } },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWesternSign(data, planetId) {
  const planets = data?.western?.planets || []
  return planets.find(p => p.id === planetId)?.sign || '—'
}
function getWesternAsc(data) {
  return data?.western?.ascendant?.sign || '—'
}
function getVedicSign(data, key) {
  return data?.vedic?.[key]?.rashi || '—'
}
function getVedicNakshatra(data) {
  return data?.vedic?.surya_rashi?.nakshatra?.name || '—'
}

// ─── Single System Big 3 Component ───────────────────────────────────────────
function BigThreeColumn({ title, subtitle, sun, moon, asc, isVedic = false }) {
  const sInfo = SIGN_DB[sun] || {}
  const mInfo = SIGN_DB[moon] || {}
  const aInfo = SIGN_DB[asc] || {}

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-blue-200/40">{subtitle}</div>
        <div className="text-xl font-light text-white tracking-widest">{title}</div>
      </div>

      {/* Grid of 3 */}
      <div className="space-y-5">
        {/* Sun */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">☀️ Sun / Surya</div>
          <div className="text-4xl select-none">{sInfo.glyph || '✦'}</div>
          <div className="text-lg font-light text-white tracking-wider">{sun}</div>
          {isVedic && sInfo.sanskrit && <div className="text-[10px] font-mono text-blue-200/30">{sInfo.sanskrit}</div>}
        </div>

        {/* Moon */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">🌙 Moon / Chandra</div>
          <div className="text-4xl select-none">{mInfo.glyph || '✦'}</div>
          <div className="text-lg font-light text-white tracking-wider">{moon}</div>
          {isVedic && mInfo.sanskrit && <div className="text-[10px] font-mono text-blue-200/30">{mInfo.sanskrit}</div>}
        </div>

        {/* Ascendant */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/50">⬆️ Ascendant / Lagna</div>
          <div className="text-4xl select-none">{aInfo.glyph || '✦'}</div>
          <div className="text-lg font-light text-white tracking-wider">{asc}</div>
          {isVedic && aInfo.sanskrit && <div className="text-[10px] font-mono text-blue-200/30">{aInfo.sanskrit}</div>}
        </div>
      </div>
    </div>
  )
}

// ─── Single System Rulers Component ──────────────────────────────────────────
function RulersColumn({ title, subtitle, sunSign, isVedic = false, nakshatra }) {
  const info = SIGN_DB[sunSign] || {}
  const rulingPlanet = info.ruling || '—'
  const stone = isVedic ? (info.vedicStone || info.stone) : info.stone

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-blue-200/40">{subtitle}</div>
        <div className="text-xl font-light text-white tracking-widest">{title}</div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/40">Ruling Graha / Planet</div>
          <div className="text-3xl select-none">⭑</div>
          <div className="text-2xl font-light text-white tracking-wider">{rulingPlanet}</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/40">Cosmic Gemstone</div>
          <div className="text-3xl select-none">◈</div>
          <div className="text-2xl font-light text-white tracking-wider">{stone}</div>
        </div>

        {isVedic && nakshatra && (
          <div className="space-y-1 pt-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/40">Nakshatra Realm</div>
            <div className="text-base font-light text-blue-100/80 tracking-widest">{nakshatra}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Single System Traits & Element Component ────────────────────────────────
function TraitsColumn({ title, subtitle, sunSign }) {
  const info = SIGN_DB[sunSign] || {}
  const element = info.element || 'Air'
  const glyph = ELEMENT_GLYPHS[element] || '✨'

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-blue-200/40">{subtitle}</div>
        <div className="text-xl font-light text-white tracking-widest">{title}</div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <div className="text-3xl select-none">{glyph}</div>
          <div className="text-xs font-mono uppercase tracking-widest text-blue-200/50">Dominant Element</div>
          <div className="text-xl font-light text-white tracking-wider">{element} Realm</div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto pt-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/40">Core Personality Synthesis</div>
          <p className="text-sm font-light text-white/80 leading-relaxed italic">
            "{info.trait || 'A unique celestial resonance blending cosmic archetypes.'}"
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Exportable Single Chart Printable Card ──────────────────────────────────
function ExportableChartCard({ title, system, sun, moon, asc, ruling, stone, element, userName, nakshatra }) {
  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #050816 0%, #080c26 60%, #030511 100%)',
        padding: '2rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '340px',
        fontFamily: 'system-ui, sans-serif',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(160,200,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
        Astrologica · {system}
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.12em', color: 'white', marginBottom: '1.2rem' }}>
        {userName || 'Cosmic Traveller'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(160,200,255,0.1)', borderBottom: '1px solid rgba(160,200,255,0.1)', padding: '1rem 0', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Sun Sign</span>
          <span style={{ fontWeight: 500 }}>{sun}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Moon Sign</span>
          <span style={{ fontWeight: 500 }}>{moon}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ascendant</span>
          <span style={{ fontWeight: 500 }}>{asc}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ruler</span>
          <span style={{ fontWeight: 500 }}>{ruling}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Gemstone</span>
          <span style={{ fontWeight: 500 }}>{stone}</span>
        </div>
        {nakshatra && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Nakshatra</span>
            <span style={{ fontWeight: 500 }}>{nakshatra}</span>
          </div>
        )}
      </div>

      <div style={{ fontSize: '8px', color: 'rgba(160,200,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Swiss Ephemeris v2.10 · Pratham Upadhyay
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CinematicReveal() {
  const { astrologyData, userName, revealSlide, setRevealSlide, advanceStep } = useAppStore()

  const [downloadingWestern, setDownloadingWestern] = useState(false)
  const [downloadingVedic, setDownloadingVedic]     = useState(false)
  const [downloadingFused, setDownloadingFused]     = useState(false)
  const [isFused, setIsFused]                       = useState(false)

  const westernCardRef = useRef(null)
  const vedicCardRef   = useRef(null)
  const fusedCardRef   = useRef(null)

  // Data extraction
  const wSun  = getWesternSign(astrologyData, 'sun')
  const wMoon = getWesternSign(astrologyData, 'moon')
  const wAsc  = getWesternAsc(astrologyData)

  const vSun  = getVedicSign(astrologyData, 'surya_rashi')
  const vMoon = getVedicSign(astrologyData, 'chandra_rashi')
  const vAsc  = getVedicSign(astrologyData, 'lagna')
  const vNakshatra = getVedicNakshatra(astrologyData)

  const wInfo = SIGN_DB[wSun] || {}
  const vInfo = SIGN_DB[vSun] || {}

  const handleDownloadWestern = useCallback(async () => {
    if (!westernCardRef.current) return
    setDownloadingWestern(true)
    try {
      const canvas = await html2canvas(westernCardRef.current, { backgroundColor: '#050816', scale: 2, useCORS: true, logging: false })
      const link = document.createElement('a')
      link.download = `astrologica-western-${(userName || 'chart').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloadingWestern(false)
    }
  }, [userName])

  const handleDownloadVedic = useCallback(async () => {
    if (!vedicCardRef.current) return
    setDownloadingVedic(true)
    try {
      const canvas = await html2canvas(vedicCardRef.current, { backgroundColor: '#050816', scale: 2, useCORS: true, logging: false })
      const link = document.createElement('a')
      link.download = `astrologica-vedic-${(userName || 'chart').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloadingVedic(false)
    }
  }, [userName])

  const handleDownloadFused = useCallback(async () => {
    if (!fusedCardRef.current) return
    setDownloadingFused(true)
    try {
      const canvas = await html2canvas(fusedCardRef.current, { backgroundColor: '#050816', scale: 2, useCORS: true, logging: false })
      const link = document.createElement('a')
      link.download = `astrologica-fused-verdict-${(userName || 'chart').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloadingFused(false)
    }
  }, [userName])

  // Slide definitions
  const SLIDES = [
    // ── Slide 0: The Big 3 (Western vs. Vedic) ──
    <div key="slide-0" className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <BigThreeColumn title="Western Tropical" subtitle="Conscious Identity" sun={wSun} moon={wMoon} asc={wAsc} />
        <div className="hidden md:block w-px self-stretch bg-blue-200/10 mx-auto" />
        <BigThreeColumn title="Vedic Sidereal" subtitle="Soul & Karmic Path" sun={vSun} moon={vMoon} asc={vAsc} isVedic />
      </div>
      <div className="text-center pt-4">
        <CinematicButton onClick={() => setRevealSlide(1)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 1: The Rulers & Stones ──
    <div key="slide-1" className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <RulersColumn title="Western Rulers" subtitle="Tropical Systems" sunSign={wSun} />
        <div className="hidden md:block w-px self-stretch bg-blue-200/10 mx-auto" />
        <RulersColumn title="Vedic Rulers" subtitle="Sidereal Jyotish" sunSign={vSun} isVedic nakshatra={vNakshatra} />
      </div>
      <div className="text-center pt-4">
        <CinematicButton onClick={() => setRevealSlide(2)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 2: Core Traits & Elements ──
    <div key="slide-2" className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <TraitsColumn title="Western Archetype" subtitle="Ego & Solar Direction" sunSign={wSun} />
        <div className="hidden md:block w-px self-stretch bg-blue-200/10 mx-auto" />
        <TraitsColumn title="Vedic Archetype" subtitle="Lunar Destiny & Nakshatra" sunSign={vSun} />
      </div>
      <div className="text-center pt-4">
        <CinematicButton onClick={() => setRevealSlide(3)}>Next →</CinematicButton>
      </div>
    </div>,

    // ── Slide 3: Separate Downloads & Fusion Trigger ──
    <div key="slide-3" className="space-y-10 text-center">
      <AnimatePresence mode="wait">
        {!isFused ? (
          <motion.div key="split-view" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }} className="space-y-10">
            <div className="text-xs font-mono uppercase tracking-[0.35em] text-blue-200/50">
              Dual System Dossiers
            </div>

            {/* Split printable cards */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div ref={westernCardRef} className="w-full flex justify-center">
                <ExportableChartCard
                  title="Western Dossier" system="Western Tropical"
                  sun={wSun} moon={wMoon} asc={wAsc}
                  ruling={wInfo.ruling} stone={wInfo.stone} element={wInfo.element}
                  userName={userName}
                />
              </div>

              <div ref={vedicCardRef} className="w-full flex justify-center">
                <ExportableChartCard
                  title="Vedic Dossier" system="Vedic Sidereal (Jyotish)"
                  sun={vSun} moon={vMoon} asc={vAsc}
                  ruling={vInfo.ruling} stone={vInfo.vedicStone || vInfo.stone} element={vInfo.element}
                  userName={userName} nakshatra={vNakshatra}
                />
              </div>
            </div>

            {/* Downloads Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              <CinematicButton onClick={handleDownloadWestern} disabled={downloadingWestern}>
                {downloadingWestern ? 'Generating...' : 'Download Western Chart'}
              </CinematicButton>

              <CinematicButton onClick={handleDownloadVedic} disabled={downloadingVedic}>
                {downloadingVedic ? 'Generating...' : 'Download Vedic Chart'}
              </CinematicButton>
            </div>

            {/* PHASE 5: Fusion Button */}
            <div className="pt-8 border-t border-blue-200/10">
              <CinematicButton onClick={() => setIsFused(true)} className="text-base font-normal tracking-[0.4em]">
                ✦ Fuse Blueprints ✦
              </CinematicButton>
              <div className="text-[11px] font-mono text-blue-200/40 mt-2">
                Synthesize Western & Vedic into 100% accurate verdict
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── PHASE 5: COSMIC SYNTHESIS VERDICT ── */
          <motion.div
            key="fused-verdict"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-200/40">
                100% Accurate Celestial Synthesis
              </div>
              <div className="text-3xl font-thin tracking-wider text-white">
                The Cosmic Verdict
              </div>
            </div>

            {/* Fused Printable Card */}
            <div ref={fusedCardRef} className="p-8 rounded-2xl text-left space-y-6" style={{ background: 'linear-gradient(160deg, #050816 0%, #0a0e30 60%, #030511 100%)', border: '1px solid rgba(160,200,255,0.1)' }}>
              <div className="text-center border-b border-blue-200/10 pb-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-blue-200/40">Unified Cosmic Archetype</div>
                <div className="text-2xl font-light text-white tracking-widest mt-1">
                  {userName || 'Cosmic Traveller'} · {wSun} / {vSun} Synthesis
                </div>
              </div>

              <div className="space-y-4 text-sm font-light text-white/85 leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-blue-200/60 mb-1">1. The Dual Paradox Resolved</h4>
                  <p>
                    Western Tropical astrology maps your <strong>conscious ego and psychological orientation</strong> ({wSun} Sun in {wInfo.element}), reflecting how you interact with the modern seasonal calendar. Conversely, Vedic Sidereal Jyotish maps your <strong>subconscious karmic destiny and moon rhythm</strong> ({vSun} Surya / {vMoon} Chandra), rooted in the true astronomical positions of the fixed stars. Both are 100% valid; they measure distinct layers of your existence.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-blue-200/60 mb-1">2. Core Synthesized Blueprint</h4>
                  <p>
                    Your solar identity channels the <strong>{wInfo.element} flame of {wSun}</strong> for outward manifestation, while your inner emotional compass aligns with the <strong>{vInfo.element} wisdom of {vSun}</strong> ({vNakshatra} Nakshatra). This creates a unique dual-engine: your mind seeks {wInfo.trait.toLowerCase()} while your soul path unfolds through {vInfo.trait.toLowerCase()}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-blue-200/60 mb-1">3. The Final Verdict</h4>
                  <p className="italic text-blue-100">
                    "Do not choose between Western and Vedic. Use Western as your conscious strategy in society, and Vedic as your internal spiritual compass for soul evolution. When aligned, your true celestial potential is unlocked."
                  </p>
                </div>
              </div>

              <div className="text-center text-[9px] font-mono uppercase tracking-widest text-blue-200/30 pt-2 border-t border-blue-200/10">
                Swiss Ephemeris v2.10 Ayanamsha Synthesis · Pratham Upadhyay
              </div>
            </div>

            {/* Fusion Actions */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <CinematicButton onClick={handleDownloadFused} disabled={downloadingFused}>
                {downloadingFused ? 'Generating...' : 'Download Fused Verdict'}
              </CinematicButton>

              <CinematicGhostButton onClick={() => advanceStep(2, `${userName} returned to Crossroads from Fusion`)}>
                ← Return to Crossroads
              </CinematicGhostButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
  ]

  const currentSlide = SLIDES[Math.min(revealSlide, SLIDES.length - 1)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`reveal-slide-${revealSlide}-${isFused}`}
          {...SLIDE_TRANSITION}
          className="w-full max-w-4xl"
        >
          {currentSlide}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
