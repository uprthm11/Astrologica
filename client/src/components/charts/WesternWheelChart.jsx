import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ZODIAC_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
}

const ELEMENT_COLORS = {
  Fire: '#ef4444',
  Earth: '#10b981',
  Air: '#06b6d4',
  Water: '#6366f1'
}

const ASPECT_COLORS = {
  Conjunction: '#a855f7',
  Sextile: '#38bdf8',
  Trine: '#34d399',
  Square: '#f43f5e',
  Opposition: '#fb923c'
}

export default function WesternWheelChart({ westernData }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null)

  if (!westernData || !westernData.planets) return null

  const { planets = [], houses = [], aspects = [], ascendant } = westernData
  const ascLon = ascendant ? ascendant.longitude : 0

  // Center & Radius settings for 600x600 SVG
  const cx = 300
  const cy = 300
  const rOuter = 260
  const rZodiac = 220
  const rHouses = 175
  const rInner = 120

  // Helper to convert ecliptic longitude to SVG angle (oriented with Ascendant on left: 180°)
  const lonToAngle = (lon) => {
    // Standard astrological orientation: Ascendant is at 9 o'clock (180° in standard math, or math angle PI)
    const diff = (lon - ascLon + 360) % 360
    return (180 - diff + 360) % 360
  }

  const polarToCartesian = (radius, angleInDegrees) => {
    const rad = (angleInDegrees * Math.PI) / 180.0
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad)
    }
  }

  // 12 Zodiac Arcs (each 30 degrees)
  const zodiacSigns = [
    { name: 'Aries', element: 'Fire' },
    { name: 'Taurus', element: 'Earth' },
    { name: 'Gemini', element: 'Air' },
    { name: 'Cancer', element: 'Water' },
    { name: 'Leo', element: 'Fire' },
    { name: 'Virgo', element: 'Earth' },
    { name: 'Libra', element: 'Air' },
    { name: 'Scorpio', element: 'Water' },
    { name: 'Sagittarius', element: 'Fire' },
    { name: 'Capricorn', element: 'Earth' },
    { name: 'Aquarius', element: 'Air' },
    { name: 'Pisces', element: 'Water' }
  ]

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full max-w-[540px] aspect-square p-2">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]"
        >
          {/* Background Circles */}
          <circle cx={cx} cy={cy} r={rOuter} className="fill-slate-950/80 stroke-purple-500/30 stroke-2" />
          <circle cx={cx} cy={cy} r={rZodiac} className="fill-slate-900/60 stroke-purple-500/20 stroke-1" />
          <circle cx={cx} cy={cy} r={rHouses} className="fill-slate-950/90 stroke-indigo-500/20 stroke-1" />
          <circle cx={cx} cy={cy} r={rInner} className="fill-slate-900/40 stroke-purple-500/30 stroke-1" />

          {/* Zodiac 12 Arcs & Glyphs */}
          {zodiacSigns.map((z, idx) => {
            const startLon = idx * 30
            const midLon = startLon + 15
            const startAng = lonToAngle(startLon)
            const endAng = lonToAngle(startLon + 30)
            const midAng = lonToAngle(midLon)

            const pStart = polarToCartesian(rOuter, startAng)
            const pEnd = polarToCartesian(rOuter, endAng)
            const pInnerStart = polarToCartesian(rZodiac, startAng)
            const pInnerEnd = polarToCartesian(rZodiac, endAng)

            const pGlyph = polarToCartesian((rOuter + rZodiac) / 2, midAng)

            return (
              <g key={z.name}>
                {/* Sector divider line */}
                <line
                  x1={pStart.x}
                  y1={pStart.y}
                  x2={pInnerStart.x}
                  y2={pInnerStart.y}
                  className="stroke-purple-500/30 stroke-1"
                />
                {/* Zodiac Glyph */}
                <text
                  x={pGlyph.x}
                  y={pGlyph.y + 6}
                  textAnchor="middle"
                  fill={ELEMENT_COLORS[z.element] || '#c084fc'}
                  className="text-lg font-bold select-none"
                >
                  {ZODIAC_SYMBOLS[z.name]}
                </text>
              </g>
            )
          })}

          {/* House Cusps Lines & Labels */}
          {houses.map((h, idx) => {
            const cLon = h.cusp_longitude
            const ang = lonToAngle(cLon)
            const pOut = polarToCartesian(rZodiac, ang)
            const pIn = polarToCartesian(rInner, ang)

            // Label position halfway into house
            const nextCusp = houses[(idx + 1) % 12].cusp_longitude
            const span = (nextCusp - cLon + 360) % 360
            const midHouseLon = (cLon + span / 2) % 360
            const midHouseAng = lonToAngle(midHouseLon)
            const pNum = polarToCartesian((rHouses + rInner) / 2, midHouseAng)

            return (
              <g key={`house-${h.house}`}>
                <line
                  x1={pOut.x}
                  y1={pOut.y}
                  x2={pIn.x}
                  y2={pIn.y}
                  className={`${
                    idx % 3 === 0
                      ? 'stroke-purple-400/60 stroke-2'
                      : 'stroke-slate-700/50 stroke-1'
                  }`}
                />
                <text
                  x={pNum.x}
                  y={pNum.y + 4}
                  textAnchor="middle"
                  className="fill-slate-400 text-[11px] font-mono font-semibold select-none"
                >
                  {h.house}
                </text>
              </g>
            )
          })}

          {/* Aspect Lines in Inner Core */}
          {aspects.slice(0, 20).map((asp, idx) => {
            const p1 = planets.find((p) => p.name === asp.planet_1)
            const p2 = planets.find((p) => p.name === asp.planet_2)
            if (!p1 || !p2) return null

            const p1Pt = polarToCartesian(rInner - 8, lonToAngle(p1.longitude))
            const p2Pt = polarToCartesian(rInner - 8, lonToAngle(p2.longitude))
            const color = ASPECT_COLORS[asp.aspect] || '#a855f7'

            const isHighlighted =
              hoveredPlanet &&
              (hoveredPlanet.name === asp.planet_1 || hoveredPlanet.name === asp.planet_2)

            return (
              <line
                key={`asp-${idx}`}
                x1={p1Pt.x}
                y1={p1Pt.y}
                x2={p2Pt.x}
                y2={p2Pt.y}
                stroke={color}
                strokeWidth={isHighlighted ? 2.5 : 1}
                strokeOpacity={isHighlighted ? 0.9 : 0.25}
                className="transition-all duration-200"
              />
            )
          })}

          {/* Planet Placement Markers */}
          {planets.map((p, idx) => {
            const ang = lonToAngle(p.longitude)
            // Stagger radius slightly to prevent glyph overlap
            const rPlanet = rHouses - 20 + (idx % 2 === 0 ? 8 : -8)
            const pos = polarToCartesian(rPlanet, ang)
            const isHovered = hoveredPlanet && hoveredPlanet.id === p.id

            return (
              <g
                key={p.id}
                onMouseEnter={() => setHoveredPlanet(p)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className="cursor-pointer transition-transform"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 14 : 11}
                  className="fill-slate-900 stroke-purple-400 stroke-1 shadow-md"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={p.color || '#e0e7ff'}
                  className="text-xs font-black select-none pointer-events-none"
                >
                  {p.glyph}
                </text>
              </g>
            )
          })}

          {/* Center Point */}
          <circle cx={cx} cy={cy} r={3} className="fill-purple-400" />
        </svg>
      </div>

      {/* Hovered Planet Details Tooltip Card */}
      <div className="h-14 mt-2 flex items-center justify-center">
        {hoveredPlanet ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs text-slate-200 flex items-center gap-3 shadow-lg"
          >
            <span className="text-base font-bold" style={{ color: hoveredPlanet.color }}>
              {hoveredPlanet.glyph} {hoveredPlanet.name}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="font-semibold text-purple-300">
              {hoveredPlanet.sign} {hoveredPlanet.dms}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-indigo-300">House {hoveredPlanet.house}</span>
            {hoveredPlanet.is_retrograde && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                Rx
              </span>
            )}
          </motion.div>
        ) : (
          <span className="text-xs text-slate-500">
            Hover over any planet glyph on the wheel chart to inspect placement details
          </span>
        )}
      </div>
    </div>
  )
}
