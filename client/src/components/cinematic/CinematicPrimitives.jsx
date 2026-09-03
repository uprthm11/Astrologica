import React from 'react'
import { motion } from 'framer-motion'

// Shared animation presets for cinematic elegance
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -18, transition: { duration: 0.45 } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.15, duration: 0.8, ease: 'easeOut' },
  }),
  exit: { opacity: 0, transition: { duration: 0.35 } },
}

// Cinematic glass panel
export function GlassPanel({ children, className = '' }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        relative rounded-2xl border border-white/10
        bg-gradient-to-b from-white/[0.06] to-black/30
        backdrop-blur-2xl shadow-2xl shadow-black/60
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// Cinematic primary button
export function CinematicButton({ onClick, children, delay = 0, className = '', disabled = false }) {
  return (
    <motion.button
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(56,88,246,0.55)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-2xl font-bold tracking-wider text-sm uppercase
        bg-gradient-to-r from-[#3858f6] via-[#2547e0] to-[#00d2ff]
        text-white shadow-lg shadow-[#3858f6]/30
        border border-white/20 cursor-pointer transition-all
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// Hollow / secondary cinematic button
export function CinematicGhostButton({ onClick, children, delay = 0, className = '' }) {
  return (
    <motion.button
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.04, borderColor: 'rgba(0,210,255,0.7)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        px-7 py-3 rounded-2xl font-semibold tracking-wider text-sm uppercase
        border border-white/25 text-white/80 hover:text-white
        bg-white/5 backdrop-blur-sm cursor-pointer transition-all
        hover:bg-white/10
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// Cinematic text input
export function CinematicInput({ value, onChange, placeholder, autoFocus, onKeyDown }) {
  return (
    <motion.input
      variants={fadeUp}
      custom={1}
      initial="hidden"
      animate="visible"
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`
        w-full max-w-sm bg-transparent border-b-2 border-white/30
        focus:border-[#00d2ff] outline-none text-white text-center
        text-xl font-light tracking-widest placeholder-white/30
        py-3 transition-colors duration-300
      `}
    />
  )
}
