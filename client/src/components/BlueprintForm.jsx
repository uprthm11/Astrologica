import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateDual } from '../services/api'
import LocationPicker from './LocationPicker'
import DualAstroView from './DualAstroView'

// SVG Icons for clean dashboard panels
const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SettingsIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const GlobeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SparklesIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

export default function BlueprintForm({ onComplete, completedData }) {
  // Birth details state
  const [date, setDate] = useState('2003/06/11')
  const [time, setTime] = useState('12:00')
  const [utcOffset, setUtcOffset] = useState('+05:30')
  const [lat, setLat] = useState(22.7196)
  const [lon, setLon] = useState(75.8577)
  const [locationName, setLocationName] = useState('Indore, Madhya Pradesh, India')

  // Engine configuration state
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

  const handleLocationChange = (loc) => {
    setLat(loc.lat)
    setLon(loc.lon)
    setLocationName(loc.name)
    if (loc.utc_offset) {
      setUtcOffset(loc.utc_offset)
    }
  }

  const calculateChart = async (ay = ayanamsha, hsys = houseSystem) => {
    setLoading(true)
    setError(null)

    const payload = {
      date: date.trim(),
      time: time.trim(),
      utc_offset: utcOffset.trim(),
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ayanamsha: ay,
      house_system: hsys
    }

    try {
      const data = await calculateDual(payload)
      setResult(data)
      if (onComplete) {
        onComplete(data)
      }
    } catch (err) {
      console.error('Calculation Error:', err)
      const errorMsg =
        err.response?.data?.detail ||
        'Failed to connect to calculation engine. Ensure backend server is reachable.'
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
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!result ? (
          /* --- Executive Admin Dashboard Form Card --- */
          <motion.div
            key="dashboard-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl overflow-hidden text-left"
          >
            {/* Dashboard Header Bar */}
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 tracking-tight">
                    Astrological Blueprint & Ephemeris Engine
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Dual-Spectrum Tropical & Sidereal Jyotish Calculation Console
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-zinc-900 border border-zinc-700 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Engine: v2.1.0 Active
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Structured Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* --- Panel 1: Identity & Birth Timing --- */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <CalendarIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      1. Date & Chronological Time
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Date of Birth (YYYY/MM/DD)
                      </label>
                      <input
                        type="text"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="2003/06/11"
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Time (24h HH:MM)
                        </label>
                        <input
                          type="text"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          placeholder="12:00"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          UTC Offset
                        </label>
                        <input
                          type="text"
                          required
                          value={utcOffset}
                          onChange={(e) => setUtcOffset(e.target.value)}
                          placeholder="+05:30"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Panel 2: Geolocation & Coordinates --- */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <GlobeIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      2. Geolocation & Spatial Anchor
                    </span>
                  </div>

                  <LocationPicker
                    latitude={lat}
                    longitude={lon}
                    initialLocationName={locationName}
                    onLocationChange={handleLocationChange}
                  />
                </div>
              </div>

              {/* --- Panel 3: Calculation Parameters & Engine Config --- */}
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      3. Astrological Engine Parameters
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">Swiss Ephemeris v2.10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Vedic Sidereal Ayanamsha
                    </label>
                    <select
                      value={ayanamsha}
                      onChange={(e) => setAyanamsha(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-lg px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
                    >
                      <option value="lahiri">Lahiri (Chitrapaksha) &bull; Standard Official</option>
                      <option value="raman">B.V. Raman (397 AD Epoch)</option>
                      <option value="kp">Krishnamurti Paddhati (KP Stellar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Western Tropical House System
                    </label>
                    <select
                      value={houseSystem}
                      onChange={(e) => setHouseSystem(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-lg px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
                    >
                      <option value="placidus">Placidus (Quadrant Semi-Arc)</option>
                      <option value="whole_sign">Whole Sign (Equal 30° Houses)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Alert Box */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                >
                  <span className="text-base">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Executive Submit Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500 font-mono">
                  Calculates 10+ planetary bodies, Nakshatras, Navamsha & Vimshottari Timeline
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full sm:w-auto min-w-[260px] py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 border border-indigo-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Computing Ephemeris Matrix...</span>
                    </>
                  ) : (
                    <>
                      <span>✦</span>
                      <span>Calculate Astrological Blueprint</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* --- Full Dual Astrological Result View --- */
          <motion.div
            key="result-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-4"
          >
            {/* Top Action Bar to Re-adjust Inputs */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold">Calculated for:</span>
                <span className="text-zinc-100">{locationName}</span>
                <span className="text-zinc-500">({date} at {time})</span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold border border-zinc-700 transition cursor-pointer"
              >
                ↺ Modify Parameters
              </button>
            </div>

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
