import React from 'react'
import { motion } from 'framer-motion'

function roundNum(num) {
  return typeof num === 'number' ? num.toFixed(2) : num
}

export default function ComparativeDossier({ comparisonData }) {
  if (!comparisonData) return null

  const { sun_comparison, moon_comparison, ascendant_comparison, precession_shift_degrees, ayanamsha_used } = comparisonData

  return (
    <div className="w-full space-y-6 text-left">
      {/* Precession Shift Banner */}
      <div className="dashboard-card p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">
            ✦ Axial Precession Delta: ~{roundNum(precession_shift_degrees)}°
          </div>
          <span className="text-xs font-mono text-[#7b82b8]">
            Ayanamsha: <strong className="text-[#00d2ff]">{ayanamsha_used}</strong>
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Equinoctial Precession & Dual Spectrum Architecture
        </h3>
        <p className="text-sm text-[#c5c9f5] leading-relaxed">
          Due to the axial precession of Earth (25,772-year cycle), the Vernal Equinox drifts at ~50.3 arcsec/yr. 
          <strong className="text-[#00d2ff]"> Western (Tropical)</strong> astrology fixes 0° Aries to the Vernal Equinox (Earth's seasonal arc), whereas <strong className="text-[#3858f6]">Vedic (Sidereal / Jyotish)</strong> astrology anchors directly to the stellar constellations (27 Nakshatras).
        </p>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sun Comparison Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="dashboard-card p-5 text-left space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#262a63] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ☀️ Sun (Core Self)
            </span>
            {sun_comparison?.has_sign_shifted ? (
              <span className="badge-status bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Sign Shifted
              </span>
            ) : (
              <span className="badge-status bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Western Tropical</div>
              <div className="text-base font-bold text-amber-200">{sun_comparison?.tropical_sign}</div>
              <div className="text-[11px] font-mono text-[#7b82b8]">{sun_comparison?.tropical_degree}°</div>
            </div>

            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Vedic Sidereal (Surya)</div>
              <div className="text-base font-bold text-[#00d2ff]">
                {sun_comparison?.sanskrit_rashi} ({sun_comparison?.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-[#7b82b8]">
                {sun_comparison?.sidereal_degree}° &bull; {sun_comparison?.nakshatra} (P{sun_comparison?.pada})
              </div>
            </div>

            <p className="text-xs text-[#9aa0cf] leading-snug pt-1">
              {sun_comparison?.explanation}
            </p>
          </div>
        </motion.div>

        {/* Moon Comparison Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="dashboard-card p-5 text-left space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#262a63] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00d2ff]">
              🌙 Moon (Emotional Mind)
            </span>
            {moon_comparison?.has_sign_shifted ? (
              <span className="badge-status bg-[#3858f6]/15 text-[#00d2ff] border border-[#3858f6]/40">
                Sign Shifted
              </span>
            ) : (
              <span className="badge-status bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Western Tropical</div>
              <div className="text-base font-bold text-white">{moon_comparison?.tropical_sign}</div>
              <div className="text-[11px] font-mono text-[#7b82b8]">{moon_comparison?.tropical_degree}°</div>
            </div>

            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Vedic Sidereal (Chandra)</div>
              <div className="text-base font-bold text-[#00d2ff]">
                {moon_comparison?.sanskrit_rashi} ({moon_comparison?.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-[#7b82b8]">
                {moon_comparison?.sidereal_degree}° &bull; {moon_comparison?.nakshatra} (P{moon_comparison?.pada})
              </div>
            </div>

            <p className="text-xs text-[#9aa0cf] leading-snug pt-1">
              {moon_comparison?.explanation}
            </p>
          </div>
        </motion.div>

        {/* Ascendant Comparison Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="dashboard-card p-5 text-left space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#262a63] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3858f6]">
              🌅 Ascendant / Lagna
            </span>
            {ascendant_comparison?.has_sign_shifted ? (
              <span className="badge-status bg-[#3858f6]/15 text-[#00d2ff] border border-[#3858f6]/40">
                Sign Shifted
              </span>
            ) : (
              <span className="badge-status bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Same Sign
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Western Ascendant</div>
              <div className="text-base font-bold text-white">{ascendant_comparison?.tropical_sign}</div>
              <div className="text-[11px] font-mono text-[#7b82b8]">{ascendant_comparison?.tropical_degree}°</div>
            </div>

            <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63]">
              <div className="text-[10px] font-mono uppercase text-[#7b82b8]">Vedic Lagna</div>
              <div className="text-base font-bold text-[#10b981]">
                {ascendant_comparison?.sanskrit_rashi} ({ascendant_comparison?.sidereal_rashi})
              </div>
              <div className="text-[11px] font-mono text-[#7b82b8]">
                {ascendant_comparison?.sidereal_degree}° &bull; {ascendant_comparison?.nakshatra} (P{ascendant_comparison?.pada})
              </div>
            </div>

            <p className="text-xs text-[#9aa0cf] leading-snug pt-1">
              Your rising sign defines how your consciousness interfaces with the outer world.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dual Paradigm Synthesis Summary */}
      <div className="dashboard-card p-6 text-xs text-[#c5c9f5] grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-wider">
            Western Tropical Dimension
          </div>
          <p className="text-[#9aa0cf] leading-relaxed">
            Reflects your psychological character, conscious personality traits, ego drive, and immediate seasonal lifepath orientation.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#3858f6] uppercase tracking-wider">
            Vedic Sidereal Dimension
          </div>
          <p className="text-[#9aa0cf] leading-relaxed">
            Reflects your karmic momentum, soul evolution, Nakshatra subconscious drivers, and planetary operating periods (Dashas).
          </p>
        </div>
      </div>
    </div>
  )
}
