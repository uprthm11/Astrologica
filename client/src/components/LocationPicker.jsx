import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// SVG Icons to avoid external icon dependencies
const MapPinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CrossIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * Estimates UTC offset formatted string (+HH:MM) from longitude or country
 */
function estimateUtcOffset(lon, countryCode) {
  if (countryCode && countryCode.toLowerCase() === 'in') {
    return '+05:30' // India standard time
  }
  const rawHours = lon / 15.0
  const sign = rawHours >= 0 ? '+' : '-'
  const absHours = Math.abs(rawHours)
  const h = Math.floor(absHours)
  const m = Math.round((absHours - h) * 60)
  // Clamp minutes to standard quarters
  const roundedM = Math.round(m / 15) * 15
  const finalH = roundedM === 60 ? h + 1 : h
  const finalM = roundedM === 60 ? 0 : roundedM
  const pad = (n) => String(n).padStart(2, '0')
  return `${sign}${pad(finalH)}:${pad(finalM)}`
}

export default function LocationPicker({
  latitude = 22.7196,
  longitude = 75.8577,
  initialLocationName = 'Indore, Madhya Pradesh, India',
  onLocationChange
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isManual, setIsManual] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({
    name: initialLocationName,
    lat: parseFloat(latitude),
    lon: parseFloat(longitude),
    utc_offset: '+05:30'
  })

  const [manualLat, setManualLat] = useState(latitude)
  const [manualLon, setManualLon] = useState(longitude)

  const dropdownRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search effect (350ms)
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    setLoading(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=6`
        const res = await axios.get(url, {
          headers: { 'Accept-Language': 'en' },
          timeout: 8000
        })

        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((item) => {
            const addr = item.address || {}
            const mainName =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              addr.county ||
              item.display_name.split(',')[0]
            const state = addr.state || addr.region || ''
            const country = addr.country || ''
            const countryCode = addr.country_code || ''

            const parts = [mainName, state, country].filter(Boolean)
            const formattedName = parts.length > 0 ? parts.join(', ') : item.display_name

            return {
              id: item.place_id,
              name: mainName,
              fullName: formattedName,
              subtext: [state, country].filter(Boolean).join(', '),
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              countryCode
            }
          })
          setResults(mapped)
          setIsOpen(true)
        }
      } catch (err) {
        console.warn('Location geocoding notice:', err.message)
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  const handleSelectPlace = (place) => {
    const calculatedOffset = estimateUtcOffset(place.lon, place.countryCode)
    const locObj = {
      name: place.fullName,
      lat: place.lat,
      lon: place.lon,
      utc_offset: calculatedOffset
    }
    setSelectedLocation(locObj)
    setManualLat(place.lat)
    setManualLon(place.lon)
    setIsOpen(false)
    setQuery('')

    if (onLocationChange) {
      onLocationChange(locObj)
    }
  }

  const handleManualApply = (e) => {
    e.preventDefault()
    const latF = parseFloat(manualLat)
    const lonF = parseFloat(manualLon)
    if (isNaN(latF) || isNaN(lonF)) return

    const calculatedOffset = estimateUtcOffset(lonF)
    const locObj = {
      name: `Custom Location (${latF.toFixed(4)}°, ${lonF.toFixed(4)}°)`,
      lat: latF,
      lon: lonF,
      utc_offset: calculatedOffset
    }
    setSelectedLocation(locObj)
    if (onLocationChange) {
      onLocationChange(locObj)
    }
  }

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Birth Location & Geocoordinates</span>
        </label>
        <button
          type="button"
          onClick={() => setIsManual(!isManual)}
          className="text-[11px] font-mono text-zinc-500 hover:text-indigo-400 transition cursor-pointer underline underline-offset-2"
        >
          {isManual ? 'Switch to Smart Search' : 'Manual Lat/Lon'}
        </button>
      </div>

      {!isManual ? (
        <div className="space-y-3">
          {/* Confirmed Location Badge if Selected & Not Searching */}
          {selectedLocation && !isOpen && query === '' ? (
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-100 truncate">
                    {selectedLocation.name}
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-emerald-400 font-medium">
                      {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E
                    </span>
                    <span className="text-zinc-600">&bull;</span>
                    <span className="text-zinc-500">UTC {selectedLocation.utc_offset}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedLocation(null)
                  setQuery('')
                  setIsOpen(true)
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            /* Search Input Bar */
            <div className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
                  <SearchIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(true)
                  }}
                  onFocus={() => {
                    if (results.length > 0) setIsOpen(true)
                  }}
                  placeholder="Type city, state, or country (e.g., London, Tokyo, Mumbai)..."
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition shadow-inner"
                />
                {loading ? (
                  <div className="absolute right-3.5 text-zinc-500">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </div>
                ) : query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setResults([])
                      setIsOpen(false)
                    }}
                    className="absolute right-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    <CrossIcon className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {/* Autocomplete Dropdown List */}
              <AnimatePresence>
                {isOpen && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-zinc-900 border border-zinc-700/90 shadow-2xl overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto"
                  >
                    <div className="p-1">
                      {results.map((place) => (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => handleSelectPlace(place)}
                          className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-zinc-800/90 text-zinc-200 transition flex items-center justify-between group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition truncate">
                              {place.name}
                            </div>
                            <div className="text-xs text-zinc-400 truncate mt-0.5">
                              {place.subtext || place.fullName}
                            </div>
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 shrink-0 text-right">
                            {place.lat.toFixed(2)}°, {place.lon.toFixed(2)}°
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        /* Manual Latitude & Longitude Fallback Inputs */
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase font-mono font-semibold text-zinc-400 block mb-1">
                Latitude (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="22.7196"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase font-mono font-semibold text-zinc-400 block mb-1">
                Longitude (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="75.8577"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualApply}
            className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-600 transition cursor-pointer"
          >
            Apply Manual Coordinates
          </button>
        </div>
      )}
    </div>
  )
}
