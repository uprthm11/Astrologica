import React from 'react'
import { motion } from 'framer-motion'

const CLARITY_BAND_COLORS = {
  'Very Clear': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Clear: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Moderate: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Slight: 'bg-slate-700/40 text-slate-300 border-slate-600'
}

export default function ClarityBars({ preferenceClarity }) {
  if (!preferenceClarity) return null

  const axes = [
    {
      key: 'EI',
      label: 'Energy Orientation',
      left: { trait: 'Extraversion', letter: 'E', color: 'from-amber-500 to-orange-500' },
      right: { trait: 'Introversion', letter: 'I', color: 'from-purple-500 to-indigo-500' },
      data: preferenceClarity.EI
    },
    {
      key: 'SN',
      label: 'Information Processing',
      left: { trait: 'Sensing', letter: 'S', color: 'from-emerald-500 to-teal-500' },
      right: { trait: 'Intuition', letter: 'N', color: 'from-cyan-500 to-blue-500' },
      data: preferenceClarity.SN
    },
    {
      key: 'TF',
      label: 'Decision Making',
      left: { trait: 'Thinking', letter: 'T', color: 'from-blue-500 to-indigo-500' },
      right: { trait: 'Feeling', letter: 'F', color: 'from-rose-500 to-pink-500' },
      data: preferenceClarity.TF
    },
    {
      key: 'JP',
      label: 'Lifestyle & Execution',
      left: { trait: 'Judging', letter: 'J', color: 'from-purple-500 to-fuchsia-500' },
      right: { trait: 'Perceiving', letter: 'P', color: 'from-amber-500 to-yellow-500' },
      data: preferenceClarity.JP
    }
  ]

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Preference Clarity Index (PCI)
        </h4>
        <span className="text-[11px] font-mono text-slate-500">Bipolar Dimension Splits</span>
      </div>

      <div className="space-y-4">
        {axes.map((axis) => {
          if (!axis.data) return null
          const { preferred_letter, percentages, clarity_band, pci_score } = axis.data
          const leftPct = percentages[axis.left.letter] || 50
          const rightPct = percentages[axis.right.letter] || 50

          const isLeftPreferred = preferred_letter === axis.left.letter

          return (
            <div
              key={axis.key}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">{axis.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    CLARITY_BAND_COLORS[clarity_band] || CLARITY_BAND_COLORS.Moderate
                  }`}
                >
                  {clarity_band} (PCI: {pci_score})
                </span>
              </div>

              {/* Labels & Percentages */}
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span
                  className={`flex items-center gap-1 ${
                    isLeftPreferred ? 'font-bold text-amber-300' : 'text-slate-500'
                  }`}
                >
                  <span>{axis.left.letter}</span>
                  <span>&bull; {axis.left.trait}</span>
                  <span>({leftPct}%)</span>
                </span>

                <span
                  className={`flex items-center gap-1 ${
                    !isLeftPreferred ? 'font-bold text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  <span>({rightPct}%)</span>
                  <span>{axis.right.trait} &bull;</span>
                  <span>{axis.right.letter}</span>
                </span>
              </div>

              {/* Bipolar Bar */}
              <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 flex overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leftPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-l-full bg-gradient-to-r ${axis.left.color} ${
                    isLeftPreferred ? 'opacity-100 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'opacity-40'
                  }`}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rightPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-r-full bg-gradient-to-r ${axis.right.color} ${
                    !isLeftPreferred ? 'opacity-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'opacity-40'
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
