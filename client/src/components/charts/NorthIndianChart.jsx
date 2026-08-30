import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function NorthIndianChart({ vedicData }) {
  const [chartType, setChartType] = useState('D1') // 'D1' (Rashi) | 'D9' (Navamsha)

  if (!vedicData || !vedicData.planets || !vedicData.lagna) return null

  const { planets = [], lagna } = vedicData

  // Lagna Rashi Index (1 = Aries ... 12 = Pisces)
  const lagnaRashiIdx = chartType === 'D1' ? lagna.rashi_index || 1 : lagna.navamsha_d9.sign_index || 1

  // Map each of the 12 houses to its Rashi and occupying planets
  const housesMap = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1
    const rashiNum = ((lagnaRashiIdx - 1 + i) % 12) + 1
    
    // Find planets in this house for selected chart type
    let housePlanets = []
    if (chartType === 'D1') {
      housePlanets = planets.filter((p) => p.bhava === houseNum)
    } else {
      // D9 Navamsha: house relative to D9 Lagna
      const d9LagnaIdx = lagna.navamsha_d9.sign_index
      housePlanets = planets.filter((p) => {
        const pD9SignIdx = p.navamsha_d9.sign_index
        const pD9House = ((pD9SignIdx - d9LagnaIdx + 12) % 12) + 1
        return pD9House === houseNum
      })
    }

    return {
      house: houseNum,
      rashiNumber: rashiNum,
      planets: housePlanets
    }
  })

  // Coordinates for the 12 house text anchors in 500x500 square
  const houseLabelPositions = {
    1: { rashi: { x: 250, y: 170 }, body: { x: 250, y: 120 } },
    2: { rashi: { x: 140, y: 70 }, body: { x: 110, y: 110 } },
    3: { rashi: { x: 70, y: 140 }, body: { x: 100, y: 170 } },
    4: { rashi: { x: 170, y: 250 }, body: { x: 120, y: 250 } },
    5: { rashi: { x: 70, y: 360 }, body: { x: 100, y: 330 } },
    6: { rashi: { x: 140, y: 430 }, body: { x: 110, y: 390 } },
    7: { rashi: { x: 250, y: 330 }, body: { x: 250, y: 380 } },
    8: { rashi: { x: 360, y: 430 }, body: { x: 390, y: 390 } },
    9: { rashi: { x: 430, y: 360 }, body: { x: 400, y: 330 } },
    10: { rashi: { x: 330, y: 250 }, body: { x: 380, y: 250 } },
    11: { rashi: { x: 430, y: 140 }, body: { x: 400, y: 170 } },
    12: { rashi: { x: 360, y: 70 }, body: { x: 390, y: 110 } }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Chart Selector Tabs (D1 Rashi vs D9 Navamsha) */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setChartType('D1')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            chartType === 'D1'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Rashi Chart (D1)
        </button>
        <button
          onClick={() => setChartType('D9')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            chartType === 'D9'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Navamsha Chart (D9)
        </button>
      </div>

      <div className="relative w-full max-w-[480px] aspect-square p-2">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(168,85,247,0.15)]"
        >
          {/* Outer Border */}
          <rect
            x="10"
            y="10"
            width="480"
            height="480"
            className="fill-slate-950/90 stroke-purple-500/40 stroke-2"
          />

          {/* Diagonal Corner-to-Corner Lines */}
          <line x1="10" y1="10" x2="490" y2="490" className="stroke-purple-500/30 stroke-1.5" />
          <line x1="490" y1="10" x2="10" y2="490" className="stroke-purple-500/30 stroke-1.5" />

          {/* Central Diamond Lines connecting midpoints */}
          <line x1="250" y1="10" x2="10" y2="250" className="stroke-purple-500/40 stroke-2" />
          <line x1="10" y1="250" x2="250" y2="490" className="stroke-purple-500/40 stroke-2" />
          <line x1="250" y1="490" x2="490" y2="250" className="stroke-purple-500/40 stroke-2" />
          <line x1="490" y1="250" x2="250" y2="10" className="stroke-purple-500/40 stroke-2" />

          {/* House Content: Rashi Numbers & Occupying Planets */}
          {housesMap.map((hData) => {
            const pos = houseLabelPositions[hData.house]
            if (!pos) return null

            return (
              <g key={`n-house-${hData.house}`}>
                {/* Rashi Number */}
                <text
                  x={pos.rashi.x}
                  y={pos.rashi.y}
                  textAnchor="middle"
                  className="fill-amber-400/80 font-mono text-xs font-bold select-none"
                >
                  {hData.rashiNumber}
                </text>

                {/* Occupying Planets */}
                <text
                  x={pos.body.x}
                  y={pos.body.y}
                  textAnchor="middle"
                  className="fill-slate-100 font-sans text-xs font-semibold select-none leading-relaxed"
                >
                  {hData.planets.map((p, pIdx) => (
                    <tspan
                      key={p.id}
                      x={pos.body.x}
                      dy={pIdx === 0 ? 0 : 13}
                      fill={p.color || '#e0e7ff'}
                    >
                      {p.name.slice(0, 2)}
                      {p.is_retrograde ? '(R)' : ''}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-[11px] text-slate-500 mt-2">
        North Indian Diamond Format &bull; House 1 (Lagna) is at the Top Center &bull; Numbers indicate Rashis (1=Aries ... 12=Pisces)
      </p>
    </div>
  )
}
