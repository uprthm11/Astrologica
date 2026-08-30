import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_BASE_URL from '../config/api'

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

  const { astrology, mbti, created_at } = data
  const sun = astrology?.sun || {}
  const moon = astrology?.moon || {}
  const meta = astrology?.meta || {}
  const breakdown = mbti?.breakdown || {}

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
      className="w-full max-w-2xl mx-auto"
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
                {new Date(created_at).toLocaleDateString()} {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Archetype Title & Hero Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-400/30 text-purple-200 mb-3 shadow-inner">
              ✦ Unified Personality Synthesis
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              The {sun.sign || 'Cosmic'} {mbti.archetype ? mbti.archetype.replace('The ', '') : 'Architect'}
            </h2>

            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-sm tracking-wider">
                {mbti.mbti_type || 'MBTI'}
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-sm font-semibold text-amber-300">
                {sun.sign} Sun
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-sm font-semibold text-indigo-300">
                {moon.sign} Moon
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 italic mt-4 max-w-lg mx-auto leading-relaxed">
              "{mbti.description}"
            </p>
          </div>

          {/* Astrological Core Dual Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Sun Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  ☀️ Sun Sign
                </span>
                <span className="text-2xl">{ZODIAC_SYMBOLS[sun.sign] || '☀️'}</span>
              </div>
              <div className="text-2xl font-black text-amber-100">{sun.sign}</div>
              <div className="mt-2 flex items-center justify-between text-xs font-mono text-amber-200/80">
                <span>Degree:</span>
                <span className="font-bold">{sun.degrees}°</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Ecliptic:</span>
                <span>{sun.total_degrees}°</span>
              </div>
            </div>

            {/* Moon Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-950 border border-indigo-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  🌙 Moon Sign
                </span>
                <span className="text-2xl">{ZODIAC_SYMBOLS[moon.sign] || '🌙'}</span>
              </div>
              <div className="text-2xl font-black text-indigo-100">{moon.sign}</div>
              <div className="mt-2 flex items-center justify-between text-xs font-mono text-indigo-200/80">
                <span>Degree:</span>
                <span className="font-bold">{moon.degrees}°</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Ecliptic:</span>
                <span>{moon.total_degrees}°</span>
              </div>
            </div>
          </div>

          {/* Cognitive Breakdown Matrix */}
          {breakdown && (
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                🧠 Cognitive Axis Alignment
              </div>
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
            </div>
          )}

          {/* Coordinates & Metadata Footer Bar */}
          {meta?.date && (
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 mb-8">
              <span>🗓️ Birth: {meta.date} at {meta.time}</span>
              <span>📍 {meta.lat}°N, {meta.lon}°E ({meta.utc_offset})</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
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
              <span>↺ Create New Blueprint</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
