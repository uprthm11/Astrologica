import React from 'react'
import { motion } from 'framer-motion'

export default function VimshottariTimeline({ dashaData }) {
  if (!dashaData || !dashaData.timeline) return null

  const { timeline = [], birth_nakshatra_lord, current_mahadasha } = dashaData

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/20 backdrop-blur-xl shadow-xl text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
            Vimshottari Dasha System (120-Year Cycle)
          </div>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            Planetary Operating Periods
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-mono text-indigo-300">
          Birth Lord: <span className="font-bold text-amber-300">{birth_nakshatra_lord}</span>
        </div>
      </div>

      {/* Active Current Dasha Highlight Card */}
      {current_mahadasha && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/40 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-black text-indigo-200 text-lg">
              🪐
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                Currently Active Mahadasha
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {current_mahadasha.lord} Mahadasha
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-300">
              {current_mahadasha.start_date} &rarr; {current_mahadasha.end_date}
            </div>
            <div className="text-[11px] text-indigo-300 font-semibold mt-0.5">
              Duration: {current_mahadasha.duration_years} Years
            </div>
          </div>
        </div>
      )}

      {/* 9 Mahadasha Sequence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {timeline.map((d, idx) => {
          const isActive = d.is_active

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-indigo-950/70 border-indigo-400 shadow-md shadow-indigo-900/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold ${
                    isActive ? 'text-indigo-200' : 'text-slate-300'
                  }`}
                >
                  {idx + 1}. {d.lord}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {d.start_date.slice(0, 4)} &ndash; {d.end_date.slice(0, 4)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {d.duration_years} yrs
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
