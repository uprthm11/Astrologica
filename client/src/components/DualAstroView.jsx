import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WesternWheelChart from './charts/WesternWheelChart'
import NorthIndianChart from './charts/NorthIndianChart'
import SouthIndianChart from './charts/SouthIndianChart'
import PlanetaryMatrix from './PlanetaryMatrix'
import VimshottariTimeline from './VimshottariTimeline'
import ComparativeDossier from './ComparativeDossier'

export default function DualAstroView({
  dualData,
  onRecalculate,
  onSettingChange,
  currentAyanamsha = 'lahiri',
  currentHouseSystem = 'placidus'
}) {
  const [activeSystem, setActiveSystem] = useState('dual') // 'western' | 'vedic' | 'dual'
  const [vedicChartStyle, setVedicChartStyle] = useState('north') // 'north' | 'south'

  if (!dualData || !dualData.western || !dualData.vedic) return null

  const { western, vedic, comparison } = dualData

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Controls: System Switcher & Settings Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* System Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => setActiveSystem('western')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'western'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Western (Tropical)
          </button>
          <button
            onClick={() => setActiveSystem('vedic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'vedic'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vedic (Sidereal)
          </button>
          <button
            onClick={() => setActiveSystem('dual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'dual'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✦ Dual Comparison
          </button>
        </div>

        {/* Engine Settings (Ayanamsha & House System) */}
        <div className="flex items-center gap-3">
          {activeSystem !== 'western' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[10px] uppercase font-bold text-slate-500">Ayanamsha:</span>
              <select
                value={currentAyanamsha}
                onChange={(e) => onSettingChange && onSettingChange('ayanamsha', e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="lahiri">Lahiri (Chitrapaksha)</option>
                <option value="raman">B.V. Raman</option>
                <option value="kp">KP (Krishnamurti)</option>
              </select>
            </div>
          )}

          {activeSystem !== 'vedic' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[10px] uppercase font-bold text-slate-500">Houses:</span>
              <select
                value={currentHouseSystem}
                onChange={(e) => onSettingChange && onSettingChange('house_system', e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="placidus">Placidus</option>
                <option value="whole_sign">Whole Sign</option>
              </select>
            </div>
          )}

          {onRecalculate && (
            <button
              onClick={onRecalculate}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Edit Birth Data
            </button>
          )}
        </div>
      </div>

      {/* --- Tab Content --- */}
      <AnimatePresence mode="wait">
        {/* WESTERN VIEW */}
        {activeSystem === 'western' && (
          <motion.div
            key="western-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-xl shadow-xl text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/60 border border-purple-500/30 rounded-full mb-3">
                ☀️ Western Tropical Wheel Chart
              </div>
              <h3 className="text-xl font-black text-white">Geocentric Ecliptic Chart</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                House System: {western.house_system} &bull; Ascendant: {western.ascendant.formatted}
              </p>
              <WesternWheelChart westernData={western} />
            </div>

            {/* Planetary Placements Table */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Tropical Planetary Placements
              </h4>
              <PlanetaryMatrix planets={western.planets} isVedic={false} />
            </div>
          </motion.div>
        )}

        {/* VEDIC VIEW */}
        {activeSystem === 'vedic' && (
          <motion.div
            key="vedic-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/20 backdrop-blur-xl shadow-xl text-center">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 rounded-full">
                  🌙 Vedic Sidereal (Jyotish) Kundali
                </div>

                {/* Chart Style Toggle (North vs South Indian) */}
                <div className="inline-flex p-1 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setVedicChartStyle('north')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      vedicChartStyle === 'north' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    North Indian (Diamond)
                  </button>
                  <button
                    onClick={() => setVedicChartStyle('south')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      vedicChartStyle === 'south' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    South Indian (Square)
                  </button>
                </div>
              </div>

              {vedicChartStyle === 'north' ? (
                <NorthIndianChart vedicData={vedic} />
              ) : (
                <SouthIndianChart vedicData={vedic} />
              )}
            </div>

            {/* Planetary Placements Table */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Sidereal Planetary Placements ({vedic.ayanamsha.name})
              </h4>
              <PlanetaryMatrix planets={vedic.planets} isVedic={true} />
            </div>

            {/* Vimshottari Dasha Periods */}
            <VimshottariTimeline dashaData={vedic.vimshottari_dashas} />
          </motion.div>
        )}

        {/* DUAL COMPARATIVE VIEW */}
        {activeSystem === 'dual' && (
          <motion.div
            key="dual-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Comparative Precession Breakdown */}
            <ComparativeDossier dualData={dualData} />

            {/* Dual Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Western Wheel */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/20 shadow-xl backdrop-blur-xl flex flex-col items-center">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                  Western Tropical Wheel
                </div>
                <WesternWheelChart westernData={western} />
              </div>

              {/* Vedic North Indian */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 shadow-xl backdrop-blur-xl flex flex-col items-center">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                  Vedic Sidereal Kundali
                </div>
                <NorthIndianChart vedicData={vedic} />
              </div>
            </div>

            {/* Complete Planetary Matrix (Vedic with Nakshatras & States) */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Sidereal Planetary Matrix & Dignities
              </h4>
              <PlanetaryMatrix planets={vedic.planets} isVedic={true} />
            </div>

            {/* Vimshottari Dasha Timeline */}
            <VimshottariTimeline dashaData={vedic.vimshottari_dashas} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
