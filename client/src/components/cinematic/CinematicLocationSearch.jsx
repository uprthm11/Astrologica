import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Country, State, City } from 'country-state-city'
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
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedStateCode, setSelectedStateCode]     = useState('')
  const [selectedCityName, setSelectedCityName]       = useState('')

  const [searchingFinal, setSearchingFinal] = useState(false)

  // 1. All Countries list
  const countries = useMemo(() => Country.getAllCountries(), [])

  // 2. States for selected country
  const states = useMemo(() => {
    if (!selectedCountryCode) return []
    return State.getStatesOfCountry(selectedCountryCode)
  }, [selectedCountryCode])

  // 3. Cities for selected country and state
  const cities = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) return []
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode)
  }, [selectedCountryCode, selectedStateCode])

  const selectedCountryObj = useMemo(() => {
    return countries.find(c => c.isoCode === selectedCountryCode)
  }, [countries, selectedCountryCode])

  const selectedStateObj = useMemo(() => {
    return states.find(s => s.isoCode === selectedStateCode)
  }, [states, selectedStateCode])

  const isComplete = Boolean(selectedCountryCode && (states.length === 0 || selectedStateCode) && (cities.length === 0 || selectedCityName))

  const handleCountryChange = (e) => {
    const code = e.target.value
    setSelectedCountryCode(code)
    setSelectedStateCode('')
    setSelectedCityName('')
  }

  const handleStateChange = (e) => {
    const code = e.target.value
    setSelectedStateCode(code)
    setSelectedCityName('')
  }

  const handleCityChange = (e) => {
    setSelectedCityName(e.target.value)
  }

  const handleReset = () => {
    setSelectedCountryCode('')
    setSelectedStateCode('')
    setSelectedCityName('')
  }

  const handleContinue = async () => {
    if (!isComplete) return
    setSearchingFinal(true)

    const countryName = selectedCountryObj?.name || ''
    const stateName   = selectedStateObj?.name || ''
    const cityName    = selectedCityName || stateName || countryName

    const locationName = [cityName, stateName, countryName].filter(Boolean).join(', ')

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
        // Fallback query country/city
        const fallbackRes = await fetch(
          `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(`${cityName}, ${countryName}`)}&limit=1`,
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
  }

  const selectStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(160,200,255,0.3)',
    outline: 'none',
    color: 'white',
    textAlign: 'center',
    textAlignLast: 'center',
    fontSize: '1.25rem', // text-xl / text-2xl large readable font
    fontWeight: '300',
    letterSpacing: '0.12em',
    padding: '0.75rem 0.25rem',
    width: '100%',
    cursor: 'pointer',
    colorScheme: 'dark',
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-7">
      {/* Country Select */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
        <select value={selectedCountryCode} onChange={handleCountryChange} style={selectStyle}>
          <option value="" disabled className="bg-[#050816] text-blue-200/40">Country</option>
          {countries.map(c => (
            <option key={c.isoCode} value={c.isoCode} className="bg-[#050816] text-white">
              {c.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* State Select (Revealed after Country) */}
      {selectedCountryCode && states.length > 0 && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <select value={selectedStateCode} onChange={handleStateChange} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">State</option>
            {states.map(s => (
              <option key={s.isoCode} value={s.isoCode} className="bg-[#050816] text-white">
                {s.name}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* City Select (Revealed after State) */}
      {selectedStateCode && cities.length > 0 && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-1">
          <select value={selectedCityName} onChange={handleCityChange} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">City</option>
            {cities.map((c, i) => (
              <option key={`${c.name}-${i}`} value={c.name} className="bg-[#050816] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Reset Location Button */}
      {selectedCountryCode && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={handleReset}
          onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 12px rgba(160,200,255,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
          className="text-xs font-mono tracking-widest uppercase text-blue-200/60 hover:text-white transition cursor-pointer bg-transparent border-0 mt-1"
        >
          Reset Location
        </motion.button>
      )}

      {/* Searching Coordinates Indicator */}
      {searchingFinal && (
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-blue-200/40 text-xs font-mono tracking-widest"
        >
          verifying cosmic coordinates…
        </motion.div>
      )}

      {/* Continue Button */}
      {isComplete && !searchingFinal && (
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="pt-2">
          <CinematicButton onClick={handleContinue}>
            Continue →
          </CinematicButton>
        </motion.div>
      )}
    </div>
  )
}
