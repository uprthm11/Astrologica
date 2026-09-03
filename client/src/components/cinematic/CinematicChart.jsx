import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton, fadeUp } from './CinematicPrimitives'

// ─── Sun Sign Knowledge Base ────────────────────────────────────────────────
const SUN_SIGN_DB = {
  Aries:       { glyph: '♈', sanskrit: 'Mesha',     element: 'Fire',  ruling: 'Mars',    birthstone: 'Diamond',   snippet: 'A pioneer soul — fearless, direct, and born to lead.' },
  Taurus:      { glyph: '♉', sanskrit: 'Vrishabha', element: 'Earth', ruling: 'Venus',   birthstone: 'Emerald',   snippet: 'Rooted in beauty — patient, sensual, and immovably loyal.' },
  Gemini:      { glyph: '♊', sanskrit: 'Mithuna',   element: 'Air',   ruling: 'Mercury', birthstone: 'Pearl',     snippet: 'A quicksilver mind — curious, adaptive, and eloquently dual.' },
  Cancer:      { glyph: '♋', sanskrit: 'Karka',     element: 'Water', ruling: 'Moon',    birthstone: 'Ruby',      snippet: 'The nurturer — deeply empathic, intuitive, and fiercely protective.' },
  Leo:         { glyph: '♌', sanskrit: 'Simha',     element: 'Fire',  ruling: 'Sun',     birthstone: 'Peridot',   snippet: 'Radiant authority — generous, theatrical, and magnetically regal.' },
  Virgo:       { glyph: '♍', sanskrit: 'Kanya',     element: 'Earth', ruling: 'Mercury', birthstone: 'Sapphire',  snippet: 'Precision in motion — analytical, devoted, and elegantly humble.' },
  Libra:       { glyph: '♎', sanskrit: 'Tula',      element: 'Air',   ruling: 'Venus',   birthstone: 'Opal',      snippet: 'The cosmic diplomat — graceful, just, and endlessly balancing.' },
  Scorpio:     { glyph: '♏', sanskrit: 'Vrishchika',element: 'Water', ruling: 'Mars',    birthstone: 'Topaz',     snippet: 'Depth incarnate — magnetic, transformative, and intensely perceptive.' },
  Sagittarius: { glyph: '♐', sanskrit: 'Dhanu',     element: 'Fire',  ruling: 'Jupiter', birthstone: 'Turquoise', snippet: 'The wandering philosopher — expansive, honest, and luminously free.' },
  Capricorn:   { glyph: '♑', sanskrit: 'Makara',    element: 'Earth', ruling: 'Saturn',  birthstone: 'Garnet',    snippet: 'The sovereign builder — disciplined, ambitious, and enduringly resilient.' },
  Aquarius:    { glyph: '♒', sanskrit: 'Kumbha',    element: 'Air',   ruling: 'Saturn',  birthstone: 'Amethyst',  snippet: 'The visionary rebel — original, humanitarian, and electrically inventive.' },
  Pisces:      { glyph: '♓', sanskrit: 'Meena',     element: 'Water', ruling: 'Jupiter', birthstone: 'Aquamarine',snippet: 'The mystic dreamer — empathic, fluid, and cosmically connected.' },
}

const ELEMENT_COLORS = {
  Fire:  { from: '#ef4444', to: '#f97316', glow: 'rgba(239,68,68,0.35)' },
  Earth: { from: '#10b981', to: '#84cc16', glow: 'rgba(16,185,129,0.35)' },
  Air:   { from: '#06b6d4', to: '#818cf8', glow: 'rgba(6,182,212,0.35)' },
  Water: { from: '#6366f1', to: '#a855f7', glow: 'rgba(99,102,241,0.35)' },
}

// ─── Data extraction helpers ─────────────────────────────────────────────────
function extractWestern(data) {
  const w = data?.western || data
  const planets = w?.planets || []
  const sun = planets.find(p => p.id === 'sun')
  const moon = planets.find(p => p.id === 'moon')
  return {
    sunSign:  sun?.sign  || '—',
    moonSign: moon?.sign || '—',
    asc:      w?.ascendant?.sign || '—',
  }
}

function extractVedic(data) {
  const v = data?.vedic || {}
  return {
    suryaRashi: v?.surya_rashi?.rashi || '—',
    chandraRashi: v?.chandra_rashi?.rashi || '—',
    lagna: v?.lagna?.rashi || '—',
    nakshatra: v?.surya_rashi?.nakshatra?.name || '—',
  }
}

// ─── Individual Infographic Sections ─────────────────────────────────────────
function SignBadge({ sign, label, index, system }) {
  const info = SUN_SIGN_DB[sign] || {}
  const el = ELEMENT_COLORS[info.element] || ELEMENT_COLORS.Air
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="relative p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md space-y-1 text-center overflow-hidden"
      style={{ boxShadow: `0 0 30px ${el.glow}` }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: `radial-gradient(circle at 50% 0%, ${el.from}, transparent 70%)` }}
      />
      <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">{system}</div>
      <div className="text-3xl" style={{ textShadow: `0 0 20px ${el.from}` }}>{info.glyph || '✦'}</div>
      <div className="text-base font-bold text-white">{sign}</div>
      <div className="text-[10px] font-mono text-white/40">{info.sanskrit || ''}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider mt-1"
        style={{ color: el.from }}>{label}</div>
    </motion.div>
  )
}

function AttributeRow({ label, value, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5"
    >
      <span className="font-mono uppercase tracking-wider text-white/40">{label}</span>
      <span className="font-semibold text-white/85">{value}</span>
    </motion.div>
  )
}

// ─── Main CinematicChart Component ───────────────────────────────────────────
export default function CinematicChart() {
  const { astrologyData, mbtiData, userName, setCinematicStep } = useAppStore()
  const chartRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const w = extractWestern(astrologyData)
  const v = extractVedic(astrologyData)
  const sunInfo = SUN_SIGN_DB[w.sunSign] || {}
  const el = ELEMENT_COLORS[sunInfo.element] || ELEMENT_COLORS.Air
  const precessionDeg = astrologyData?.comparison?.precession_shift_degrees
  const mbtiType = mbtiData?.mbti_type || null

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#050816',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `astrologica-chart-${(userName || 'cosmic').toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Chart export error:', e)
    } finally {
      setDownloading(false)
    }
  }, [userName])

  if (!astrologyData) return null

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-4">
      {/* ── Infographic card (captured by html2canvas) ── */}
      <div
        ref={chartRef}
        style={{ background: 'linear-gradient(160deg, #050816 0%, #0b0e29 50%, #050816 100%)' }}
        className="rounded-3xl border border-white/10 overflow-hidden p-6 space-y-5 shadow-2xl"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center space-y-1 pb-4 border-b border-white/10"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
            Astrologica · Cosmic Blueprint
          </div>
          <div
            className="text-2xl font-black tracking-widest text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(90deg, ${el.from}, ${el.to})` }}
          >
            {userName || 'Cosmic Traveller'}
          </div>
          {sunInfo.snippet && (
            <div className="text-xs text-white/50 italic max-w-xs mx-auto leading-relaxed">
              "{sunInfo.snippet}"
            </div>
          )}
        </motion.div>

        {/* Sign Grid — Western */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2"
          >
            Western Tropical System
          </motion.div>
          <div className="grid grid-cols-3 gap-2">
            <SignBadge sign={w.sunSign}  label="Sun Sign"    index={0} system="TROPICAL" />
            <SignBadge sign={w.moonSign} label="Moon Sign"   index={1} system="TROPICAL" />
            <SignBadge sign={w.asc}      label="Ascendant"   index={2} system="TROPICAL" />
          </div>
        </div>

        {/* Sign Grid — Vedic */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2"
          >
            Vedic Sidereal System (Jyotish)
          </motion.div>
          <div className="grid grid-cols-3 gap-2">
            <SignBadge sign={v.suryaRashi}   label="Surya Rashi"   index={3} system="SIDEREAL" />
            <SignBadge sign={v.chandraRashi}  label="Chandra Rashi" index={4} system="SIDEREAL" />
            <SignBadge sign={v.lagna}         label="Lagna"         index={5} system="SIDEREAL" />
          </div>
        </div>

        {/* Attribute Panel */}
        <GlassPanel className="p-4 space-y-0.5">
          <AttributeRow label="Element"         value={sunInfo.element || '—'}      delay={6} />
          <AttributeRow label="Ruling Planet"   value={sunInfo.ruling || '—'}       delay={7} />
          <AttributeRow label="Birthstone"      value={sunInfo.birthstone || '—'}   delay={8} />
          <AttributeRow label="Nakshatra"        value={v.nakshatra}                 delay={9} />
          {precessionDeg != null && (
            <AttributeRow label="Precession Δ°" value={`${Number(precessionDeg).toFixed(2)}°`} delay={10} />
          )}
          {mbtiType && (
            <AttributeRow label="Cognitive Type" value={mbtiType}                   delay={11} />
          )}
        </GlassPanel>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          custom={12}
          initial="hidden"
          animate="visible"
          className="text-center text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 pt-1"
        >
          Generated by Astrologica · Swiss Ephemeris v2.10 · Pratham Upadhyay
        </motion.div>
      </div>

      {/* Action Buttons (outside html2canvas capture area) */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <CinematicGhostButton
          onClick={() => setCinematicStep(2)}
          delay={0}
          className="text-sm"
        >
          ← Return
        </CinematicGhostButton>

        <CinematicButton
          onClick={handleDownload}
          disabled={downloading}
          delay={1}
          className="text-sm"
        >
          {downloading ? 'Generating PNG...' : '↓ Download Chart'}
        </CinematicButton>
      </div>
    </div>
  )
}
