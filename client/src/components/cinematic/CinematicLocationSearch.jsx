import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CinematicButton, fadeUp } from './CinematicPrimitives'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

function formatUtcOffset(lon) {
  if (lon == null || isNaN(lon)) return "+00:00"
  const hours = lon / 15.0
  const sign = hours >= 0 ? "+" : "-"
  const abs = Math.abs(hours)
  const h = Math.floor(abs)
  const m = Math.round((abs - h) * 60)
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * 3-Tier Progressive Location Flow: Country -> State/Province -> City
 * Floating typography with zero boxes or borders.
 */
export default function CinematicLocationSearch({ onSelect }) {
  const [country, setCountry] = useState('')
  const [state, setState]     = useState('')
  const [city, setCity]       = useState('')
  const [searching, setSearching] = useState(false)
  const [err, setErr]         = useState('')

  const canShowState = country.trim().length >= 2
  const canShowCity  = canShowState && state.trim().length >= 2
  const isComplete   = canShowCity && city.trim().length >= 2

  const handleContinue = async () => {
    if (!isComplete) return
    setSearching(true)
    setErr('')

    const queryStr = `${city.trim()}, ${state.trim()}, ${country.trim()}`
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(queryStr)}&addressdetails=1&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      let lat = 0.0
      let lon = 0.0

      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat)
        lon = parseFloat(data[0].lon)
      } else {
        // Fallback search by city/country
        const fallbackRes = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(`${city.trim()}, ${country.trim()}`)}&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const fallbackData = await fallbackRes.json()
        if (fallbackData && fallbackData.length > 0) {
          lat = parseFloat(fallbackData[0].lat)
          lon = parseFloat(fallbackData[0].lon)
        }
      }

      const utcOffset = formatUtcOffset(lon)
      onSelect({
        lat,
        lng: lon,
        locationName: queryStr,
        utcOffset,
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
      })
    } catch (_) {
      // Fallback if network offline
      onSelect({
        lat: 0.0,
        lng: 0.0,
        locationName: queryStr,
        utcOffset: "+00:00",
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
      })
    } finally {
      setSearching(false)
    }
  }

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(160,200,255,0.25)',
    outline: 'none',
    color: 'white',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(160,200,255,0.35)',
    caretColor: 'rgba(160,200,255,0.7)',
    width: '100%',
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      {/* Country Input */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
        <div style={{ color: 'rgba(160,200,255,0.35)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
          Country
        </div>
        <input
          type="text"
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder="e.g. United States, India…"
          autoFocus
          style={inputStyle}
          className="text-lg font-light tracking-widest py-2 placeholder-white/20"
        />
      </motion.div>

      {/* State / Province Input (Revealed after Country) */}
      {canShowState && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <div style={{ color: 'rgba(160,200,255,0.35)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            State / Province
          </div>
          <input
            type="text"
            value={state}
            onChange={e => setState(e.target.value)}
            placeholder="e.g. California, MP…"
            style={inputStyle}
            className="text-lg font-light tracking-widest py-2 placeholder-white/20"
          />
        </motion.div>
      )}

      {/* City Input (Revealed after State) */}
      {canShowCity && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <div style={{ color: 'rgba(160,200,255,0.35)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            City
          </div>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && isComplete && handleContinue()}
            placeholder="e.g. San Francisco, Indore…"
            style={inputStyle}
            className="text-lg font-light tracking-widest py-2 placeholder-white/20"
          />
        </motion.div>
      )}

      {/* Searching Indicator */}
      {searching && (
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: 'rgba(160,200,255,0.5)', fontSize: '11px', letterSpacing: '0.25em' }}
          className="font-mono"
        >
          locating birth coordinates…
        </motion.div>
      )}

      {/* Continue Button (Revealed after all 3 filled) */}
      {isComplete && !searching && (
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="pt-2">
          <CinematicButton onClick={handleContinue}>
            Continue →
          </CinematicButton>
        </motion.div>
      )}
    </div>
  )
}
