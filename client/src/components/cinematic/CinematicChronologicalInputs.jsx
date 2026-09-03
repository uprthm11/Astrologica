import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn } from './CinematicPrimitives'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 107 }, (_, i) => 2026 - i) // 2026 down to 1920
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function CinematicChronologicalInputs({ onChange, initialDate, initialTime }) {
  // Parse initial values if available
  const initialDateParts = (initialDate || '2000-01-01').split('-')
  const initYear  = parseInt(initialDateParts[0], 10) || 2000
  const initMonth = (parseInt(initialDateParts[1], 10) || 1) - 1
  const initDay   = parseInt(initialDateParts[2], 10) || 1

  const initialTimeParts = (initialTime || '12:00').split(':')
  let initH24 = parseInt(initialTimeParts[0], 10) || 12
  const initM = initialTimeParts[1] || '00'
  const initAmpm = initH24 >= 12 ? 'PM' : 'AM'
  let initH12 = initH24 % 12
  if (initH12 === 0) initH12 = 12

  const [day, setDay]     = useState(initDay)
  const [month, setMonth] = useState(initMonth)
  const [year, setYear]   = useState(initYear)

  const [hour, setHour]     = useState(initH12)
  const [minute, setMinute] = useState(initM)
  const [ampm, setAmpm]     = useState(initAmpm)

  useEffect(() => {
    // Format YYYY-MM-DD
    const mStr = String(month + 1).padStart(2, '0')
    const dStr = String(day).padStart(2, '0')
    const formattedDate = `${year}-${mStr}-${dStr}`

    // Format 24h HH:MM
    let h24 = hour
    if (ampm === 'PM' && hour < 12) h24 += 12
    if (ampm === 'AM' && hour === 12) h24 = 0
    const formattedTime = `${String(h24).padStart(2, '0')}:${minute}`

    onChange({ date: formattedDate, time: formattedTime })
  }, [day, month, year, hour, minute, ampm])

  const selectStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(160,200,255,0.25)',
    outline: 'none',
    color: 'white',
    textAlign: 'center',
    textAlignLast: 'center',
    fontSize: '1rem',
    fontWeight: '300',
    letterSpacing: '0.15em',
    padding: '0.5rem 0.25rem',
    cursor: 'pointer',
    colorScheme: 'dark',
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* ── Date Selection Row ── */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-2">
        <div style={{ color: 'rgba(160,200,255,0.4)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
          Date of Birth
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Day */}
          <select value={day} onChange={e => setDay(Number(e.target.value))} style={selectStyle}>
            {DAYS.map(d => (
              <option key={d} value={d} className="bg-[#050816] text-white">
                {d}
              </option>
            ))}
          </select>

          {/* Month */}
          <select value={month} onChange={e => setMonth(Number(e.target.value))} style={selectStyle}>
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx} className="bg-[#050816] text-white">
                {m}
              </option>
            ))}
          </select>

          {/* Year */}
          <select value={year} onChange={e => setYear(Number(e.target.value))} style={selectStyle}>
            {YEARS.map(y => (
              <option key={y} value={y} className="bg-[#050816] text-white">
                {y}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ── Time Selection Row ── */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="w-full space-y-2">
        <div style={{ color: 'rgba(160,200,255,0.4)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
          Time of Birth
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Hour */}
          <select value={hour} onChange={e => setHour(Number(e.target.value))} style={selectStyle}>
            {HOURS.map(h => (
              <option key={h} value={h} className="bg-[#050816] text-white">
                {h}
              </option>
            ))}
          </select>

          {/* Minute */}
          <select value={minute} onChange={e => setMinute(e.target.value)} style={selectStyle}>
            {MINUTES.map(m => (
              <option key={m} value={m} className="bg-[#050816] text-white">
                :{m}
              </option>
            ))}
          </select>

          {/* AM / PM */}
          <select value={ampm} onChange={e => setAmpm(e.target.value)} style={selectStyle}>
            <option value="AM" className="bg-[#050816] text-white">AM</option>
            <option value="PM" className="bg-[#050816] text-white">PM</option>
          </select>
        </div>
      </motion.div>
    </div>
  )
}
