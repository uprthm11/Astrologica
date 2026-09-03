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
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Controls: System Switcher & Settings Bar */}
      <div className="dashboard-card p-4 flex flex-wrap items-center justify-between gap-4">
        {/* System Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-[#101336] border border-[#262a63]">
          <button
            onClick={() => setActiveSystem('western')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'western'
                ? 'bg-[#3858f6] text-white shadow-md'
                : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            Western (Tropical)
          </button>
          <button
            onClick={() => setActiveSystem('vedic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'vedic'
                ? 'bg-[#3858f6] text-white shadow-md'
                : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            Vedic (Sidereal)
          </button>
          <button
            onClick={() => setActiveSystem('dual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSystem === 'dual'
                ? 'bg-gradient-to-r from-[#3858f6] to-[#00d2ff] text-white shadow-md'
                : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            ✦ Dual Comparison
          </button>
        </div>

        {/* Engine Settings (Ayanamsha & House System) */}
        <div className="flex flex-wrap items-center gap-3">
          {activeSystem !== 'western' && (
            <div className="flex items-center gap-1.5 text-xs text-[#9aa0cf]">
              <span className="text-[10px] uppercase font-mono font-bold text-[#7b82b8]">Ayanamsha:</span>
              <select
                value={currentAyanamsha}
                onChange={(e) => onSettingChange && onSettingChange('ayanamsha', e.target.value)}
                className="bg-[#101336] border border-[#262a63] text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#3858f6] cursor-pointer"
              >
                <option value="lahiri">Lahiri (Chitrapaksha)</option>
                <option value="raman">B.V. Raman</option>
                <option value="kp">KP (Krishnamurti)</option>
              </select>
            </div>
          )}

          {activeSystem !== 'vedic' && (
            <div className="flex items-center gap-1.5 text-xs text-[#9aa0cf]">
              <span className="text-[10px] uppercase font-mono font-bold text-[#7b82b8]">Houses:</span>
              <select
                value={currentHouseSystem}
                onChange={(e) => onSettingChange && onSettingChange('house_system', e.target.value)}
                className="bg-[#101336] border border-[#262a63] text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#3858f6] cursor-pointer"
              >
                <option value="placidus">Placidus</option>
                <option value="whole_sign">Whole Sign</option>
              </select>
            </div>
          )}

          {onRecalculate && (
            <button
              onClick={onRecalculate}
              className="btn-secondary text-xs"
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
            <div className="dashboard-card p-6 text-center space-y-4">
              <div className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">
                ☀️ Western Tropical Wheel Chart
              </div>
              <h3 className="text-xl font-black text-white">Geocentric Ecliptic Chart</h3>
              <p className="text-xs text-[#7b82b8]">
                House System: {western.house_system} &bull; Ascendant: {western.ascendant.formatted}
              </p>
              <WesternWheelChart westernData={western} />
            </div>

            {/* Planetary Placements Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7b82b8]">
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
            <div className="dashboard-card p-6 text-center space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a63] pb-3">
                <div className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">
                  🌙 Vedic Sidereal (Jyotish) Kundali
                </div>

                {/* Chart Style Toggle (North vs South Indian) */}
                <div className="inline-flex p-1 rounded-lg bg-[#101336] border border-[#262a63]">
                  <button
                    onClick={() => setVedicChartStyle('north')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      vedicChartStyle === 'north' ? 'bg-[#3858f6] text-white' : 'text-[#7b82b8]'
                    }`}
                  >
                    North Indian (Diamond)
                  </button>
                  <button
                    onClick={() => setVedicChartStyle('south')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      vedicChartStyle === 'south' ? 'bg-[#3858f6] text-white' : 'text-[#7b82b8]'
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
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7b82b8]">
                Sidereal Planetary Placements & Nakshatras
              </h4>
              <PlanetaryMatrix planets={vedic.planets} isVedic={true} />
            </div>

            {/* Vimshottari Dasha Timeline */}
            {vedic.vimshottari_dasha && (
              <div className="dashboard-card p-6">
                <VimshottariTimeline dashaData={vedic.vimshottari_dasha} />
              </div>
            )}
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
            {/* Comparative Dossier */}
            <ComparativeDossier comparisonData={comparison} />

            {/* Side-by-Side Planetary Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                    Western (Tropical)
                  </h4>
                  <span className="text-[10px] font-mono text-[#7b82b8]">
                    Placidus &bull; Geocentric
                  </span>
                </div>
                <PlanetaryMatrix planets={western.planets} isVedic={false} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3858f6]">
                    Vedic (Sidereal)
                  </h4>
                  <span className="text-[10px] font-mono text-[#7b82b8]">
                    {vedic.meta.ayanamsha} Ayanamsha
                  </span>
                </div>
                <PlanetaryMatrix planets={vedic.planets} isVedic={true} />
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="dashboard-card p-6 text-center space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Western Ecliptic Wheel
                </div>
                <WesternWheelChart westernData={western} />
              </div>

              <div className="dashboard-card p-6 text-center space-y-4">
                <div className="flex items-center justify-between border-b border-[#262a63] pb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Vedic Kundali
                  </span>
                  <div className="inline-flex p-0.5 rounded bg-[#101336] border border-[#262a63]">
                    <button
                      onClick={() => setVedicChartStyle('north')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                        vedicChartStyle === 'north' ? 'bg-[#3858f6] text-white' : 'text-[#7b82b8]'
                      }`}
                    >
                      North
                    </button>
                    <button
                      onClick={() => setVedicChartStyle('south')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                        vedicChartStyle === 'south' ? 'bg-[#3858f6] text-white' : 'text-[#7b82b8]'
                      }`}
                    >
                      South
                    </button>
                  </div>
                </div>
                {vedicChartStyle === 'north' ? (
                  <NorthIndianChart vedicData={vedic} />
                ) : (
                  <SouthIndianChart vedicData={vedic} />
                )}
              </div>
            </div>

            {/* Vimshottari Timeline */}
            {vedic.vimshottari_dasha && (
              <div className="dashboard-card p-6">
                <VimshottariTimeline dashaData={vedic.vimshottari_dasha} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
