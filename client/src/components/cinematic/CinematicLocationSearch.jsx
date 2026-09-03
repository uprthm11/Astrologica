import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from './CinematicPrimitives'

const NOMINATIM_CACHE = new Map()
const NOMINATIM_URL   = 'https://nominatim.openstreetmap.org/search'

/**
 * Borderless, floating-text location search using Nominatim.
 * No backgrounds, no borders on the search field itself.
 * Results appear as pure text beneath the input.
 */
export default function CinematicLocationSearch({ onSelect }) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState(null)
  const debounceRef             = useRef(null)

  const search = useCallback(async (q) => {
    const key = q.toLowerCase().trim()
    if (key.length < 2) { setResults([]); return }

    if (NOMINATIM_CACHE.has(key)) {
      setResults(NOMINATIM_CACHE.get(key))
      return
    }

    setLoading(true)
    try {
      const res  = await fetch(
        `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      NOMINATIM_CACHE.set(key, data)
      setResults(data)
    } catch (_) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setSelected(null)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 350)
  }

  const handleSelect = (place) => {
    const addr = place.address || {}
    const city    = addr.city || addr.town || addr.village || addr.county || ''
    const country = addr.country || ''
    const label   = [city, country].filter(Boolean).join(', ') || place.display_name

    const utcOffset = -(new Date().getTimezoneOffset() / 60)

    const result = {
      lat:          parseFloat(place.lat),
      lng:          parseFloat(place.lon),
      locationName: label,
      utcOffset,
    }

    setSelected(label)
    setQuery(label)
    setResults([])
    onSelect(result)
  }

  const formatLabel = (place) => {
    const addr = place.address || {}
    const parts = [
      addr.city || addr.town || addr.village || addr.county,
      addr.state,
      addr.country,
    ].filter(Boolean)
    return parts.join(', ') || place.display_name
  }

  return (
    <div className="w-full max-w-sm relative">
      {/* ── Input ── */}
      <motion.input
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search city or place…"
        autoFocus
        style={{
          background:    'transparent',
          border:        'none',
          borderBottom:  '1px solid rgba(160,200,255,0.25)',
          outline:       'none',
          color:         'white',
          textAlign:     'center',
          textShadow:    '0 0 10px rgba(160,200,255,0.35)',
          caretColor:    'rgba(160,200,255,0.7)',
          width:         '100%',
        }}
        className="text-xl font-light tracking-widest py-3 placeholder-white/20"
      />

      {/* ── Loading pulse ── */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-blue-200/40 text-xs font-mono tracking-widest mt-4"
        >
          searching the cosmos…
        </motion.div>
      )}

      {/* ── Results as pure floating text ── */}
      <AnimatePresence>
        {results.length > 0 && !selected && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-3 list-none p-0"
          >
            {results.map((place, i) => (
              <motion.li
                key={place.place_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
              >
                <button
                  onClick={() => handleSelect(place)}
                  onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 12px rgba(160,200,255,0.8)' }}
                  onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
                  className="w-full text-center text-white/60 hover:text-white/95 transition-colors duration-200 text-sm font-light tracking-wider cursor-pointer bg-transparent border-0"
                >
                  {formatLabel(place)}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
