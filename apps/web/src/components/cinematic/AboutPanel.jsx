import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from './CinematicPrimitives'

const TABS = [
  { id: 'flow',   label: 'Prologue Flow' },
  { id: 'tech',   label: 'Engine Stack' },
  { id: 'arch',   label: 'System Topology' },
  { id: 'about',  label: 'Creator Philosophy' },
]

const TECH_STACK = [
  { name: 'React 19 & Vite 8', role: 'Cinematic Web Core', color: '#61dafb' },
  { name: 'Three.js & R3F',    role: 'WebGL Spatial Engine', color: '#00d2ff' },
  { name: 'Framer Motion',     role: 'Fluid State Wipes', color: '#ff4d9d' },
  { name: 'Zustand',           role: 'Global Telemetry Store', color: '#f97316' },
  { name: 'FastAPI Python',    role: 'Backend Calculation API', color: '#10b981' },
  { name: 'Swiss Ephemeris',   role: 'Sub-Arcsecond Astronomy', color: '#a855f7' },
  { name: 'MongoDB Atlas',     role: 'Persistent Journey Telemetry', color: '#4db33d' },
  { name: 'Native Canvas Exporter', role: 'High-Res Poster Export', color: '#ec4899' },
]

const PROLOGUE_STEPS = [
  { step: '01', title: 'The Celestial Entry', desc: 'Awakening within a 3D WebGL starfield, setting an immersive interstellar tone.' },
  { step: '02', title: 'Identity Anchoring', desc: 'Auto-formatted full name input establishing personal resonance across the journey.' },
  { step: '03', title: 'Frictionless Chronology', desc: 'Strict, borderless date and time selectors eliminating invalid birth data.' },
  { step: '04', title: 'Hierarchical Geocoding', desc: 'Backend geocoding proxy latitude/longitude resolution.' },
  { step: '05', title: 'Swiss Ephemeris Engine', desc: 'Server-side computation of geocentric planetary coordinates accurate to <1 arc-second.' },
  { step: '06', title: 'Psychological Depth Reveal', desc: 'A 9-slide interactive bubble dossier revealing core ego, geometry, and gemstone frequencies.' },
]

const ARCH_NODES = [
  { label: 'Client Space', children: ['UniverseCanvas (R3F Starfield)', 'Interactive Bubble Engine', 'Zustand Telemetry Store'] },
  { label: 'Server Space', children: ['FastAPI Ephemeris API', 'Swiss Ephemeris v2.10', 'Visitor Journey Telemetry'] },
  { label: 'Data Space', children: ['MongoDB Atlas Cloud Storage', 'In-Memory State Fallback'] },
]

const tabContent = {
  flow: (
    <div className="space-y-4 text-left">
      {PROLOGUE_STEPS.map((s, i) => (
        <motion.div
          key={s.step}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          animate="visible"
          className="flex gap-4 items-start"
        >
          <div className="text-xl font-light font-mono text-cyan-300/60 w-8 shrink-0">{s.step}</div>
          <div className="space-y-1">
            <div className="text-lg font-light text-white tracking-wider">{s.title}</div>
            <div className="text-sm font-light text-blue-100/75 leading-relaxed">{s.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  ),
  tech: (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
      {TECH_STACK.map((t, i) => (
        <motion.div
          key={t.name}
          variants={fadeUp}
          custom={i * 0.5}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
            <div className="text-base font-light text-white tracking-wider">{t.name}</div>
          </div>
          <div className="text-xs font-mono text-blue-200/50 pl-4">{t.role}</div>
        </motion.div>
      ))}
    </div>
  ),
  arch: (
    <div className="space-y-6 text-left">
      {ARCH_NODES.map((node, i) => (
        <motion.div
          key={node.label}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-300/80">{node.label}</div>
          <div className="flex flex-wrap gap-2">
            {node.children.map(c => (
              <span key={c} className="text-xs font-light text-white/90 tracking-wider">
                • {c}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  ),
  about: (
    <div className="space-y-5 text-center max-w-md mx-auto">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="space-y-1">
        <div className="text-2xl font-light text-white tracking-widest drop-shadow-md">Pratham Upadhyay</div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-300">Creator & Lead Architect</div>
      </motion.div>
      <motion.p
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        className="text-base font-light text-white/85 leading-relaxed italic drop-shadow-md"
      >
        "Astrologica was born at the intersection of classical astronomy, Jungian psychological archetypes, and modern high-performance web architecture. It elevates birth chart calculations into an evocative, cinematic journey through self-discovery."
      </motion.p>
    </div>
  ),
}

export default function AboutPanel() {
  const [activeTab, setActiveTab] = useState('flow')

  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-6">
      {/* Tab Bar — pure text with glowing active state */}
      <div className="flex gap-8 justify-center border-b border-blue-200/10 pb-3">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === t.id ? '#ffffff' : 'rgba(160,200,255,0.4)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              textShadow: activeTab === t.id ? '0 0 12px rgba(0,210,255,0.8)' : 'none',
              borderBottom: activeTab === t.id ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.3s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
