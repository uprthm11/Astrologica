import React from 'react'

export default function PlanetaryMatrix({ planets = [], isVedic = false }) {
  if (!planets || planets.length === 0) return null

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-[#161942] border border-[#262a63] backdrop-blur-xl shadow-xl">
      <table className="w-full text-left text-xs text-[#c5c9f5]">
        <thead className="bg-[#101336] text-[10px] uppercase font-mono font-bold text-[#7b82b8] border-b border-[#262a63] tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Body</th>
            <th className="px-4 py-3.5">{isVedic ? 'Rashi & Degree' : 'Sign & Degree'}</th>
            <th className="px-4 py-3.5">{isVedic ? 'Bhava' : 'House'}</th>
            {isVedic && <th className="px-4 py-3.5">Nakshatra & Pada</th>}
            {isVedic && <th className="px-4 py-3.5">Navamsha (D9)</th>}
            <th className="px-4 py-3.5">Planetary State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262a63]/60 font-medium">
          {planets.map((p) => {
            const signText = isVedic
              ? `${p.sanskrit_rashi || p.rashi} (${p.rashi})`
              : `${p.sign}`

            return (
              <tr
                key={p.id}
                className="hover:bg-[#1c2154] transition-colors duration-150"
              >
                {/* Planet Name & Glyph */}
                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2.5">
                  <span
                    className="text-base font-bold w-6 h-6 rounded-lg bg-[#101336] border border-[#262a63] flex items-center justify-center shrink-0 shadow-sm"
                    style={{ color: p.color || '#00d2ff' }}
                  >
                    {p.glyph}
                  </span>
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    {isVedic && p.vedic_name && (
                      <div className="text-[10px] text-[#7b82b8] font-mono">
                        {p.vedic_name}
                      </div>
                    )}
                  </div>
                </td>

                {/* Sign & Degree */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[#00d2ff] font-semibold">
                    <span>{p.sign_glyph || p.rashi_glyph}</span>
                    <span>{signText}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#7b82b8] mt-0.5">
                    {p.dms || `${p.degrees}°`}
                  </div>
                </td>

                {/* House / Bhava */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#101336] border border-[#262a63] font-mono text-[11px] text-[#3858f6] font-bold">
                    {isVedic ? `H${p.bhava}` : `H${p.house}`}
                  </span>
                </td>

                {/* Nakshatra & Pada (Vedic) */}
                {isVedic && (
                  <td className="px-4 py-3">
                    {p.nakshatra ? (
                      <div>
                        <div className="text-white font-semibold">
                          {p.nakshatra.name}{' '}
                          <span className="text-amber-400 text-[10px] font-mono">
                            (P{p.nakshatra.pada})
                          </span>
                        </div>
                        <div className="text-[10px] text-[#7b82b8] font-mono">
                          {p.nakshatra.lord_formatted}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#6b729f]">-</span>
                    )}
                  </td>
                )}

                {/* Navamsha D9 (Vedic) */}
                {isVedic && (
                  <td className="px-4 py-3">
                    {p.navamsha_d9 ? (
                      <div className="text-[#00d2ff] font-medium font-mono">
                        {p.navamsha_d9.glyph} {p.navamsha_d9.sanskrit}
                      </div>
                    ) : (
                      <span className="text-[#6b729f]">-</span>
                    )}
                  </td>
                )}

                {/* State Badges */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {p.is_retrograde && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                        Rx (Retrograde)
                      </span>
                    )}
                    {p.is_combust && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold">
                        Combust
                      </span>
                    )}
                    {p.dignity && p.dignity.startsWith('Exalted') && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                        Exalted (Uchcha)
                      </span>
                    )}
                    {p.dignity && p.dignity.startsWith('Debilitated') && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-bold">
                        Debilitated (Neecha)
                      </span>
                    )}
                    {p.dignity && p.dignity.startsWith('Own') && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-[#00d2ff] text-[10px] font-bold">
                        Own Sign
                      </span>
                    )}
                    {!p.is_retrograde && !p.is_combust && (!p.dignity || p.dignity === 'Neutral') && (
                      <span className="text-[#6b729f] text-[11px] font-mono">Direct / Neutral</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
