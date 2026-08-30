import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import API_BASE_URL from '../config/api'
import DualAstroView from './DualAstroView'

export default function BlueprintForm({ onComplete, completedData }) {
  // Initial state variables as requested
  const [date, setDate] = useState('2003/06/11')
  const [time, setTime] = useState('12:00')
  const [lat, setLat] = useState(22.7196)
  const [lon, setLon] = useState(75.8577)
  const [ayanamsha, setAyanamsha] = useState('lahiri')
  const [houseSystem, setHouseSystem] = useState('placidus')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(completedData || null)

  useEffect(() => {
    if (completedData) {
      setResult(completedData)
    }
  }, [completedData])

  const calculateChart = async (ay = ayanamsha, hsys = houseSystem) => {
    setLoading(true)
    setError(null)

    const payload = {
      date: date.trim(),
      time: time.trim(),
      utc_offset: '+05:30', // Default UTC offset
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ayanamsha: ay,
      house_system: hsys
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/calculate/dual`,
        payload
      )
      setResult(response.data)
      if (onComplete) {
        onComplete(response.data)
      }
    } catch (err) {
      console.error('Calculation Error:', err)
      const errorMsg =
        err.response?.data?.detail ||
        'Failed to connect to backend server. Make sure the backend API is reachable.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    calculateChart(ayanamsha, houseSystem)
  }

  const handleSettingChange = (key, value) => {
    if (key === 'ayanamsha') {
      setAyanamsha(value)
      calculateChart(value, houseSystem)
    } else if (key === 'house_system') {
      setHouseSystem(value)
      calculateChart(ayanamsha, value)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="w-full mx-auto">
      <AnimatePresence mode="wait">
        {!result ? (
          /* --- Input Form Card --- */
          <motion.div
            key="form-card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl backdrop-blur-xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-950/60 border border-purple-500/30 rounded-full mb-3">
                ✧ Full-Spectrum Astrological Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Calculate Your Blueprint
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Synthesizing Western Tropical Ephemeris and Vedic Sidereal Jyotish
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Birth Date (YYYY/MM/DD)
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="2003/06/11"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Birth Time (24h HH:MM)
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="12:00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Latitude Input */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Latitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="22.7196"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Longitude Input */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Longitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="75.8577"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 text-sm transition outline-none"
                  />
                </div>

                {/* Ayanamsha Selector */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Vedic Ayanamsha
                  </label>
                  <select
                    value={ayanamsha}
                    onChange={(e) => setAyanamsha(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 text-sm transition outline-none cursor-pointer"
                  >
                    <option value="lahiri">Lahiri (Chitrapaksha)</option>
                    <option value="raman">B.V. Raman</option>
                    <option value="kp">Krishnamurti Paddhati (KP)</option>
                  </select>
                </div>

                {/* House System Selector */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 text-left">
                    Western House System
                  </label>
                  <select
                    value={houseSystem}
                    onChange={(e) => setHouseSystem(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 text-sm transition outline-none cursor-pointer"
                  >
                    <option value="placidus">Placidus</option>
                    <option value="whole_sign">Whole Sign</option>
                  </select>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs text-left"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-6 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-900/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
                    <span>Calculating High-Precision Ephemeris...</span>
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    <span>Generate Astrological Blueprint</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* --- Full Dual Astrological Result View --- */
          <motion.div
            key="result-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <DualAstroView
              dualData={result}
              onRecalculate={handleReset}
              onSettingChange={handleSettingChange}
              currentAyanamsha={ayanamsha}
              currentHouseSystem={houseSystem}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
