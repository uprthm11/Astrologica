import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InteractiveBubble({
  title,
  subtitle,
  icon: Icon,
  summary,
  details,
  glowColor = 'rgba(6, 182, 212, 0.6)', // default cyan
  iconColor = 'text-cyan-400',
  defaultExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const glowFilter = { filter: `drop-shadow(0 0 16px ${glowColor})` }

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(160, 200, 255, 0.12)',
        borderRadius: '1rem',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      className="p-5 w-full text-left space-y-3 transition-colors hover:border-blue-200/30"
    >
      {/* ── Header Row ── */}
      <motion.div layout="position" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div style={glowFilter} className={`${iconColor} flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            {subtitle && (
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-200/40">
                {subtitle}
              </div>
            )}
            <div className="text-base font-light text-white tracking-wider">
              {title}
            </div>
          </div>
        </div>

        {/* Expand / Collapse Indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-blue-200/40 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Summary Line (shown when collapsed or as intro) ── */}
      {summary && (
        <motion.div layout="position" className="text-xs font-light text-white/75 leading-relaxed">
          {summary}
        </motion.div>
      )}

      {/* ── Deep Dive Details (Expanded on Click) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-blue-200/10 pt-3 space-y-2 text-xs font-light text-blue-100/90 leading-relaxed"
          >
            {typeof details === 'string' ? <p>{details}</p> : details}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
