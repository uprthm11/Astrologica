import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function CinematicLocationSearch({ onSelect }) {
  // Country state
  const [countryQuery, setCountryQuery] = useState('')
  const [countryOptions, setCountryOptions] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  // State/Province state
  const [stateQuery, setStateQuery] = useState('')
  const [stateOptions, setStateOptions] = useState([])
  const [selectedState, setSelectedState] = useState(null)

  // City state
  const [cityQuery, setCityQuery] = useState('')
  const [cityOptions, setCityOptions] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  const [loading, setLoading] = useState(false)
  const [searchingFinal, setSearchingFinal] = useState(false)
  const debounceRef = useRef(null)

  // Fetch Country options
  useEffect(() => {
    if (selectedCountry || countryQuery.trim().length < 2) {
      setCountryOptions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(countryQuery)}&featuretype=country&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setCountryOptions(data)
      } catch (_) {
        setCountryOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [countryQuery, selectedCountry])

  // Fetch State options
  useEffect(() => {
    if (!selectedCountry || selectedState || stateQuery.trim().length < 2) {
      setStateOptions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const q = `${stateQuery.trim()}, ${selectedCountry}`
        const res = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(q)}&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setStateOptions(data)
      } catch (_) {
        setStateOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [stateQuery, selectedCountry, selectedState])

  // Fetch City options
  useEffect(() => {
    if (!selectedState || selectedCity || cityQuery.trim().length < 2) {
      setCityOptions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const q = `${cityQuery.trim()}, ${selectedState}, ${selectedCountry}`
        const res = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(q)}&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setCityOptions(data)
      } catch (_) {
        setCityOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [cityQuery, selectedState, selectedCity])

  const handleSelectCountry = (opt) => {
    const addr = opt.address || {}
    const name = addr.country || opt.display_name.split(',')[0].trim()
    setSelectedCountry(name)
    setCountryQuery(name)
    setCountryOptions([])
  }

  const handleSelectState = (opt) => {
    const addr = opt.address || {}
    const name = addr.state || addr.region || opt.display_name.split(',')[0].trim()
    setSelectedState(name)
    setStateQuery(name)
    setStateOptions([])
  }

  const handleSelectCity = (opt) => {
    const addr = opt.address || {}
    const name = addr.city || addr.town || addr.village || addr.county || opt.display_name.split(',')[0].trim()
    setSelectedCity(name)
    setCityQuery(name)
    setCityOptions([])
  }

  const isAllLocked = Boolean(selectedCountry && selectedState && selectedCity)

  const handleContinue = async () => {
    if (!isAllLocked) return
    setSearchingFinal(true)
    const locationName = `${selectedCity}, ${selectedState}, ${selectedCountry}`
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      let lat = 0.0
      let lon = 0.0

      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat)
        lon = parseFloat(data[0].lon)
      }

      const utcOffset = formatUtcOffset(lon)
      onSelect({
        lat,
        lng: lon,
        locationName,
        utcOffset,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      })
    } catch (_) {
      onSelect({
        lat: 0.0,
        lng: 0.0,
        locationName,
        utcOffset: "+00:00",
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      })
    } finally {
      setSearchingFinal(false)
    }
  }

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(160,200,255,0.25)',
    outline: 'none',
    color: 'white',
    textAlign: 'center',
    caretColor: 'rgba(160,200,255,0.7)',
    width: '100%',
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      {/* ── Tier 1: Country ── */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-blue-200/40">
          <span>1. Country</span>
          {selectedCountry && (
            <button
              onClick={() => { setSelectedCountry(null); setSelectedState(null); setSelectedCity(null); setCountryQuery(''); setStateQuery(''); setCityQuery('') }}
              className="text-blue-300/60 hover:text-white underline cursor-pointer bg-transparent border-0"
            >
              Reset
            </button>
          )}
        </div>
        <input
          type="text"
          value={countryQuery}
          onChange={(e) => { setCountryQuery(e.target.value); setSelectedCountry(null); setSelectedState(null); setSelectedCity(null) }}
          placeholder="Type country name…"
          disabled={Boolean(selectedCountry)}
          style={{ ...inputStyle, opacity: selectedCountry ? 0.7 : 1 }}
          className="text-lg font-light tracking-widest py-2 placeholder-white/20"
        />

        {/* Floating Autocomplete List for Country */}
        <AnimatePresence>
          {countryOptions.length > 0 && !selectedCountry && (
            <motion.ul
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-2 space-y-2 list-none p-0"
            >
              {countryOptions.map((opt, i) => (
                <motion.li key={opt.place_id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button
                    onClick={() => handleSelectCountry(opt)}
                    className="w-full text-center text-white/70 hover:text-white transition text-sm font-light tracking-wider cursor-pointer bg-transparent border-0 py-1"
                  >
                    {opt.address?.country || opt.display_name}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Tier 2: State / Province (Revealed once Country is selected) ── */}
      {selectedCountry && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-blue-200/40">
            <span>2. State / Province</span>
            {selectedState && (
              <button
                onClick={() => { setSelectedState(null); setSelectedCity(null); setStateQuery(''); setCityQuery('') }}
                className="text-blue-300/60 hover:text-white underline cursor-pointer bg-transparent border-0"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="text"
            value={stateQuery}
            onChange={(e) => { setStateQuery(e.target.value); setSelectedState(null); setSelectedCity(null) }}
            placeholder="Type state name…"
            disabled={Boolean(selectedState)}
            style={{ ...inputStyle, opacity: selectedState ? 0.7 : 1 }}
            className="text-lg font-light tracking-widest py-2 placeholder-white/20"
          />

          {/* Floating Autocomplete List for State */}
          <AnimatePresence>
            {stateOptions.length > 0 && !selectedState && (
              <motion.ul
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-2 space-y-2 list-none p-0"
              >
                {stateOptions.map((opt, i) => (
                  <motion.li key={opt.place_id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button
                      onClick={() => handleSelectState(opt)}
                      className="w-full text-center text-white/70 hover:text-white transition text-sm font-light tracking-wider cursor-pointer bg-transparent border-0 py-1"
                    >
                      {opt.address?.state || opt.address?.region || opt.display_name.split(',')[0]}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Tier 3: City (Revealed once State is selected) ── */}
      {selectedState && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-blue-200/40">
            <span>3. City</span>
            {selectedCity && (
              <button
                onClick={() => { setSelectedCity(null); setCityQuery('') }}
                className="text-blue-300/60 hover:text-white underline cursor-pointer bg-transparent border-0"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(null) }}
            placeholder="Type city name…"
            disabled={Boolean(selectedCity)}
            style={{ ...inputStyle, opacity: selectedCity ? 0.7 : 1 }}
            className="text-lg font-light tracking-widest py-2 placeholder-white/20"
          />

          {/* Floating Autocomplete List for City */}
          <AnimatePresence>
            {cityOptions.length > 0 && !selectedCity && (
              <motion.ul
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-2 space-y-2 list-none p-0 max-h-48 overflow-y-auto"
              >
                {cityOptions.map((opt, i) => (
                  <motion.li key={opt.place_id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button
                      onClick={() => handleSelectCity(opt)}
                      className="w-full text-center text-white/70 hover:text-white transition text-sm font-light tracking-wider cursor-pointer bg-transparent border-0 py-1"
                    >
                      {opt.address?.city || opt.address?.town || opt.address?.village || opt.display_name.split(',')[0]}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Loading indicator */}
      {(loading || searchingFinal) && (
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-blue-200/40 text-xs font-mono tracking-widest mt-2"
        >
          verifying cosmic coordinates…
        </motion.div>
      )}

      {/* Continue Button (ONLY when all 3 are strictly selected) */}
      {isAllLocked && !searchingFinal && (
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="pt-2">
          <CinematicButton onClick={handleContinue}>
            Continue →
          </CinematicButton>
        </motion.div>
      )}
    </div>
  )
}
