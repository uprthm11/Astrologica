import React from 'react'
import { motion } from 'framer-motion'

const CLARITY_BAND_COLORS = {
  'Very Clear': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Clear: 'bg-[#3858f6]/15 text-[#00d2ff] border-[#3858f6]/40',
  Moderate: 'bg-[#3858f6]/10 text-[#9aa0cf] border-[#262a63]',
  Slight: 'bg-[#101336] text-[#7b82b8] border-[#262a63]'
}

export default function ClarityBars({ preferenceClarity }) {
  if (!preferenceClarity) return null

  const axes = [
    {
      key: 'EI',
      label: 'Energy Orientation',
      left: { trait: 'Extraversion', letter: 'E', color: 'from-[#f97316] to-[#fb923c]' },
      right: { trait: 'Introversion', letter: 'I', color: 'from-[#3858f6] to-[#00d2ff]' },
      data: preferenceClarity.EI
    },
    {
      key: 'SN',
      label: 'Information Processing',
      left: { trait: 'Sensing', letter: 'S', color: 'from-emerald-500 to-teal-400' },
      right: { trait: 'Intuition', letter: 'N', color: 'from-[#00d2ff] to-[#3858f6]' },
      data: preferenceClarity.SN
    },
    {
      key: 'TF',
      label: 'Decision Making',
      left: { trait: 'Thinking', letter: 'T', color: 'from-[#3858f6] to-indigo-400' },
      right: { trait: 'Feeling', letter: 'F', color: 'from-rose-500 to-pink-400' },
      data: preferenceClarity.TF
    },
    {
      key: 'JP',
      label: 'Lifestyle & Execution',
      left: { trait: 'Judging', letter: 'J', color: 'from-purple-500 to-indigo-500' },
      right: { trait: 'Perceiving', letter: 'P', color: 'from-amber-500 to-yellow-400' },
      data: preferenceClarity.JP
    }
  ]

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[#262a63] pb-2 mb-3">
        <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">
          Preference Clarity Index (PCI)
        </h4>
        <span className="text-[11px] font-mono text-[#7b82b8]">Bipolar Dimension Splits</span>
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
              className="p-3.5 rounded-xl bg-[#101336] border border-[#262a63] shadow-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-white">{axis.label}</span>
                <span
                  className={`badge-status ${
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
                    isLeftPreferred ? 'font-bold text-amber-300' : 'text-[#7b82b8]'
                  }`}
                >
                  <span>{axis.left.letter}</span>
                  <span>&bull; {axis.left.trait}</span>
                  <span>({leftPct}%)</span>
                </span>

                <span
                  className={`flex items-center gap-1 ${
                    !isLeftPreferred ? 'font-bold text-[#00d2ff]' : 'text-[#7b82b8]'
                  }`}
                >
                  <span>({rightPct}%)</span>
                  <span>{axis.right.trait} &bull;</span>
                  <span>{axis.right.letter}</span>
                </span>
              </div>

              {/* Bipolar Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#0b0e29] p-0.5 flex overflow-hidden border border-[#262a63]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leftPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-l-full bg-gradient-to-r ${axis.left.color} ${
                    isLeftPreferred ? 'opacity-100 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'opacity-30'
                  }`}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rightPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-r-full bg-gradient-to-r ${axis.right.color} ${
                    !isLeftPreferred ? 'opacity-100 shadow-[0_0_10px_rgba(0,210,255,0.3)]' : 'opacity-30'
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
