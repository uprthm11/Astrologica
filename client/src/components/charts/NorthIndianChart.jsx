import React, { useState, memo } from 'react'
import { motion } from 'framer-motion'

function NorthIndianChartComponent({ vedicData }) {
  const [chartType, setChartType] = useState('D1') // 'D1' (Rashi) | 'D9' (Navamsha)

  if (!vedicData || !vedicData.planets || !vedicData.lagna) return null

  const { planets = [], lagna } = vedicData

  // Lagna Rashi Index (1 = Aries ... 12 = Pisces)
  const lagnaRashiIdx = chartType === 'D1' ? lagna.rashi_index || 1 : lagna.navamsha_d9.sign_index || 1

  // Map each of the 12 houses to its Rashi and occupying planets
  const housesMap = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1
    const rashiNum = ((lagnaRashiIdx - 1 + i) % 12) + 1
    
    let housePlanets = []
    if (chartType === 'D1') {
      housePlanets = planets.filter((p) => p.bhava === houseNum)
    } else {
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
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            chartType === 'D1'
              ? 'bg-[#3858f6] text-white shadow-md'
              : 'bg-[#101336] text-[#7b82b8] border border-[#262a63] hover:text-white'
          }`}
        >
          D1 Rashi Chart
        </button>
        <button
          onClick={() => setChartType('D9')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            chartType === 'D9'
              ? 'bg-[#3858f6] text-white shadow-md'
              : 'bg-[#101336] text-[#7b82b8] border border-[#262a63] hover:text-white'
          }`}
        >
          D9 Navamsha Chart
        </button>
      </div>

      <div className="relative w-full max-w-[460px] aspect-square">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl select-none">
          {/* Outer Border Square */}
          <rect x="10" y="10" width="480" height="480" fill="#0d1033" stroke="#262a63" strokeWidth="2.5" />

          {/* Diagonal Lines creating 12 Diamond & Triangle Houses */}
          <line x1="10" y1="10" x2="490" y2="490" stroke="#262a63" strokeWidth="2" />
          <line x1="10" y1="490" x2="490" y2="10" stroke="#262a63" strokeWidth="2" />

          {/* Inner Diamond connecting Midpoints */}
          <polygon
            points="250,10 490,250 250,490 10,250"
            fill="#12163b"
            stroke="#3858f6"
            strokeWidth="2"
            strokeOpacity="0.8"
          />

          {/* Lagna (Ascendant) Indicator Badge in House 1 */}
          <g>
            <rect x="232" y="30" width="36" height="18" rx="4" fill="#00d2ff" />
            <text x="250" y="43" fill="#0b0e29" fontSize="10" fontWeight="black" textAnchor="middle">
              Asc
            </text>
          </g>

          {/* Render House Labels & Occupying Planets */}
          {housesMap.map((hInfo) => {
            const pos = houseLabelPositions[hInfo.house]
            if (!pos) return null

            return (
              <g key={`h-${hInfo.house}`}>
                {/* Rashi Number */}
                <text
                  x={pos.rashi.x}
                  y={pos.rashi.y}
                  fill="#7b82b8"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {hInfo.rashiNumber}
                </text>

                {/* Occupying Planets */}
                <g transform={`translate(${pos.body.x}, ${pos.body.y})`}>
                  {hInfo.planets.map((p, pIdx) => {
                    const yOffset = (pIdx - (hInfo.planets.length - 1) / 2) * 16
                    const isRetro = p.is_retrograde

                    return (
                      <text
                        key={p.id}
                        x="0"
                        y={yOffset}
                        fill={p.color || '#ffffff'}
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {p.glyph} {p.name.slice(0, 2)}
                        {isRetro && <tspan fill="#f59e0b" fontSize="9"> (R)</tspan>}
                      </text>
                    )
                  })}
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="text-[11px] font-mono text-[#7b82b8] mt-3 text-center">
        North Indian Diamond Chart &bull; Fixed House 1 at Top &bull; Numbers indicate Rashis (1=Aries ... 12=Pisces)
      </div>
    </div>
  )
}

const NorthIndianChart = memo(NorthIndianChartComponent, (prevProps, nextProps) => {
  return prevProps.vedicData?.meta?.ayanamsha_degrees === nextProps.vedicData?.meta?.ayanamsha_degrees &&
         prevProps.vedicData?.lagna?.longitude === nextProps.vedicData?.lagna?.longitude
})

export default NorthIndianChart
