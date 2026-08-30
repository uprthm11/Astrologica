import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// Astrological Zodiac Symbols
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

export default function BlueprintForm() {
  // Initial state variables as requested
  const [date, setDate] = useState('2003/06/11')
  const [time, setTime] = useState('12:00')
  const [lat, setLat] = useState(22.7196)
  const [lon, setLon] = useState(75.8577)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      date: date.trim(),
      time: time.trim(),
      utc_offset: '+05:30', // Hardcoded as requested
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/calculate-blueprint',
        payload
      )
      setResult(response.data)
    } catch (err) {
      console.error('Calculation Error:', err)
      const errorMsg =
        err.response?.data?.detail ||
        'Failed to connect to backend server. Make sure the FastAPI server is running on port 8000.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!result ? (
          /* --- Input Form Card --- */
          <motion.div
            key="form-card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative p-8 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl backdrop-blur-xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-950/60 border border-purple-500/30 rounded-full mb-3">
                ✧ Astrological Blueprint
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Calculate Your Signs
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter your birth details to generate your celestial blueprint
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs sm:text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5 uppercase tracking-wide">
                    Birth Date (YYYY/MM/DD)
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="2003/06/11"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5 uppercase tracking-wide">
                    Birth Time (24h HH:MM)
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="12:00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Latitude Input */}
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5 uppercase tracking-wide">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="22.7196"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Longitude Input */}
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5 uppercase tracking-wide">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="75.8577"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>
              </div>

              {/* Timezone Note */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Timezone Offset</span>
                <span className="font-mono text-purple-400">+05:30 (IST)</span>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-900/30 border border-purple-400/30 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Calculating Celestial Blueprint...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Blueprint</span>
                    <span>✨</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* --- Animated Result Card --- */
          <motion.div
            key="result-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}
            className="relative p-8 rounded-3xl bg-slate-900/95 border border-purple-500/30 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Cosmic Ambient Lights */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase bg-amber-950/60 border border-amber-500/30 rounded-full mb-3"
              >
                ☀️ Celestial Blueprint Generated
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Your Astrological Signature
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Calculated via Swiss Ephemeris for {result.meta?.date} at {result.meta?.time}
              </p>
            </div>

            {/* Sun & Moon Display Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Sun Sign Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950/60 to-slate-900 border border-amber-500/30 shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Sun Sign
                  </span>
                  <span className="text-2xl">
                    {ZODIAC_SYMBOLS[result.sun?.sign] || '☀️'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-200">
                  {result.sun?.sign}
                </div>
                <div className="mt-2 text-xs font-mono text-amber-300/80 flex items-center justify-between">
                  <span>Sign Degree:</span>
                  <span className="font-bold text-amber-100">{result.sun?.degrees}°</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Ecliptic Longitude:</span>
                  <span>{result.sun?.total_degrees}°</span>
                </div>
              </motion.div>

              {/* Moon Sign Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-slate-900 border border-indigo-500/30 shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Moon Sign
                  </span>
                  <span className="text-2xl">
                    {ZODIAC_SYMBOLS[result.moon?.sign] || '🌙'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-200">
                  {result.moon?.sign}
                </div>
                <div className="mt-2 text-xs font-mono text-indigo-300/80 flex items-center justify-between">
                  <span>Sign Degree:</span>
                  <span className="font-bold text-indigo-100">{result.moon?.degrees}°</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Ecliptic Longitude:</span>
                  <span>{result.moon?.total_degrees}°</span>
                </div>
              </motion.div>
            </div>

            {/* Coordinates Summary */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 mb-6">
              <span>📍 Coordinates: {result.meta?.lat}°N, {result.meta?.lon}°E</span>
              <span>⏰ Offset: {result.meta?.utc_offset}</span>
            </div>

            {/* Back / Recalculate Button */}
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-xl font-medium text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>← Calculate Another Blueprint</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
