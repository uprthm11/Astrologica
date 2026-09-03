import React, { useState, memo } from 'react'
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

function WesternWheelChartComponent({ westernData }) {
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
    const diff = (lon - ascLon + 360) % 360
    return (180 - diff + 360) % 360
  }

  const polarToCartesian = (radius, angleInDegrees) => {
    const rad = (angleInDegrees * Math.PI) / 180.0
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    }
  }

  // Draw arc segment path
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(radius, endAngle)
    const end = polarToCartesian(radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ')
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[500px] aspect-square">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-2xl select-none"
        >
          {/* Outer Background Circle */}
          <circle cx={cx} cy={cy} r={rOuter} fill="#0d1033" stroke="#262a63" strokeWidth="2" />

          {/* 12 Zodiac Sign Segments (Outer Ring) */}
          {Array.from({ length: 12 }, (_, i) => {
            const startLon = i * 30
            const endLon = (i + 1) * 30
            const a1 = lonToAngle(startLon)
            const a2 = lonToAngle(endLon)
            const signCenterAngle = lonToAngle(startLon + 15)
            const signPos = polarToCartesian((rOuter + rZodiac) / 2, signCenterAngle)
            const signNames = Object.keys(ZODIAC_SYMBOLS)
            const signName = signNames[i]

            const isEven = i % 2 === 0
            const sliceColor = isEven ? '#12163b' : '#101336'

            const p1 = polarToCartesian(rOuter, a1)
            const p2 = polarToCartesian(rOuter, a2)
            const p3 = polarToCartesian(rZodiac, a2)
            const p4 = polarToCartesian(rZodiac, a1)

            return (
              <g key={`sign-${i}`}>
                <path
                  d={`M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rZodiac} ${rZodiac} 0 0 1 ${p4.x} ${p4.y} Z`}
                  fill={sliceColor}
                  stroke="#262a63"
                  strokeWidth="1"
                />
                <text
                  x={signPos.x}
                  y={signPos.y + 6}
                  fill="#c5c9f5"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {ZODIAC_SYMBOLS[signName]}
                </text>
              </g>
            )
          })}

          {/* House Slices Ring */}
          <circle cx={cx} cy={cy} r={rHouses} fill="#161942" stroke="#262a63" strokeWidth="1.5" />

          {/* House Cusp Lines */}
          {houses.map((h, idx) => {
            const hAngle = lonToAngle(h.cusp_longitude)
            const pOuter = polarToCartesian(rZodiac, hAngle)
            const pInner = polarToCartesian(rInner, hAngle)

            // Calculate next house cusp to place house number in center
            const nextH = houses[(idx + 1) % 12]
            const nextAngle = lonToAngle(nextH.cusp_longitude)
            // Mid angle calculation taking care of wrap around
            const midAngle = lonToAngle((h.cusp_longitude + 15) % 360)
            const numPos = polarToCartesian((rHouses + rInner) / 2, midAngle)

            const isMajorAxis = idx === 0 || idx === 3 || idx === 6 || idx === 9

            return (
              <g key={`house-${h.house}`}>
                <line
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke={isMajorAxis ? '#00d2ff' : '#262a63'}
                  strokeWidth={isMajorAxis ? '2.5' : '1'}
                  strokeDasharray={isMajorAxis ? 'none' : '3 3'}
                />
                <text
                  x={numPos.x}
                  y={numPos.y + 4}
                  fill="#6b729f"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {h.house}
                </text>
              </g>
            )
          })}

          {/* Inner Aspect Ring Circle */}
          <circle cx={cx} cy={cy} r={rInner} fill="#0b0e29" stroke="#262a63" strokeWidth="1.5" />

          {/* Aspect Chords Inside Wheel */}
          {aspects.map((asp, idx) => {
            const p1 = planets.find((p) => p.name === asp.body1)
            const p2 = planets.find((p) => p.name === asp.body2)
            if (!p1 || !p2) return null

            const a1 = lonToAngle(p1.longitude)
            const a2 = lonToAngle(p2.longitude)

            const pos1 = polarToCartesian(rInner - 8, a1)
            const pos2 = polarToCartesian(rInner - 8, a2)

            const aspColor = ASPECT_COLORS[asp.aspect] || '#7b82b8'

            return (
              <line
                key={`asp-${idx}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={aspColor}
                strokeWidth={asp.orb < 2.0 ? '1.5' : '0.8'}
                strokeOpacity={asp.orb < 3.0 ? '0.7' : '0.4'}
              />
            )
          })}

          {/* Center Emblem */}
          <circle cx={cx} cy={cy} r="24" fill="#161942" stroke="#3858f6" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy + 4}
            fill="#00d2ff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            ✦
          </text>

          {/* Planet Glyphs Positioned on Wheel */}
          {planets.map((planet) => {
            const pAngle = lonToAngle(planet.longitude)
            const glyphPos = polarToCartesian((rZodiac + rHouses) / 2, pAngle)

            return (
              <g
                key={planet.id}
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                <circle
                  cx={glyphPos.x}
                  cy={glyphPos.y}
                  r="12"
                  fill="#101336"
                  stroke={hoveredPlanet?.id === planet.id ? '#00d2ff' : '#262a63'}
                  strokeWidth={hoveredPlanet?.id === planet.id ? '2' : '1'}
                />
                <text
                  x={glyphPos.x}
                  y={glyphPos.y + 4.5}
                  fill={planet.color || '#ffffff'}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {planet.glyph}
                </text>
              </g>
            )
          })}

          {/* Ascendant Marker (ASC) at 9 o'clock */}
          <g>
            <line x1="20" y1={cy} x2={cx - rOuter} y2={cy} stroke="#00d2ff" strokeWidth="3" />
            <rect x="2" y={cy - 10} width="34" height="20" rx="4" fill="#00d2ff" />
            <text x="19" y={cy + 4} fill="#0b0e29" fontSize="10" fontWeight="black" textAnchor="middle">
              ASC
            </text>
          </g>

          {/* Midheaven Marker (MC) */}
          {westernData.mc && (
            <g>
              {(() => {
                const mcAngle = lonToAngle(westernData.mc.longitude)
                const pMC = polarToCartesian(rOuter, mcAngle)
                const pMCTip = polarToCartesian(rOuter + 18, mcAngle)
                return (
                  <>
                    <line x1={pMC.x} y1={pMC.y} x2={pMCTip.x} y2={pMCTip.y} stroke="#3858f6" strokeWidth="2.5" />
                    <rect x={pMCTip.x - 12} y={pMCTip.y - 8} width="24" height="16" rx="3" fill="#3858f6" />
                    <text x={pMCTip.x} y={pMCTip.y + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      MC
                    </text>
                  </>
                )
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Hovered Planet Details Tooltip Card */}
      <div className="h-14 mt-2 flex items-center justify-center">
        {hoveredPlanet ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-xl bg-[#101336] border border-[#3858f6]/40 text-xs text-[#c5c9f5] flex items-center gap-3 shadow-lg"
          >
            <span className="text-base font-bold" style={{ color: hoveredPlanet.color }}>
              {hoveredPlanet.glyph} {hoveredPlanet.name}
            </span>
            <span className="text-[#6b729f]">&bull;</span>
            <span className="font-semibold text-[#00d2ff]">
              {hoveredPlanet.sign} {hoveredPlanet.dms}
            </span>
            <span className="text-[#6b729f]">&bull;</span>
            <span className="text-white">House {hoveredPlanet.house}</span>
            {hoveredPlanet.is_retrograde && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                Rx
              </span>
            )}
          </motion.div>
        ) : (
          <span className="text-xs text-[#7b82b8] font-mono">
            Hover over any planet glyph on the wheel chart to inspect placement details
          </span>
        )}
      </div>
    </div>
  )
}

// React.memo with custom comparison check for performance optimization
const WesternWheelChart = memo(WesternWheelChartComponent, (prevProps, nextProps) => {
  return prevProps.westernData?.meta?.julian_day === nextProps.westernData?.meta?.julian_day &&
         prevProps.westernData?.house_system === nextProps.westernData?.house_system
})

export default WesternWheelChart
