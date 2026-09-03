import React, { useState, memo } from 'react'

const SIGN_BOX_POSITIONS = {
  Pisces: { row: 0, col: 0, name: 'Pisces', rashiNum: 12 },
  Aries: { row: 0, col: 1, name: 'Aries', rashiNum: 1 },
  Taurus: { row: 0, col: 2, name: 'Taurus', rashiNum: 2 },
  Gemini: { row: 0, col: 3, name: 'Gemini', rashiNum: 3 },
  Cancer: { row: 1, col: 3, name: 'Cancer', rashiNum: 4 },
  Leo: { row: 2, col: 3, name: 'Leo', rashiNum: 5 },
  Virgo: { row: 3, col: 3, name: 'Virgo', rashiNum: 6 },
  Libra: { row: 3, col: 2, name: 'Libra', rashiNum: 7 },
  Scorpio: { row: 3, col: 1, name: 'Scorpio', rashiNum: 8 },
  Sagittarius: { row: 3, col: 0, name: 'Sagittarius', rashiNum: 9 },
  Capricorn: { row: 2, col: 0, name: 'Capricorn', rashiNum: 10 },
  Aquarius: { row: 1, col: 0, name: 'Aquarius', rashiNum: 11 }
}

function SouthIndianChartComponent({ vedicData }) {
  const [chartType, setChartType] = useState('D1') // 'D1' | 'D9'

  if (!vedicData || !vedicData.planets || !vedicData.lagna) return null

  const { planets = [], lagna } = vedicData

  // Lagna Rashi Name for current chart
  const lagnaRashiName = chartType === 'D1' ? lagna.rashi : lagna.navamsha_d9.sign

  // Group planets by sign
  const planetsBySign = {}
  Object.keys(SIGN_BOX_POSITIONS).forEach((sName) => {
    planetsBySign[sName] = []
  })

  planets.forEach((p) => {
    const signName = chartType === 'D1' ? p.rashi : p.navamsha_d9.sign
    if (planetsBySign[signName]) {
      planetsBySign[signName].push(p)
    }
  })

  const boxSize = 115
  const offset = 20

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toggle */}
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

      <div className="relative w-full max-w-[500px] aspect-square">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl select-none">
          {/* Outer Grid 4x4 */}
          <rect x={offset} y={offset} width={boxSize * 4} height={boxSize * 4} fill="#0d1033" stroke="#262a63" strokeWidth="2" />

          {/* Central Void (2x2 center) */}
          <rect
            x={offset + boxSize}
            y={offset + boxSize}
            width={boxSize * 2}
            height={boxSize * 2}
            fill="#101336"
            stroke="#262a63"
            strokeWidth="1.5"
          />
          <text
            x={offset + boxSize * 2}
            y={offset + boxSize * 2 - 8}
            fill="#00d2ff"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            ✦ South Indian
          </text>
          <text
            x={offset + boxSize * 2}
            y={offset + boxSize * 2 + 14}
            fill="#7b82b8"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            Fixed Zodiac (Aries Top-2)
          </text>

          {/* 12 Zodiac Sign Boxes */}
          {Object.entries(SIGN_BOX_POSITIONS).map(([sName, pos]) => {
            const x = offset + pos.col * boxSize
            const y = offset + pos.row * boxSize
            const pList = planetsBySign[sName] || []
            const isLagna = sName === lagnaRashiName

            return (
              <g key={sName}>
                {/* Box Boundary */}
                <rect
                  x={x}
                  y={y}
                  width={boxSize}
                  height={boxSize}
                  fill={isLagna ? '#161942' : '#0d1033'}
                  stroke="#262a63"
                  strokeWidth="1"
                />

                {/* Sign Label & Rashi Number */}
                <text
                  x={x + 8}
                  y={y + 16}
                  fill="#6b729f"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {sName.slice(0, 3)}
                </text>

                {/* Lagna / ASC Indicator in Box */}
                {isLagna && (
                  <g>
                    <rect x={x + boxSize - 32} y={y + 6} width="26" height="14" rx="3" fill="#00d2ff" />
                    <text
                      x={x + boxSize - 19}
                      y={y + 16.5}
                      fill="#0b0e29"
                      fontSize="8.5"
                      fontWeight="black"
                      textAnchor="middle"
                    >
                      Asc
                    </text>
                  </g>
                )}

                {/* Planets inside Box */}
                <g transform={`translate(${x + boxSize / 2}, ${y + 36})`}>
                  {pList.map((p, pIdx) => {
                    const yOff = pIdx * 15
                    const isRetro = p.is_retrograde
                    return (
                      <text
                        key={p.id}
                        x="0"
                        y={yOff}
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
        South Indian Square Chart &bull; Fixed Sign Boxes &bull; Traverses Clockwise from Pisces (Top Left)
      </div>
    </div>
  )
}

const SouthIndianChart = memo(SouthIndianChartComponent, (prevProps, nextProps) => {
  return prevProps.vedicData?.meta?.ayanamsha_degrees === nextProps.vedicData?.meta?.ayanamsha_degrees &&
         prevProps.vedicData?.lagna?.longitude === nextProps.vedicData?.lagna?.longitude
})

export default SouthIndianChart
