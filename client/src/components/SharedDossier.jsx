import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_BASE_URL from '../config/api'
import DualAstroView from './DualAstroView'
import ClarityBars from './ClarityBars'
import CognitiveStack from './CognitiveStack'

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
        const response = await axios.get(`${API_BASE_URL}/api/blueprint/${id}`)
        setData(response.data)
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
      <div className="w-full max-w-xl mx-auto text-center p-12 rounded-3xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center animate-spin text-2xl">
          ✦
        </div>
        <h3 className="text-xl font-bold text-white">Decrypting Cosmic Dossier...</h3>
        <p className="text-xs text-slate-400 font-mono">Fetching profile ID: #{id}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-lg mx-auto text-center p-10 rounded-3xl bg-slate-900/90 border border-rose-500/30 backdrop-blur-xl shadow-2xl space-y-6">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-xl font-bold text-white">Dossier Unavailable</h3>
        <p className="text-sm text-slate-400">{error || 'Could not load profile.'}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition"
        >
          ← Return to Calculator
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
      initial={{ opacity: 0, scale: 0.94, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* --- Cosmic Holographic Trading Card --- */}
      <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-b from-purple-500 via-indigo-500/40 to-cyan-500 shadow-[0_0_50px_rgba(168,85,247,0.25)]">
        <div className="relative rounded-[2.35rem] bg-slate-950/95 p-6 sm:p-10 backdrop-blur-2xl overflow-hidden text-left border border-slate-800">
          {/* Ambient Lighting & Nebulae */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-cyan-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Dossier Header */}
          <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-purple-300 uppercase">
                COSMIC PROFILE &bull; #{id}
              </span>
            </div>
            {created_at && (
              <span className="text-[11px] font-mono text-slate-500">
                {new Date(created_at).toLocaleDateString()}{' '}
                {new Date(created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>

          {/* Archetype Title & Hero Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-400/30 text-purple-200 mb-3 shadow-inner">
              ✦ Full-Spectrum Personality Synthesis
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              The {sunSign} {mbti.archetype ? mbti.archetype.replace('The ', '') : 'Architect'}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-sm tracking-wider">
                {mbti.mbti_type || 'MBTI'}
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-sm font-semibold text-amber-300">
                {sunSign} Sun
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-sm font-semibold text-indigo-300">
                {moonSign} Moon
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 italic mt-4 max-w-lg mx-auto leading-relaxed">
              "{mbti.description}"
            </p>
          </div>

          {/* Deep Synthesis Narrative Banner */}
          {synthesis?.narrative && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 mb-6 text-xs text-slate-300 leading-relaxed shadow-inner">
              <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider mb-1">
                ✦ Cosmic & Cognitive Synthesis
              </div>
              <p>{synthesis.narrative}</p>
            </div>
          )}

          {/* Dual Astrological Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Sun Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 border border-amber-500/30 shadow-lg">
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
                <div className="mt-1 flex items-center justify-between text-xs font-mono text-purple-300">
                  <span>Sidereal (Surya):</span>
                  <span>{siderealSunRashi}</span>
                </div>
              )}
            </div>

            {/* Moon Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-950 border border-indigo-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  🌙 Moon Sign Placement
                </span>
                <span className="text-2xl">{ZODIAC_SYMBOLS[moonSign] || '🌙'}</span>
              </div>
              <div className="text-2xl font-black text-indigo-100">{moonSign}</div>
              <div className="mt-2 flex items-center justify-between text-xs font-mono text-indigo-200/80">
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
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview & Axes
            </button>
            {mbti.cognitive_stack && (
              <button
                onClick={() => setActiveTab('cognitive')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'cognitive'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
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
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✦ Ephemeris & Visual Charts
              </button>
            )}
          </div>

          {/* --- Tab 1: Overview & PCI Bars --- */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {mbti.preference_clarity ? (
                <ClarityBars preferenceClarity={mbti.preference_clarity} />
              ) : (
                breakdown && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Energy</div>
                      <div className="text-xs font-bold text-amber-300 mt-0.5">
                        {breakdown.energy?.letter} &bull; {breakdown.energy?.trait?.replace(/ \(.*\)/, '')}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Mind</div>
                      <div className="text-xs font-bold text-cyan-300 mt-0.5">
                        {breakdown.mind?.letter} &bull; {breakdown.mind?.trait?.replace(/ \(.*\)/, '')}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Nature</div>
                      <div className="text-xs font-bold text-rose-300 mt-0.5">
                        {breakdown.nature?.letter} &bull; {breakdown.nature?.trait?.replace(/ \(.*\)/, '')}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Tactics</div>
                      <div className="text-xs font-bold text-purple-300 mt-0.5">
                        {breakdown.tactics?.letter} &bull; {breakdown.tactics?.trait?.replace(/ \(.*\)/, '')}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* --- Tab 2: Jungian Cognitive Functions --- */}
          {activeTab === 'cognitive' && mbti.cognitive_stack && (
            <div className="space-y-4">
              <CognitiveStack cognitiveStack={mbti.cognitive_stack} />
            </div>
          )}

          {/* --- Tab 3: Full Astrological Ephemeris & Charts --- */}
          {activeTab === 'astronomy' && isDual && (
            <div className="space-y-4 pt-2">
              <DualAstroView dualData={astrology} />
            </div>
          )}

          {/* Coordinates & Metadata Footer Bar */}
          {meta?.date && (
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 my-6">
              <span>🗓️ Birth: {meta.date} at {meta.time}</span>
              <span>📍 {meta.lat}°N, {meta.lon}°E ({meta.utc_offset})</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            <motion.button
              onClick={handleCopyLink}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-900/30 border border-purple-400/30 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Copy Link to Share</span>
                </>
              )}
            </motion.button>

            <Link
              to="/"
              className="py-3.5 px-6 rounded-2xl font-semibold text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>↺ New Blueprint</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
