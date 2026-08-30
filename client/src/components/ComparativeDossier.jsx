import React from 'react'
import { motion } from 'framer-motion'

export default function ComparativeDossier({ dualData }) {
  if (!dualData || !dualData.comparison) return null

  const { comparison, western, vedic } = dualData
  const { sun_comparison, moon_comparison, ascendant_comparison, precession_shift_degrees, ayanamsha_used } = comparison

  return (
    <div className="w-full space-y-6 text-left">
      {/* Precession Shift Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-900/60 border border-purple-500/30 rounded-full">
            ✦ Axial Precession Delta: ~{roundNum(precession_shift_degrees)}°
          </div>
          <span className="text-xs font-mono text-slate-400">
            Ayanamsha: <strong className="text-purple-200">{ayanamsha_used}</strong>
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Why Does Your Zodiac Sign Shift?
        </h3>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Due to the slow wobble of the Earth’s rotational axis (taking 25,772 years per cycle), the Vernal Equinox point drifts backward relative to the starry backdrop at ~50.3 arcseconds per year. 
          <strong> Western (Tropical)</strong> astrology fixes 0° Aries to the Vernal Equinox (Earth's seasonal cycle), whereas <strong>Vedic (Sidereal / Jyotish)</strong> astrology anchors to the actual visible constellations (the 27 Nakshatras).
        </p>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sun Comparison Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ☀️ Sun (Core Self)
            </span>
            {sun_comparison.has_sign_shifted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sign Shifted
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Western Tropical</div>
              <div className="text-base font-bold text-amber-200">{sun_comparison.tropical_sign}</div>
              <div className="text-[11px] font-mono text-slate-400">{sun_comparison.tropical_degree}°</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Vedic Sidereal (Surya)</div>
              <div className="text-base font-bold text-purple-200">
                {sun_comparison.sanskrit_rashi} ({sun_comparison.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {sun_comparison.sidereal_degree}° &bull; {sun_comparison.nakshatra} (P{sun_comparison.pada})
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-snug pt-1">
              {sun_comparison.explanation}
            </p>
          </div>
        </motion.div>

        {/* Moon Comparison Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              🌙 Moon (Emotional Mind)
            </span>
            {moon_comparison.has_sign_shifted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sign Shifted
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Western Tropical</div>
              <div className="text-base font-bold text-indigo-200">{moon_comparison.tropical_sign}</div>
              <div className="text-[11px] font-mono text-slate-400">{moon_comparison.tropical_degree}°</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Vedic Sidereal (Chandra)</div>
              <div className="text-base font-bold text-cyan-200">
                {moon_comparison.sanskrit_rashi} ({moon_comparison.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {moon_comparison.sidereal_degree}° &bull; {moon_comparison.nakshatra} (P{moon_comparison.pada})
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-snug pt-1">
              {moon_comparison.explanation}
            </p>
          </div>
        </motion.div>

        {/* Ascendant Comparison Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              🌅 Ascendant / Lagna (Persona)
            </span>
            {ascendant_comparison.has_sign_shifted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Sign Shifted
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Western Ascendant</div>
              <div className="text-base font-bold text-purple-200">{ascendant_comparison.tropical_sign}</div>
              <div className="text-[11px] font-mono text-slate-400">{ascendant_comparison.tropical_degree}°</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Vedic Lagna</div>
              <div className="text-base font-bold text-emerald-200">
                {ascendant_comparison.sanskrit_rashi} ({ascendant_comparison.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {ascendant_comparison.sidereal_degree}° &bull; {ascendant_comparison.nakshatra} (P{ascendant_comparison.pada})
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-snug pt-1">
              Your rising sign defines how your consciousness interfaces with the world in both systems.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dual Paradigm Synthesis Summary */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Western Tropical Dimension
          </div>
          <p className="text-slate-400 leading-relaxed">
            Reflects your psychological character, conscious personality traits, ego drive, and immediate seasonal lifepath orientation.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Vedic Sidereal Dimension
          </div>
          <p className="text-slate-400 leading-relaxed">
            Reflects your karmic momentum, soul evolution, Nakshatra subconscious drivers, and planetary operating periods (Dashas).
          </p>
        </div>
      </div>
    </div>
  )
}

function roundNum(num) {
  return typeof num === 'number' ? num.toFixed(2) : num
}
