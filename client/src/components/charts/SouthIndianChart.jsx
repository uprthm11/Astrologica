import React, { useState } from 'react'

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

export default function SouthIndianChart({ vedicData }) {
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
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            chartType === 'D1'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Rashi Chart (D1)
        </button>
        <button
          onClick={() => setChartType('D9')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            chartType === 'D9'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Navamsha Chart (D9)
        </button>
      </div>

      <div className="relative w-full max-w-[480px] aspect-square p-2">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]"
        >
          {/* Outer Border */}
          <rect
            x="20"
            y="20"
            width="460"
            height="460"
            className="fill-slate-950/90 stroke-indigo-500/40 stroke-2"
          />

          {/* Central Void */}
          <rect
            x="135"
            y="135"
            width="230"
            height="230"
            className="fill-slate-900/60 stroke-indigo-500/30 stroke-1"
          />

          {/* Center Brand Text */}
          <text
            x="250"
            y="245"
            textAnchor="middle"
            className="fill-indigo-300 font-bold text-sm select-none"
          >
            {chartType === 'D1' ? 'RASHI (D1)' : 'NAVAMSHA (D9)'}
          </text>
          <text
            x="250"
            y="265"
            textAnchor="middle"
            className="fill-slate-500 font-mono text-[10px] select-none"
          >
            South Indian Format
          </text>

          {/* 12 Sign Boxes */}
          {Object.entries(SIGN_BOX_POSITIONS).map(([sName, pos]) => {
            const bx = offset + pos.col * boxSize
            const by = offset + pos.row * boxSize
            const isLagna = sName === lagnaRashiName
            const occupants = planetsBySign[sName] || []

            return (
              <g key={sName}>
                {/* Box Boundary */}
                <rect
                  x={bx}
                  y={by}
                  width={boxSize}
                  height={boxSize}
                  className="fill-transparent stroke-indigo-500/30 stroke-1"
                />

                {/* Sign Label (Top-Left of Box) */}
                <text
                  x={bx + 6}
                  y={by + 14}
                  className="fill-slate-500 font-mono text-[9px] uppercase font-bold select-none"
                >
                  {sName.slice(0, 3)}
                </text>

                {/* Lagna Marker if applicable */}
                {isLagna && (
                  <g>
                    <line
                      x1={bx}
                      y1={by}
                      x2={bx + 30}
                      y2={by + 30}
                      className="stroke-amber-400 stroke-2"
                    />
                    <text
                      x={bx + boxSize - 6}
                      y={by + 14}
                      textAnchor="end"
                      className="fill-amber-400 font-bold text-[10px] select-none"
                    >
                      ASC
                    </text>
                  </g>
                )}

                {/* Occupying Planets */}
                <g transform={`translate(${bx + 12}, ${by + 32})`}>
                  {occupants.map((p, pIdx) => (
                    <text
                      key={p.id}
                      x={0}
                      y={pIdx * 14}
                      fill={p.color || '#e0e7ff'}
                      className="text-[11px] font-semibold select-none font-sans"
                    >
                      {p.name.slice(0, 2)}
                      {p.is_retrograde ? '(R)' : ''}
                      <tspan className="fill-slate-400 font-mono text-[9px] ml-1">
                        {' '}
                        {Math.floor(p.degrees)}°
                      </tspan>
                    </text>
                  ))}
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-[11px] text-slate-500 mt-2">
        South Indian Square Format &bull; Signs are Fixed Clockwise &bull; 'ASC' marks the Ascendant (Lagna)
      </p>
    </div>
  )
}
