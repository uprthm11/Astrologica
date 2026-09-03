import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CognitiveStack({ cognitiveStack }) {
  const [showShadow, setShowShadow] = useState(false)

  if (!cognitiveStack || !cognitiveStack.primary_stack) return null

  const { primary_stack = [], shadow_stack = [] } = cognitiveStack

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a63] pb-2 mb-3">
        <div>
          <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">
            Jungian Cognitive Architecture (Beebe 8-Function Model)
          </h4>
          <span className="text-[11px] text-[#7b82b8] font-mono">Conscious Ego & Unconscious Shadow</span>
        </div>

        <button
          onClick={() => setShowShadow(!showShadow)}
          className="btn-secondary text-xs"
        >
          <span>{showShadow ? 'Hide Shadow Stack' : '✦ Reveal 4 Shadow Functions'}</span>
        </button>
      </div>

      {/* Primary Conscious Stack (4 Functions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {primary_stack.map((fn) => (
          <motion.div
            key={fn.code}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl bg-[#101336] border border-[#262a63] shadow-md flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00d2ff] bg-[#161942] px-2 py-0.5 rounded-md border border-[#262a63]">
                  {fn.archetype}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: fn.color || '#3858f6' }}>
                  {fn.attitude}
                </span>
              </div>

              {/* Title & Glyph */}
              <div className="flex items-center gap-2.5 my-1.5">
                <span className="text-2xl">{fn.glyph}</span>
                <div>
                  <div className="text-base font-bold text-white">
                    {fn.name} <span className="font-mono text-xs text-[#00d2ff]">({fn.code})</span>
                  </div>
                  <div className="text-[11px] text-[#7b82b8] font-mono">{fn.process}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#c5c9f5] mt-2 leading-relaxed">
                {fn.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#262a63] text-[10px] text-[#7b82b8] italic">
              &bull; {fn.role}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expandable Shadow Stack (4 Unconscious Functions) */}
      <AnimatePresence>
        {showShadow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 pt-2 overflow-hidden"
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#7b82b8] pl-1">
              Shadow Archetypes (Unconscious Defensive Stack)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shadow_stack.map((fn) => (
                <div
                  key={fn.code}
                  className="p-3.5 rounded-xl bg-[#0d1033] border border-[#262a63] shadow-inner flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#7b82b8] bg-[#161942] px-2 py-0.5 rounded-md border border-[#262a63]">
                        {fn.archetype}
                      </span>
                      <span className="text-[11px] font-mono text-[#00d2ff] font-semibold">
                        {fn.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-1">
                      <span className="text-xl">{fn.glyph}</span>
                      <div className="text-sm font-bold text-white">{fn.name}</div>
                    </div>

                    <p className="text-[11px] text-[#9aa0cf] mt-1 leading-snug">
                      {fn.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#262a63] text-[10px] text-[#7b82b8] italic">
                    &bull; {fn.role}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
