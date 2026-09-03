import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from './CinematicPrimitives'
import CinematicWheelPicker from './CinematicWheelPicker'

const MONTHS = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

const DAYS = Array.from({ length: 31 }, (_, i) => {
  const d = String(i + 1).padStart(2, '0')
  return { label: String(i + 1), value: d }
})

const YEARS = Array.from({ length: 107 }, (_, i) => {
  const y = String(2026 - i)
  return { label: y, value: y }
})

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = String(i + 1).padStart(2, '0')
  return { label: String(i + 1), value: h }
})

const MINUTES = Array.from({ length: 60 }, (_, i) => {
  const m = String(i).padStart(2, '0')
  return { label: `:${m}`, value: m }
})

const AMPM_OPTIONS = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
]

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

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg px-2">
      {/* ── Date Wheel Pickers ── */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-[0.35em] text-blue-200/50 text-center">
          Date of Birth
        </div>
        <div className="grid grid-cols-3 gap-2 bg-white/[0.015] border border-blue-200/10 rounded-2xl p-3">
          <CinematicWheelPicker
            label="Day"
            options={DAYS}
            value={day}
            onChange={setDay}
          />
          <CinematicWheelPicker
            label="Month"
            options={MONTHS}
            value={month}
            onChange={setMonth}
          />
          <CinematicWheelPicker
            label="Year"
            options={YEARS}
            value={year}
            onChange={setYear}
          />
        </div>
      </motion.div>

      {/* ── Time Wheel Pickers ── */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="w-full space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-[0.35em] text-blue-200/50 text-center">
          Time of Birth
        </div>
        <div className="grid grid-cols-3 gap-2 bg-white/[0.015] border border-blue-200/10 rounded-2xl p-3">
          <CinematicWheelPicker
            label="Hour"
            options={HOURS}
            value={hour}
            onChange={setHour}
          />
          <CinematicWheelPicker
            label="Minute"
            options={MINUTES}
            value={minute}
            onChange={setMinute}
          />
          <CinematicWheelPicker
            label="Period"
            options={AMPM_OPTIONS}
            value={ampm}
            onChange={setAmpm}
          />
        </div>
      </motion.div>
    </div>
  )
}
