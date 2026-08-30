import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CognitiveStack({ cognitiveStack }) {
  const [showShadow, setShowShadow] = useState(false)

  if (!cognitiveStack || !cognitiveStack.primary_stack) return null

  const { primary_stack = [], shadow_stack = [] } = cognitiveStack

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-3">
        <div>
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Jungian Cognitive Architecture (Beebe 8-Function Model)
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">Conscious Ego & Unconscious Shadow</span>
        </div>

        <button
          onClick={() => setShowShadow(!showShadow)}
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1.5"
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
            className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/30">
                  {fn.archetype}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: fn.color }}>
                  {fn.attitude}
                </span>
              </div>

              {/* Title & Glyph */}
              <div className="flex items-center gap-2.5 my-1.5">
                <span className="text-2xl">{fn.glyph}</span>
                <div>
                  <div className="text-base font-extrabold text-white">
                    {fn.name} <span className="font-mono text-xs text-purple-300">({fn.code})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{fn.process}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {fn.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 italic">
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
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
              Shadow Archetypes (Unconscious Defensive Stack)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shadow_stack.map((fn) => (
                <div
                  key={fn.code}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-900/40 shadow-inner flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        {fn.archetype}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-300 font-semibold">
                        {fn.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-1">
                      <span className="text-xl">{fn.glyph}</span>
                      <div className="text-sm font-bold text-slate-200">{fn.name}</div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {fn.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic">
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
