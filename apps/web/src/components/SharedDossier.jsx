import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlueprint } from '../services/api'

const ZODIAC_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
}

export default function SharedDossier() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'cognitive' | 'astronomy'

  useEffect(() => {
    const fetchBlueprint = async () => {
      setLoading(true)
      setError(null)
      try {
        const responseData = await getBlueprint(id)
        setData(responseData)
      } catch (err) {
        console.error('Fetch Error:', err)
        setError(
          err.response?.status === 404
            ? `Cosmic Dossier #${id} not found.`
            : 'Failed to retrieve dossier from server.'
        )
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchBlueprint()
    }
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-12 dashboard-card space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#3858f6]/15 border border-[#3858f6]/30 flex items-center justify-center animate-spin text-2xl text-[#00d2ff]">
          ✦
        </div>
        <h3 className="text-xl font-bold text-white">Decrypting Cosmic Dossier...</h3>
        <p className="text-xs text-[#7b82b8] font-mono">Fetching profile ID: #{id}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-lg mx-auto text-center p-10 dashboard-card space-y-6">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-xl font-bold text-white">Dossier Unavailable</h3>
        <p className="text-sm text-[#9aa0cf]">{error || 'Could not load profile.'}</p>
        <Link
          to="/"
          className="btn-primary"
        >
          ← Return to Console
        </Link>
      </div>
    )
  }

  const { astrology, mbti, synthesis, created_at } = data
  const isDual = Boolean(astrology?.western && astrology?.vedic)

  // Extract core astronomical points for card header
  let sunSign = 'Cosmic'
  let moonSign = 'Cosmic'
  let siderealSunRashi = ''
  let siderealMoonRashi = ''
  let sunDegrees = 0
  let moonDegrees = 0
  let meta = astrology?.meta || {}

  if (isDual) {
    const sunW = astrology.western.planets?.find((p) => p.id === 'sun')
    const moonW = astrology.western.planets?.find((p) => p.id === 'moon')
    const sunV = astrology.vedic.planets?.find((p) => p.id === 'sun')
    const moonV = astrology.vedic.planets?.find((p) => p.id === 'moon')

    sunSign = sunW?.sign || 'Cosmic'
    moonSign = moonW?.sign || 'Cosmic'
    sunDegrees = sunW?.degrees || 0
    moonDegrees = moonW?.degrees || 0

    siderealSunRashi = sunV?.rashi ? `${sunV.sanskrit_rashi || sunV.rashi} (${sunV.rashi})` : ''
    siderealMoonRashi = moonV?.rashi ? `${moonV.sanskrit_rashi || moonV.rashi} (${moonV.rashi})` : ''
  } else {
    sunSign = astrology?.sun?.sign || 'Cosmic'
    moonSign = astrology?.moon?.sign || 'Cosmic'
    sunDegrees = astrology?.sun?.degrees || 0
    moonDegrees = astrology?.moon?.degrees || 0
  }

  const breakdown = mbti?.breakdown || {}

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      {/* --- Executive Cosmic Holographic Profile Card --- */}
      <div className="dashboard-card p-6 sm:p-10 text-left space-y-8">
        {/* Top Dossier Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a63] pb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00d2ff] uppercase">
              COSMIC DOSSIER &bull; #{id}
            </span>
          </div>
          {created_at && (
            <span className="text-[11px] font-mono text-[#7b82b8]">
              {new Date(created_at).toLocaleDateString()}{' '}
              {new Date(created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>

        {/* Archetype Title & Hero Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#101336] border border-[#3858f6]/40 text-[#00d2ff] mb-3 shadow-inner">
            ✦ Full-Spectrum Personality Synthesis
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            The {sunSign} {mbti.archetype ? mbti.archetype.replace('The ', '') : 'Architect'}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-lg bg-[#3858f6]/20 border border-[#3858f6]/40 text-[#00d2ff] font-mono font-bold text-sm tracking-wider">
              {mbti.mbti_type || 'MBTI'}
            </span>
            <span className="text-[#6b729f]">&bull;</span>
            <span className="text-sm font-semibold text-amber-300">
              {sunSign} Sun
            </span>
            <span className="text-[#6b729f]">&bull;</span>
            <span className="text-sm font-semibold text-[#00d2ff]">
              {moonSign} Moon
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#c5c9f5] italic mt-4 max-w-lg mx-auto leading-relaxed">
            "{mbti.description}"
          </p>
        </div>

        {/* Deep Synthesis Narrative Banner */}
        {synthesis?.narrative && (
          <div className="p-5 rounded-2xl bg-[#101336] border border-[#3858f6]/30 text-xs text-[#c5c9f5] leading-relaxed shadow-inner">
            <div className="text-[10px] uppercase font-bold text-[#00d2ff] tracking-wider mb-1 font-mono">
              ✦ Cosmic & Cognitive Synthesis
            </div>
            <p>{synthesis.narrative}</p>
          </div>
        )}

        {/* Dual Astrological Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sun Card */}
          <div className="p-5 rounded-2xl bg-[#101336] border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ☀️ Sun Sign Placement
              </span>
              <span className="text-2xl">{ZODIAC_SYMBOLS[sunSign] || '☀️'}</span>
            </div>
            <div className="text-2xl font-black text-amber-100">{sunSign}</div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono text-amber-200/80">
              <span>Tropical:</span>
              <span className="font-bold">{sunDegrees}° {sunSign}</span>
            </div>
            {siderealSunRashi && (
              <div className="mt-1 flex items-center justify-between text-xs font-mono text-[#00d2ff]">
                <span>Sidereal (Surya):</span>
                <span>{siderealSunRashi}</span>
              </div>
            )}
          </div>

          {/* Moon Card */}
          <div className="p-5 rounded-2xl bg-[#101336] border border-[#3858f6]/40 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00d2ff]">
                🌙 Moon Sign Placement
              </span>
              <span className="text-2xl">{ZODIAC_SYMBOLS[moonSign] || '🌙'}</span>
            </div>
            <div className="text-2xl font-black text-white">{moonSign}</div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono text-[#9aa0cf]">
              <span>Tropical:</span>
              <span className="font-bold">{moonDegrees}° {moonSign}</span>
            </div>
            {siderealMoonRashi && (
              <div className="mt-1 flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>Sidereal (Chandra):</span>
                <span>{siderealMoonRashi}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs for Deep Views */}
        <div className="flex items-center gap-2 border-b border-[#262a63] pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#3858f6] text-white shadow-md'
                : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            Overview & Axes
          </button>
          {mbti.cognitive_stack && (
            <button
              onClick={() => setActiveTab('cognitive')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'cognitive'
                  ? 'bg-[#3858f6] text-white shadow-md'
                  : 'text-[#7b82b8] hover:text-white'
              }`}
            >
              🧠 Jungian Cognitive Stack
            </button>
          )}
          {isDual && (
            <button
              onClick={() => setActiveTab('astronomy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'astronomy'
                  ? 'bg-gradient-to-r from-[#3858f6] to-[#00d2ff] text-white shadow-md'
                  : 'text-[#7b82b8] hover:text-white'
              }`}
            >
              ✦ Ephemeris & Visual Charts
            </button>
          )}
        </div>

        {/* --- Tab 1: Overview & PCI Bars --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {breakdown && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
                  <div className="text-[10px] text-[#7b82b8] font-mono font-bold uppercase">Energy</div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5">
                    {breakdown.energy?.letter} &bull; {breakdown.energy?.trait?.replace(/ \(.*\)/, '')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
                  <div className="text-[10px] text-[#7b82b8] font-mono font-bold uppercase">Mind</div>
                  <div className="text-xs font-bold text-[#00d2ff] mt-0.5">
                    {breakdown.mind?.letter} &bull; {breakdown.mind?.trait?.replace(/ \(.*\)/, '')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
                  <div className="text-[10px] text-[#7b82b8] font-mono font-bold uppercase">Nature</div>
                  <div className="text-xs font-bold text-rose-300 mt-0.5">
                    {breakdown.nature?.letter} &bull; {breakdown.nature?.trait?.replace(/ \(.*\)/, '')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
                  <div className="text-[10px] text-[#7b82b8] font-mono font-bold uppercase">Tactics</div>
                  <div className="text-xs font-bold text-[#3858f6] mt-0.5">
                    {breakdown.tactics?.letter} &bull; {breakdown.tactics?.trait?.replace(/ \(.*\)/, '')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Tab 2: Jungian Cognitive Functions --- */}
        {activeTab === 'cognitive' && mbti.cognitive_stack && (
          <div className="space-y-4 p-4 rounded-xl bg-[#101336] border border-[#262a63] text-sm text-blue-200">
            <div>Cognitive Stack: {JSON.stringify(mbti.cognitive_stack)}</div>
          </div>
        )}

        {/* --- Tab 3: Full Astrological Ephemeris & Charts --- */}
        {activeTab === 'astronomy' && isDual && (
          <div className="space-y-4 pt-2 p-4 rounded-xl bg-[#101336] border border-[#262a63] text-sm text-blue-200">
            <div>Planetary Positions: {JSON.stringify(astrology?.planets || {})}</div>
          </div>
        )}

        {/* Coordinates & Metadata Footer Bar */}
        {meta?.date && (
          <div className="p-3.5 rounded-xl bg-[#101336] border border-[#262a63] text-xs text-[#7b82b8] flex flex-wrap items-center justify-between gap-2">
            <span>🗓️ Birth: {meta.date} at {meta.time}</span>
            <span>📍 {meta.lat}°N, {meta.lon}°E ({meta.utc_offset})</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#262a63]">
          <button
            onClick={handleCopyLink}
            className="btn-primary flex-1"
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Copy Link to Share Dossier</span>
              </>
            )}
          </button>

          <Link
            to="/"
            className="btn-secondary"
          >
            <span>↺ New Blueprint</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
