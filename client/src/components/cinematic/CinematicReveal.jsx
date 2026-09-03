import React, { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton } from './CinematicPrimitives'

// ─── Sun Sign Knowledge Base ─────────────────────────────────────────────────
const SIGN_DB = {
  Aries:       { glyph: '♈', sanskrit: 'Mesha',      element: 'Fire',  ruling: 'Mars',    stone: 'Diamond',    color: '#ef4444' },
  Taurus:      { glyph: '♉', sanskrit: 'Vrishabha',  element: 'Earth', ruling: 'Venus',   stone: 'Emerald',    color: '#10b981' },
  Gemini:      { glyph: '♊', sanskrit: 'Mithuna',    element: 'Air',   ruling: 'Mercury', stone: 'Pearl',      color: '#06b6d4' },
  Cancer:      { glyph: '♋', sanskrit: 'Karka',      element: 'Water', ruling: 'Moon',    stone: 'Ruby',       color: '#818cf8' },
  Leo:         { glyph: '♌', sanskrit: 'Simha',      element: 'Fire',  ruling: 'Sun',     stone: 'Peridot',    color: '#f59e0b' },
  Virgo:       { glyph: '♍', sanskrit: 'Kanya',      element: 'Earth', ruling: 'Mercury', stone: 'Sapphire',   color: '#84cc16' },
  Libra:       { glyph: '♎', sanskrit: 'Tula',       element: 'Air',   ruling: 'Venus',   stone: 'Opal',       color: '#a78bfa' },
  Scorpio:     { glyph: '♏', sanskrit: 'Vrishchika', element: 'Water', ruling: 'Mars',    stone: 'Topaz',      color: '#7c3aed' },
  Sagittarius: { glyph: '♐', sanskrit: 'Dhanu',      element: 'Fire',  ruling: 'Jupiter', stone: 'Turquoise',  color: '#f97316' },
  Capricorn:   { glyph: '♑', sanskrit: 'Makara',     element: 'Earth', ruling: 'Saturn',  stone: 'Garnet',     color: '#6b7280' },
  Aquarius:    { glyph: '♒', sanskrit: 'Kumbha',     element: 'Air',   ruling: 'Saturn',  stone: 'Amethyst',   color: '#38bdf8' },
  Pisces:      { glyph: '♓', sanskrit: 'Meena',      element: 'Water', ruling: 'Jupiter', stone: 'Aquamarine', color: '#6366f1' },
}

// ─── Slide transition ─────────────────────────────────────────────────────────
const SLIDE_ENTER = {
  initial:   { opacity: 0, y: 20 },
  animate:   { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } },
  exit:      { opacity: 0, y: -20, transition: { duration: 0.8 } },
}

// ─── Large sign display (glyph + name + subtitle) ────────────────────────────
function SignDisplay({ sign, label, system }) {
  const info = SIGN_DB[sign] || {}
  return (
    <div className="text-center space-y-3">
      <div
        className="text-[11px] font-mono uppercase tracking-[0.35em]"
        style={{ color: 'rgba(160,200,255,0.4)' }}
      >
        {system} · {label}
      </div>
      <div
        className="text-8xl sm:text-9xl leading-none select-none"
        style={{
          textShadow: `0 0 60px ${info.color || '#ffffff'}55, 0 0 100px ${info.color || '#ffffff'}22`,
          filter: `drop-shadow(0 0 20px ${info.color || '#ffffff'}44)`,
        }}
      >
        {info.glyph || '✦'}
      </div>
      <div className="text-4xl sm:text-5xl font-thin tracking-[0.15em] text-white"
        style={{ textShadow: `0 0 30px ${info.color || '#ffffff'}55` }}>
        {sign}
      </div>
      {info.sanskrit && (
        <div className="text-sm font-mono tracking-widest" style={{ color: 'rgba(160,200,255,0.35)' }}>
          {info.sanskrit}
        </div>
      )}
    </div>
  )
}

// ─── Pair display (two signs side by side) ────────────────────────────────────
function SignPair({ leftSign, leftLabel, leftSystem, rightSign, rightLabel, rightSystem }) {
  return (
    <div className="flex items-start justify-center gap-16 sm:gap-24">
      <SignDisplay sign={leftSign}  label={leftLabel}  system={leftSystem} />
      <div className="w-px self-stretch" style={{ background: 'rgba(160,200,255,0.1)' }} />
      <SignDisplay sign={rightSign} label={rightLabel} system={rightSystem} />
    </div>
  )
}

// ─── Large attribute reveal ───────────────────────────────────────────────────
function AttributeReveal({ label, value, subtitle, glyph, color }) {
  return (
    <div className="text-center space-y-4">
      <div className="text-[11px] font-mono uppercase tracking-[0.35em]"
        style={{ color: 'rgba(160,200,255,0.4)' }}>
        {label}
      </div>
      {glyph && (
        <div className="text-6xl" style={{ textShadow: `0 0 40px ${color || '#ffffff'}66` }}>
          {glyph}
        </div>
      )}
      <div className="text-5xl sm:text-6xl font-thin tracking-[0.12em] text-white"
        style={{ textShadow: `0 0 40px ${color || 'rgba(160,200,255,0.5)'}` }}>
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-blue-100/40 font-light tracking-widest">{subtitle}</div>
      )}
    </div>
  )
}

// ─── Final chart card for html2canvas capture ─────────────────────────────────
function ChartCard({ data, sunInfo, userName }) {
  const w = data?.western || {}
  const v = data?.vedic   || {}
  const planets = w?.planets || []
  const wSun    = planets.find(p => p.id === 'sun')
  const wMoon   = planets.find(p => p.id === 'moon')

  return (
    <div
      style={{
        background:    'linear-gradient(160deg, #050816 0%, #0b0e29 60%, #050816 100%)',
        padding:       '2rem',
        borderRadius:  '1.5rem',
        minWidth:      '320px',
        maxWidth:      '480px',
        fontFamily:    'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(160,200,255,0.1)', paddingBottom: '1rem' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(160,200,255,0.35)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Astrologica · Cosmic Blueprint
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 300, letterSpacing: '0.1em', color: 'white' }}>
          {userName || 'Cosmic Traveller'}
        </div>
      </div>

      {/* Signs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Western Sun',   value: wSun?.sign || '—',                  sys: 'Tropical' },
          { label: 'Western Moon',  value: wMoon?.sign || '—',                  sys: 'Tropical' },
          { label: 'Vedic Sun',     value: v?.surya_rashi?.rashi || '—',        sys: 'Sidereal' },
          { label: 'Vedic Moon',    value: v?.chandra_rashi?.rashi || '—',       sys: 'Sidereal' },
        ].map(row => {
          const info = SIGN_DB[row.value] || {}
          return (
            <div key={row.label} style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '9px', color: 'rgba(160,200,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>{row.sys} · {row.label}</div>
              <div style={{ fontSize: '1.6rem', margin: '0.25rem 0' }}>{info.glyph || '·'}</div>
              <div style={{ fontSize: '1rem', color: 'white', fontWeight: 300, letterSpacing: '0.08em' }}>{row.value}</div>
            </div>
          )
        })}
      </div>

      {/* Attributes */}
      <div style={{ borderTop: '1px solid rgba(160,200,255,0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { k: 'Element',       v: sunInfo?.element },
          { k: 'Ruling Planet', v: sunInfo?.ruling  },
          { k: 'Birthstone',    v: sunInfo?.stone    },
          { k: 'Nakshatra',     v: v?.surya_rashi?.nakshatra?.name },
        ].filter(r => r.v).map(row => (
          <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(160,200,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{row.k}</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{row.v}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '9px', color: 'rgba(160,200,255,0.18)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Swiss Ephemeris v2.10 · Pratham Upadhyay
      </div>
    </div>
  )
}

// ─── Data extractors ──────────────────────────────────────────────────────────
function getWesternSign(data, planet) {
  const planets = data?.western?.planets || []
  return planets.find(p => p.id === planet)?.sign || '—'
}
function getVedicSign(data, key) {
  return data?.vedic?.[key]?.rashi || '—'
}

// ─── Main CinematicReveal ─────────────────────────────────────────────────────
export default function CinematicReveal() {
  const { astrologyData, userName, revealSlide, setRevealSlide, advanceStep } = useAppStore()
  const chartRef    = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const wMoon    = getWesternSign(astrologyData, 'moon')
  const vMoon    = getVedicSign(astrologyData, 'chandra_rashi')
  const wSun     = getWesternSign(astrologyData, 'sun')
  const vSun     = getVedicSign(astrologyData, 'surya_rashi')
  const sunInfo  = SIGN_DB[wSun] || SIGN_DB[vSun] || {}
  const ruling   = sunInfo.ruling  || '—'
  const stone    = sunInfo.stone   || '—'
  const element  = sunInfo.element || '—'

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#050816', scale: 2, useCORS: true, logging: false,
      })
      const link = document.createElement('a')
      link.download = `astrologica-${(userName || 'chart').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      // After download → reset to Crossroads with camera zoom-back
      setTimeout(() => advanceStep(2, `${userName} downloaded chart and returned`), 800)
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }, [userName, advanceStep])

  const SLIDES = [
    // ── Slide 0: Western & Vedic Moon Signs ─────────────────────────────────
    <div key="s0" className="text-center space-y-16">
      <motion.div {...SLIDE_ENTER}
        className="text-[11px] font-mono uppercase tracking-[0.4em]"
        style={{ color: 'rgba(160,200,255,0.4)' }}
      >
        Your Moon Signs
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.3s' }}>
        <SignPair
          leftSign={wMoon}  leftLabel="Moon Sign"    leftSystem="Western"
          rightSign={vMoon} rightLabel="Chandra Rashi" rightSystem="Vedic"
        />
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.6s' }}>
        <CinematicButton onClick={() => setRevealSlide(1)} delay={0}>Next</CinematicButton>
      </motion.div>
    </div>,

    // ── Slide 1: Vedic Sun & Moon Rashis ────────────────────────────────────
    <div key="s1" className="text-center space-y-16">
      <motion.div {...SLIDE_ENTER}
        className="text-[11px] font-mono uppercase tracking-[0.4em]"
        style={{ color: 'rgba(160,200,255,0.4)' }}
      >
        Your Vedic Blueprint
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.3s' }}>
        <SignPair
          leftSign={vSun}  leftLabel="Surya Rashi"  leftSystem="Vedic"
          rightSign={vMoon} rightLabel="Chandra Rashi" rightSystem="Vedic"
        />
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.6s' }}>
        <CinematicButton onClick={() => setRevealSlide(2)} delay={0}>Next</CinematicButton>
      </motion.div>
    </div>,

    // ── Slide 2: Ruling Planet ───────────────────────────────────────────────
    <div key="s2" className="text-center space-y-16">
      <motion.div {...SLIDE_ENTER}>
        <AttributeReveal
          label="Your Ruling Planet"
          value={ruling}
          subtitle="The celestial body that governs your western sun sign"
          glyph="⭑"
          color={sunInfo.color}
        />
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.5s' }}>
        <CinematicButton onClick={() => setRevealSlide(3)} delay={0}>Next</CinematicButton>
      </motion.div>
    </div>,

    // ── Slide 3: Birthstone ──────────────────────────────────────────────────
    <div key="s3" className="text-center space-y-16">
      <motion.div {...SLIDE_ENTER}>
        <AttributeReveal
          label="Your Cosmic Stone"
          value={stone}
          subtitle={`Element · ${element}`}
          glyph="◈"
          color={sunInfo.color}
        />
      </motion.div>
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.5s' }}>
        <CinematicButton onClick={() => setRevealSlide(4)} delay={0}>Next</CinematicButton>
      </motion.div>
    </div>,

    // ── Slide 4: Full Chart + Download ───────────────────────────────────────
    <div key="s4" className="text-center space-y-10">
      <motion.div {...SLIDE_ENTER}
        className="text-[11px] font-mono uppercase tracking-[0.4em]"
        style={{ color: 'rgba(160,200,255,0.4)' }}
      >
        Your Cosmic Blueprint
      </motion.div>

      {/* Chart card (captured by html2canvas) */}
      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.2s' }}
        className="flex justify-center" ref={chartRef}
      >
        <ChartCard data={astrologyData} sunInfo={sunInfo} userName={userName} />
      </motion.div>

      <motion.div {...SLIDE_ENTER} style={{ transitionDelay: '0.6s' }}>
        <CinematicButton
          onClick={handleDownload}
          disabled={downloading}
          delay={0}
        >
          {downloading ? 'Rendering…' : 'Download Chart'}
        </CinematicButton>
      </motion.div>
    </div>,
  ]

  const currentSlide = SLIDES[Math.min(revealSlide, SLIDES.length - 1)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={`reveal-${revealSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9 } }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="w-full max-w-2xl"
        >
          {currentSlide}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
