import React, { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Country, State, City } from 'country-state-city'
import { CinematicButton, fadeUp } from './CinematicPrimitives'
import CinematicWheelPicker from './CinematicWheelPicker'

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
  // Navigation stage: 'country' | 'state' | 'city'
  const [stage, setStage] = useState('country')

  // Phase 1: Search query state
  const [searchQuery, setSearchQuery] = useState('')

  // Selected values
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedStateCode, setSelectedStateCode]     = useState('')
  const [selectedCityName, setSelectedCityName]       = useState('')
  const [searchingFinal, setSearchingFinal]           = useState(false)

  // 1. All Countries list
  const countries = useMemo(() => Country.getAllCountries(), [])

  // 2. States for selected country
  const states = useMemo(() => {
    if (!selectedCountryCode || selectedCountryCode === 'NA') return []
    return State.getStatesOfCountry(selectedCountryCode)
  }, [selectedCountryCode])

  // 3. Cities for selected country and state
  const cities = useMemo(() => {
    if (!selectedCountryCode || selectedCountryCode === 'NA') return []
    if (selectedStateCode && selectedStateCode !== 'NA') {
      return City.getCitiesOfState(selectedCountryCode, selectedStateCode)
    }
    return City.getCitiesOfCountry(selectedCountryCode) || []
  }, [selectedCountryCode, selectedStateCode])

  const selectedCountryObj = useMemo(() => {
    return countries.find(c => c.isoCode === selectedCountryCode)
  }, [countries, selectedCountryCode])

  const selectedStateObj = useMemo(() => {
    return states.find(s => s.isoCode === selectedStateCode)
  }, [states, selectedStateCode])

  // Phase 2: Dynamic Array Filtering
  // Intercept the raw location data array for the current active stage
  const rawOptions = useMemo(() => {
    if (stage === 'country') return countries
    if (stage === 'state') return states
    if (stage === 'city') return cities
    return []
  }, [stage, countries, states, cities])

  // Case-insensitive filter based on searchQuery
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return rawOptions
    const q = searchQuery.toLowerCase().trim()
    return rawOptions.filter(option => option.name?.toLowerCase().includes(q))
  }, [rawOptions, searchQuery])

  // Geocoding and final coordinate resolution
  const handleContinue = useCallback(async (overrideCityName) => {
    const finalCity = overrideCityName !== undefined ? overrideCityName : selectedCityName
    setSearchingFinal(true)

    const countryName = selectedCountryObj?.name || ''
    const stateName   = selectedStateObj?.name || ''
    const cityName    = finalCity === 'NA' ? '' : finalCity

    const locationParts = [cityName, stateName, countryName].filter(Boolean)
    const locationName  = locationParts.join(', ') || countryName

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
      } else {
        const fallbackRes = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(`${cityName || stateName}, ${countryName}`)}&limit=1`,
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
        locationName,
        utcOffset,
        country: countryName,
        state: stateName,
        city: cityName,
      })
    } catch (_) {
      onSelect({
        lat: 0.0,
        lng: 0.0,
        locationName,
        utcOffset: "+00:00",
        country: countryName,
        state: stateName,
        city: cityName,
      })
    } finally {
      setSearchingFinal(false)
    }
  }, [selectedCityName, selectedCountryObj, selectedStateObj, onSelect])

  // Advance from Country to State (or City if no states)
  const handleConfirmCountry = useCallback(() => {
    const activeCode = selectedCountryCode || filteredOptions[0]?.isoCode || countries[0]?.isoCode
    if (!activeCode) return

    setSelectedCountryCode(activeCode)
    setSearchQuery('') // State Reset Safety: clear input on advance

    const availableStates = State.getStatesOfCountry(activeCode)
    if (availableStates.length === 0) {
      setSelectedStateCode('NA')
      const availableCities = City.getCitiesOfCountry(activeCode) || []
      if (availableCities.length === 0) {
        setSelectedCityName('NA')
      } else {
        setSelectedCityName(availableCities[0]?.name || '')
        setStage('city')
      }
    } else {
      setSelectedStateCode(availableStates[0]?.isoCode || '')
      setSelectedCityName('')
      setStage('state')
    }
  }, [selectedCountryCode, filteredOptions, countries])

  // Advance from State to City
  const handleConfirmState = useCallback(() => {
    const activeStateCode = selectedStateCode || filteredOptions[0]?.isoCode || states[0]?.isoCode
    if (!activeStateCode) return

    setSelectedStateCode(activeStateCode)
    setSearchQuery('') // State Reset Safety: clear input on advance

    const availableCities = (selectedCountryCode && activeStateCode && activeStateCode !== 'NA')
      ? City.getCitiesOfState(selectedCountryCode, activeStateCode)
      : []

    if (availableCities.length === 0) {
      setSelectedCityName('NA')
    } else {
      setSelectedCityName(availableCities[0]?.name || '')
      setStage('city')
    }
  }, [selectedCountryCode, selectedStateCode, filteredOptions, states])

  // Confirm City & Proceed
  const handleConfirmCity = useCallback(() => {
    const activeCity = selectedCityName || filteredOptions[0]?.name || cities[0]?.name || ''
    setSelectedCityName(activeCity)
    setSearchQuery('') // State Reset Safety: clear input on advance
    handleContinue(activeCity)
  }, [selectedCityName, filteredOptions, cities, handleContinue])

  // Go back to previous selection tier
  const handleBack = useCallback(() => {
    setSearchQuery('') // State Reset Safety: clear input on back
    if (stage === 'city') {
      if (states.length > 0) {
        setStage('state')
      } else {
        setStage('country')
      }
    } else if (stage === 'state') {
      setStage('country')
    }
  }, [stage, states.length])

  // Reset all fields
  const handleReset = useCallback(() => {
    setSearchQuery('') // State Reset Safety: clear input on reset
    setSelectedCountryCode('')
    setSelectedStateCode('')
    setSelectedCityName('')
    setStage('country')
  }, [])

  const isCountryOnly = Boolean(
    selectedCountryCode &&
    states.length === 0 &&
    (!cities || cities.length === 0)
  )

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-4 px-2">
      {/* ── Stepped Breadcrumb Stage Indicators ── */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="flex items-center justify-center flex-wrap gap-2 text-xs font-mono tracking-widest uppercase mb-1"
      >
        <button
          onClick={() => { setStage('country'); setSearchQuery(''); }}
          className={`cursor-pointer transition-all bg-transparent border-0 ${
            stage === 'country'
              ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
              : selectedCountryCode
              ? 'text-blue-200/70 hover:text-white'
              : 'text-blue-200/30'
          }`}
        >
          1. Country {selectedCountryObj ? `(${selectedCountryObj.name})` : ''}
        </button>

        <span className="text-blue-200/20">/</span>

        <button
          disabled={!selectedCountryCode || states.length === 0}
          onClick={() => { if (selectedCountryCode && states.length > 0) { setStage('state'); setSearchQuery(''); } }}
          className={`transition-all bg-transparent border-0 ${
            !selectedCountryCode || states.length === 0
              ? 'text-blue-200/20 cursor-not-allowed'
              : stage === 'state'
              ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] cursor-pointer'
              : 'text-blue-200/70 hover:text-white cursor-pointer'
          }`}
        >
          2. State {selectedStateObj ? `(${selectedStateObj.name})` : ''}
        </button>

        <span className="text-blue-200/20">/</span>

        <span
          className={`transition-all ${
            stage === 'city'
              ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
              : selectedCityName && selectedCityName !== 'NA'
              ? 'text-blue-200/70'
              : 'text-blue-200/30'
          }`}
        >
          3. City {selectedCityName && selectedCityName !== 'NA' ? `(${selectedCityName})` : ''}
        </span>
      </motion.div>

      {/* ── PHASE 1: SEARCH STATE & CINEMATIC INPUT UI ── */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full flex flex-col items-center">
        <input 
          type="text" 
          placeholder="Type to search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (stage === 'country') {
                if (isCountryOnly) handleContinue('NA')
                else handleConfirmCountry()
              } else if (stage === 'state') {
                handleConfirmState()
              } else if (stage === 'city') {
                handleConfirmCity()
              }
            }
          }}
          className="bg-transparent border-b border-cyan-400/30 text-white text-center text-lg md:text-xl focus:outline-none focus:border-cyan-400 focus:shadow-[0_1px_12px_rgba(34,211,238,0.4)] transition-all font-light tracking-widest placeholder-blue-200/30 w-full max-w-xs pb-2 mb-6"
        />

        {/* ── PHASE 3: EMPTY STATES & WHEEL SAFETY ── */}
        {filteredOptions.length === 0 ? (
          <p className="text-blue-200/50 text-sm tracking-widest mt-4 uppercase">No stellar matches found</p>
        ) : (
          <div className="w-full max-w-sm bg-white/[0.015] border border-blue-200/10 rounded-2xl p-3">
            <CinematicWheelPicker
              label={stage === 'country' ? 'Country' : stage === 'state' ? 'State / Region' : 'City'}
              data={filteredOptions}
              options={filteredOptions}
              value={stage === 'country' ? selectedCountryCode : stage === 'state' ? selectedStateCode : selectedCityName}
              onChange={(val) => {
                if (stage === 'country') setSelectedCountryCode(val)
                else if (stage === 'state') setSelectedStateCode(val)
                else if (stage === 'city') setSelectedCityName(val)
              }}
            />
          </div>
        )}
      </motion.div>

      {/* ── Stage Action Buttons ── */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="flex flex-col items-center gap-3 mt-2">
        {stage === 'country' && (
          <div className="flex items-center gap-4">
            {isCountryOnly ? (
              <CinematicButton onClick={() => handleContinue('NA')}>
                Continue →
              </CinematicButton>
            ) : (
              <CinematicButton onClick={handleConfirmCountry}>
                Confirm Country →
              </CinematicButton>
            )}
          </div>
        )}

        {stage === 'state' && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-xs font-mono tracking-widest uppercase text-blue-200/60 hover:text-white transition cursor-pointer bg-transparent border-0"
            >
              ← Back
            </button>
            <CinematicButton onClick={handleConfirmState}>
              Confirm State →
            </CinematicButton>
          </div>
        )}

        {stage === 'city' && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-xs font-mono tracking-widest uppercase text-blue-200/60 hover:text-white transition cursor-pointer bg-transparent border-0"
            >
              ← Back
            </button>
            <CinematicButton onClick={handleConfirmCity}>
              Continue →
            </CinematicButton>
          </div>
        )}

        {/* Reset Location Action */}
        {selectedCountryCode && (
          <button
            onClick={handleReset}
            className="text-[11px] font-mono tracking-widest uppercase text-blue-200/40 hover:text-white transition cursor-pointer bg-transparent border-0"
          >
            Reset Location
          </button>
        )}

        {/* Searching Coordinates Indicator */}
        {searchingFinal && (
          <motion.div
            animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="text-center text-blue-200/40 text-xs font-mono tracking-widest mt-2"
          >
            verifying cosmic coordinates…
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
