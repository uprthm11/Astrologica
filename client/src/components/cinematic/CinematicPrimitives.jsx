import React from 'react'
import { motion } from 'framer-motion'

// ─── Slow drift-up entrance (used on headings/labels) ───────────────────────
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.7 } },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.2, duration: 1.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, transition: { duration: 0.5 } },
}

// ─── Primary CinematicButton — pure pulsating text, no background ────────────
// Matches the spec: tracking-widest, infinite slow star-pulse, glow on hover
export function CinematicButton({
  onClick,
  children,
  delay = 0,
  className = '',
  disabled = false,
}) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.45, 1, 0.45],
        transition: {
          delay,
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{
        opacity: 1,
        scale: 1.04,
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 18px rgba(200,220,255,0.9)' }}
      onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      className={`
        bg-transparent border-0 outline-none
        text-white/90 font-light
        text-sm tracking-[0.35em] uppercase
        disabled:opacity-30 select-none
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// ─── Ghost / secondary text button — same pulse, slightly dimmer base ────────
export function CinematicGhostButton({
  onClick,
  children,
  delay = 0,
  className = '',
}) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 0.75, 0.3],
        transition: {
          delay,
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{
        opacity: 1,
        scale: 1.04,
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 12px rgba(160,200,255,0.7)' }}
      onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
      className={`
        bg-transparent border-0 outline-none
        text-blue-200/70 font-light
        text-sm tracking-[0.3em] uppercase
        cursor-pointer select-none
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// ─── Cinematic text input — thin underline only, no box ──────────────────────
export function CinematicInput({
  value,
  onChange,
  placeholder,
  autoFocus,
  onKeyDown,
  type = 'text',
}) {
  return (
    <motion.input
      variants={fadeUp}
      custom={1}
      initial="hidden"
      animate="visible"
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(160,200,255,0.25)',
        outline: 'none',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 0 12px rgba(160,200,255,0.4)',
        caretColor: 'rgba(160,200,255,0.7)',
      }}
      className={`
        w-full max-w-xs
        text-xl font-light tracking-widest
        placeholder-white/20
        py-3 transition-all duration-500
        focus:border-b-blue-300/50
      `}
    />
  )
}

// ─── Date input — same minimal style ─────────────────────────────────────────
export function CinematicDateInput({ value, onChange, autoFocus }) {
  return (
    <motion.input
      variants={fadeUp}
      custom={1}
      initial="hidden"
      animate="visible"
      type="date"
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(160,200,255,0.25)',
        outline: 'none',
        color: 'white',
        textAlign: 'center',
        colorScheme: 'dark',
        caretColor: 'rgba(160,200,255,0.7)',
      }}
      className="w-full max-w-xs text-xl font-light tracking-widest py-3"
    />
  )
}

// ─── Time input ───────────────────────────────────────────────────────────────
export function CinematicTimeInput({ value, onChange }) {
  return (
    <motion.input
      variants={fadeUp}
      custom={2}
      initial="hidden"
      animate="visible"
      type="time"
      value={value}
      onChange={onChange}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(160,200,255,0.15)',
        outline: 'none',
        color: 'rgba(200,220,255,0.7)',
        textAlign: 'center',
        colorScheme: 'dark',
      }}
      className="w-full max-w-xs text-lg font-light tracking-widest py-3"
    />
  )
}
