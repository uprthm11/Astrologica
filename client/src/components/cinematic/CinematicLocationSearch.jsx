import React, { useState, useMemo } from 'react'
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
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedStateCode, setSelectedStateCode]     = useState('')
  const [selectedCityName, setSelectedCityName]       = useState('')
  const [searchingFinal, setSearchingFinal]           = useState(false)

  // 1. All Countries list
  const countries = useMemo(() => Country.getAllCountries(), [])

  // 2. States for selected country
  const states = useMemo(() => {
    if (!selectedCountryCode) return []
    return State.getStatesOfCountry(selectedCountryCode)
  }, [selectedCountryCode])

  // 3. Cities for selected country and state
  const cities = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode || selectedStateCode === 'NA') return []
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode)
  }, [selectedCountryCode, selectedStateCode])

  const selectedCountryObj = useMemo(() => {
    return countries.find(c => c.isoCode === selectedCountryCode)
  }, [countries, selectedCountryCode])

  const selectedStateObj = useMemo(() => {
    return states.find(s => s.isoCode === selectedStateCode)
  }, [states, selectedStateCode])

  // Wheel Options with leading placeholder
  const countryOptions = useMemo(() => {
    return [
      { label: 'Select Country…', value: '' },
      ...countries.map(c => ({ label: c.name, value: c.isoCode }))
    ]
  }, [countries])

  const stateOptions = useMemo(() => {
    if (!selectedCountryCode) {
      return [{ label: 'Choose Country First', value: '' }]
    }
    if (states.length === 0) {
      return [{ label: 'No States Required', value: 'NA' }]
    }
    return [
      { label: 'Select State…', value: '' },
      ...states.map(s => ({ label: s.name, value: s.isoCode }))
    ]
  }, [selectedCountryCode, states])

  const cityOptions = useMemo(() => {
    if (!selectedStateCode || selectedStateCode === '') {
      return [{ label: 'Choose State First', value: '' }]
    }
    if (cities.length === 0) {
      return [{ label: 'No Cities Required', value: 'NA' }]
    }
    return [
      { label: 'Select City…', value: '' },
      ...cities.map(c => ({ label: c.name, value: c.name }))
    ]
  }, [selectedStateCode, cities])

  const isComplete = Boolean(
    selectedCountryCode &&
    (states.length === 0 || (selectedStateCode && selectedStateCode !== '')) &&
    (cities.length === 0 || (selectedCityName && selectedCityName !== ''))
  )

  const handleCountryChange = (code) => {
    setSelectedCountryCode(code)
    const newStates = code ? State.getStatesOfCountry(code) : []
    if (newStates.length === 0) {
      setSelectedStateCode('NA')
      setSelectedCityName('NA')
    } else {
      setSelectedStateCode('')
      setSelectedCityName('')
    }
  }

  const handleStateChange = (code) => {
    setSelectedStateCode(code)
    const newCities = (selectedCountryCode && code && code !== 'NA')
      ? City.getCitiesOfState(selectedCountryCode, code)
      : []
    if (newCities.length === 0) {
      setSelectedCityName('NA')
    } else {
      setSelectedCityName('')
    }
  }

  const handleCityChange = (cityName) => {
    setSelectedCityName(cityName)
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
    const stateName   = selectedStateObj?.name || (selectedStateCode === 'NA' ? '' : '')
    const cityName    = selectedCityName === 'NA' ? '' : selectedCityName

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
  }

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-6 px-2">
      {/* ── Cinematic Wheel Picker Grid for Country, State, City ── */}
      <motion.div
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/[0.015] border border-blue-200/10 rounded-2xl p-3"
      >
        <CinematicWheelPicker
          label="Country"
          options={countryOptions}
          value={selectedCountryCode}
          onChange={handleCountryChange}
        />
        <CinematicWheelPicker
          label="State / Region"
          options={stateOptions}
          value={selectedStateCode}
          onChange={handleStateChange}
        />
        <CinematicWheelPicker
          label="City"
          options={cityOptions}
          value={selectedCityName}
          onChange={handleCityChange}
        />
      </motion.div>

      {/* Reset Location Action */}
      {selectedCountryCode && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={handleReset}
          onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 12px rgba(160,200,255,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
          className="text-xs font-mono tracking-widest uppercase text-blue-200/60 hover:text-white transition cursor-pointer bg-transparent border-0"
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
