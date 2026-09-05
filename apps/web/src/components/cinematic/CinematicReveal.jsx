import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'
import { ZODIAC_SVG_COMPONENTS } from '../../utils/bigThreeData'

// ─── Defensive String Helper ──────────────────────────────────────────────────
const safeLower = (val) => String(val || '').toLowerCase()

// ─── Element & Glow Resolvers ─────────────────────────────────────────────────
const ELEMENT_COLORS = {
  Fire:  '#f97316',
  Earth: '#10b981',
  Air:   '#06b6d4',
  Water: '#3858f6',
}

function getIconGlowClass(hint = '') {
  const clean = safeLower(hint)
  if (clean.includes('fire') || clean.includes('aries') || clean.includes('leo') || clean.includes('sagittarius') || clean.includes('mars') || clean.includes('sun')) {
    return 'drop-shadow-[0_0_24px_rgba(249,115,22,0.85)] text-orange-400'
  }
  if (clean.includes('earth') || clean.includes('taurus') || clean.includes('virgo') || clean.includes('capricorn') || clean.includes('saturn')) {
    return 'drop-shadow-[0_0_24px_rgba(16,185,129,0.85)] text-emerald-400'
  }
  if (clean.includes('air') || clean.includes('gemini') || clean.includes('libra') || clean.includes('aquarius') || clean.includes('mercury') || clean.includes('uranus')) {
    return 'drop-shadow-[0_0_24px_rgba(6,182,212,0.85)] text-cyan-400'
  }
  if (clean.includes('water') || clean.includes('cancer') || clean.includes('scorpio') || clean.includes('pisces') || clean.includes('moon') || clean.includes('neptune')) {
    return 'drop-shadow-[0_0_24px_rgba(56,88,246,0.85)] text-blue-400'
  }
  return 'drop-shadow-[0_0_24px_rgba(6,182,212,0.85)] text-cyan-300'
}

// ─── Dynamic SVG Icon Helper ──────────────────────────────────────────────────
export function renderIcon(icon_hint = '', className = 'w-16 h-16 md:w-20 md:h-20') {
  const clean = safeLower(icon_hint).trim()
  const capitalizedSign = clean.charAt(0).toUpperCase() + clean.slice(1)

  // 1. Existing Figma-style Zodiac SVGs
  if (ZODIAC_SVG_COMPONENTS[capitalizedSign]) {
    const ZodiacIcon = ZODIAC_SVG_COMPONENTS[capitalizedSign]
    return <ZodiacIcon className={className} />
  }

  // 2. Specialized Planetary & Aspectual SVGs
  if (clean.includes('sun')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="50" cy="50" r="22" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <path d="M50 14 V20 M50 80 V86 M14 50 H20 M80 50 H86 M25 25 L30 30 M70 70 L75 75 M25 75 L30 70 M70 30 L75 25" strokeLinecap="round" />
      </svg>
    )
  }
  if (clean.includes('moon')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M60 20 C40 25 30 45 35 65 C40 85 60 88 72 80 C48 78 44 42 60 20 Z" />
      </svg>
    )
  }
  if (clean.includes('mercury')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M38 22 C38 32 62 32 62 22" />
        <circle cx="50" cy="46" r="16" />
        <line x1="50" y1="62" x2="50" y2="86" />
        <line x1="38" y1="74" x2="62" y2="74" />
      </svg>
    )
  }
  if (clean.includes('venus')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="38" r="20" />
        <line x1="50" y1="58" x2="50" y2="86" />
        <line x1="36" y1="72" x2="64" y2="72" />
      </svg>
    )
  }
  if (clean.includes('mars')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="44" cy="56" r="20" />
        <line x1="58" y1="42" x2="80" y2="20" />
        <polyline points="65 20 80 20 80 35" />
      </svg>
    )
  }
  if (clean.includes('jupiter')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M30 35 C30 25 45 25 50 35 V75 M50 60 H75 M68 50 V75" />
      </svg>
    )
  }
  if (clean.includes('saturn')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M45 18 V78 M45 42 C65 32 75 52 62 68 M32 32 H58" />
        <ellipse cx="50" cy="50" rx="34" ry="12" strokeDasharray="3 3" />
      </svg>
    )
  }
  if (clean.includes('uranus')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="50" cy="62" r="16" />
        <line x1="50" y1="46" x2="50" y2="18" />
        <line x1="30" y1="32" x2="70" y2="32" />
        <line x1="30" y1="18" x2="30" y2="46" />
        <line x1="70" y1="18" x2="70" y2="46" />
      </svg>
    )
  }
  if (clean.includes('neptune')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M30 24 V44 C30 56 70 56 70 44 V24" />
        <line x1="50" y1="20" x2="50" y2="82" />
        <line x1="38" y1="70" x2="62" y2="70" />
      </svg>
    )
  }
  if (clean.includes('pluto')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="50" cy="30" r="12" />
        <path d="M32 46 C32 62 68 62 68 46" />
        <line x1="50" y1="62" x2="50" y2="86" />
        <line x1="38" y1="74" x2="62" y2="74" />
      </svg>
    )
  }
  if (clean.includes('square')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="25" y="25" width="50" height="50" rx="4" />
      </svg>
    )
  }
  if (clean.includes('trine')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="50,20 80,75 20,75" />
      </svg>
    )
  }
  if (clean.includes('stellium') || clean.includes('conjunction')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="38" cy="50" r="18" />
        <circle cx="62" cy="50" r="18" />
      </svg>
    )
  }

  // 3. Generic glowing celestial star fallback
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="50" cy="50" r="14" />
      <path d="M50 16 V30 M50 70 V84 M16 50 H30 M70 50 H84" />
    </svg>
  )
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.35 } },
}

export default function CinematicReveal() {
  const { astrologyData, birthData, userName, revealSlide, setRevealSlide } = useAppStore()
  const [downloading, setDownloading] = useState(false)
  const exportRef = useRef(null)

  // Extract raw planetary positions for poster export
  const planets = astrologyData?.western?.planets || []
  const sunSign = planets.find(p => p?.id === 'sun')?.sign || 'Aries'
  const moonSign = planets.find(p => p?.id === 'moon')?.sign || 'Taurus'
  const ascSign = astrologyData?.western?.ascendant?.sign || 'Gemini'

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
      link.download = `astrologica-storyboard-${safeLower(userName || 'blueprint').replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }, [userName])

  // ═════════════════════════════════════════════════════════════════════════════
  // PHASE 3 & 4: DYNAMIC CINEMATIC PRESENTER (MAPPING OVER CHART DATA STORYBOARD)
  // ═════════════════════════════════════════════════════════════════════════════
  const rawStoryboard = astrologyData?.storyboard || []
  const rawDisclaimer = astrologyData?.disclaimer || "Astrological interpretations offer symbolic perspectives on psychological themes and cycles and are intended solely for self-reflection and personal inquiry."
  const disclaimerText = rawDisclaimer.replace(/elf-reflection/g, 'self-reflection')

  // If no chapters returned yet, provide an instantaneous default single chapter
  const chapters = rawStoryboard.length > 0 ? rawStoryboard : [
    {
      chapter_title: "The Big Three",
      sections: [
        {
          heading: `Sun in ${sunSign}`,
          body: `Your core drive in ${sunSign} organizes identity around practical output rather than abstract theory.`,
          icon_hint: sunSign.toLowerCase(),
        },
        {
          heading: `Moon in ${moonSign}`,
          body: `Your emotional reset button in ${moonSign} requires sensory downtime and predictable calm before moving forward.`,
          icon_hint: moonSign.toLowerCase(),
        },
        {
          heading: `Ascendant in ${ascSign}`,
          body: `People clock your ${ascSign} rising presence and conversational pace before learning anything else.`,
          icon_hint: ascSign.toLowerCase(),
        }
      ]
    }
  ]

  const totalChapters = chapters.length
  const currentChapterIndex = Math.min(revealSlide, Math.max(0, totalChapters - 1))
  const currentChapter = chapters[currentChapterIndex]

  const primaryHint = currentChapter?.sections?.[0]?.icon_hint || sunSign
  const glowClass = getIconGlowClass(primaryHint)
  const isLastSlide = currentChapterIndex === totalChapters - 1

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
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(160, 200, 255, 0.15)', paddingBottom: '2rem' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>
            ASTROLOGICA CELESTIAL BLUEPRINT
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 200, letterSpacing: '0.35em', color: '#ffffff', textShadow: '0 0 24px rgba(0, 210, 255, 0.6)' }}>
            ASTROLOGICA
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.25em', color: 'rgba(200, 220, 255, 0.85)', marginTop: '0.6rem' }}>
            AI Cosmic Storyboard
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.12)', borderRadius: '1rem', padding: '1.6rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(160, 200, 255, 0.4)' }}>Traveller Identity</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 300, letterSpacing: '0.1em', color: '#ffffff', marginTop: '0.2rem' }}>{userName || 'Cosmic Traveller'}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: 'rgba(200, 220, 255, 0.8)', lineHeight: 1.7 }}>
            <div>Date: <strong style={{ color: '#fff' }}>{birthData?.date || '—'}</strong></div>
            <div>Time: <strong style={{ color: '#fff' }}>{birthData?.time || '—'}</strong></div>
            <div>Location: <strong style={{ color: '#fff' }}>{birthData?.locationName || 'Global Coordinates'}</strong></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Sun (Solar Will)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{sunSign}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Moon (Subconscious)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{moonSign}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(160, 200, 255, 0.15)', borderRadius: '1rem', padding: '1.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.5)', marginBottom: '0.6rem' }}>Ascendant (Mask)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.08em' }}>{ascSign}</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(160, 200, 255, 0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(160, 200, 255, 0.4)' }}>
          <div>Swiss Ephemeris v2.10 · AI Cosmic Reader</div>
          <div>Designed by Pratham Upadhyay</div>
        </div>
      </div>

      {/* ── Dynamic Borderless Floating Presentation (NO BOXES) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`storyboard-slide-${currentChapterIndex}`}
          {...SLIDE_TRANSITION}
          className="w-full max-w-xl flex flex-col items-center text-center"
        >
          {/* Chapter Meta Tracker */}
          <div className="text-xs tracking-[0.4em] text-blue-300/60 uppercase mb-2">
            Chapter {currentChapterIndex + 1} of {totalChapters}
          </div>

          {/* Phase 3 Typography: Chapter Title */}
          <h2 className="text-xl tracking-[0.2em] text-cyan-400 uppercase mb-4">
            {currentChapter.chapter_title}
          </h2>

          {/* Glowing Dynamic SVG Anchor */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${glowClass} transition-transform hover:scale-105 duration-300`}>
              {renderIcon(primaryHint)}
            </div>
          </div>

          {/* Phase 4: Invisible Scrolling (Strictly No Boxes, No Borders) */}
          <div className="overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[60vh] pb-12 gap-3 flex flex-col w-full px-4">
            {currentChapter.sections?.map((sec, sIdx) => (
              <div key={sIdx} className="text-center max-w-lg mx-auto w-full">
                {/* Phase 3 Typography: Heading */}
                <h3 className="text-md text-blue-200 font-semibold mb-1 break-words">
                  {sec.heading}
                </h3>
                {/* Phase 3 Typography: Body */}
                <p className="text-blue-50/80 font-light leading-relaxed mb-6 text-sm md:text-base break-words">
                  {sec.body}
                </p>
              </div>
            ))}

            {isLastSlide && (
              <div className="pt-2 text-xs text-blue-200/40 italic max-w-md mx-auto break-words leading-relaxed">
                {disclaimerText}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <CinematicGhostButton onClick={() => currentChapterIndex === 0 ? goBack() : setRevealSlide(currentChapterIndex - 1)}>
              ← BACK
            </CinematicGhostButton>

            {!isLastSlide ? (
              <CinematicButton onClick={() => setRevealSlide(currentChapterIndex + 1)}>
                Next →
              </CinematicButton>
            ) : (
              <CinematicButton onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Generating Poster...' : 'Download Blueprint Poster'}
              </CinematicButton>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
