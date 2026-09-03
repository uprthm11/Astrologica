import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from './CinematicPrimitives'

const MONTHS = [
  { name: 'January', val: '01' }, { name: 'February', val: '02' }, { name: 'March', val: '03' },
  { name: 'April', val: '04' }, { name: 'May', val: '05' }, { name: 'June', val: '06' },
  { name: 'July', val: '07' }, { name: 'August', val: '08' }, { name: 'September', val: '09' },
  { name: 'October', val: '10' }, { name: 'November', val: '11' }, { name: 'December', val: '12' }
]

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const YEARS = Array.from({ length: 107 }, (_, i) => String(2026 - i)) // 2026 down to 1920
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function CinematicChronologicalInputs({ onComplete }) {
  const [day, setDay]       = useState('')
  const [month, setMonth]   = useState('')
  const [year, setYear]     = useState('')
  const [hour, setHour]     = useState('')
  const [minute, setMinute] = useState('')
  const [ampm, setAmpm]     = useState('')

  const isAllSelected = Boolean(day && month && year && hour && minute && ampm)

  useEffect(() => {
    if (isAllSelected) {
      const formattedDate = `${year}-${month}-${day}`
      let h24 = parseInt(hour, 10)
      if (ampm === 'PM' && h24 < 12) h24 += 12
      if (ampm === 'AM' && h24 === 12) h24 = 0
      const formattedTime = `${String(h24).padStart(2, '0')}:${minute}`

      onComplete({ date: formattedDate, time: formattedTime, isComplete: true })
    } else {
      onComplete({ date: '', time: '', isComplete: false })
    }
  }, [day, month, year, hour, minute, ampm])

  const selectStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(160,200,255,0.3)',
    outline: 'none',
    color: 'white',
    textAlign: 'center',
    textAlignLast: 'center',
    fontSize: '1.1rem',
    fontWeight: '300',
    letterSpacing: '0.12em',
    padding: '0.6rem 0.2rem',
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
          <select value={day} onChange={e => setDay(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">Day</option>
            {DAYS.map(d => (
              <option key={d} value={d} className="bg-[#050816] text-white">
                {parseInt(d, 10)}
              </option>
            ))}
          </select>

          {/* Month */}
          <select value={month} onChange={e => setMonth(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">Month</option>
            {MONTHS.map(m => (
              <option key={m.val} value={m.val} className="bg-[#050816] text-white">
                {m.name}
              </option>
            ))}
          </select>

          {/* Year */}
          <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">Year</option>
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
          <select value={hour} onChange={e => setHour(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">Hour</option>
            {HOURS.map(h => (
              <option key={h} value={h} className="bg-[#050816] text-white">
                {parseInt(h, 10)}
              </option>
            ))}
          </select>

          {/* Minute */}
          <select value={minute} onChange={e => setMinute(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">Min</option>
            {MINUTES.map(m => (
              <option key={m} value={m} className="bg-[#050816] text-white">
                :{m}
              </option>
            ))}
          </select>

          {/* AM / PM */}
          <select value={ampm} onChange={e => setAmpm(e.target.value)} style={selectStyle}>
            <option value="" disabled className="bg-[#050816] text-blue-200/40">AM/PM</option>
            <option value="AM" className="bg-[#050816] text-white">AM</option>
            <option value="PM" className="bg-[#050816] text-white">PM</option>
          </select>
        </div>
      </motion.div>
    </div>
  )
}
