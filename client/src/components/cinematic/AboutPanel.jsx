import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from './CinematicPrimitives'

const TABS = [
  { id: 'flow',   label: 'Journey Flow' },
  { id: 'tech',   label: 'Technologies' },
  { id: 'arch',   label: 'Architecture' },
  { id: 'about',  label: 'About Creator' },
]

const TECH_STACK = [
  { name: 'React 19',          role: 'Frontend Framework',      color: '#61dafb' },
  { name: 'Vite 8',            role: 'Build Tool & Dev Server', color: '#9b59b6' },
  { name: 'Three.js + R3F',    role: '3D WebGL Engine',         color: '#00d2ff' },
  { name: 'Framer Motion',     role: 'Cinematic Animations',    color: '#ff4d9d' },
  { name: 'Zustand',           role: 'Global State Manager',    color: '#f97316' },
  { name: 'Tailwind CSS',      role: 'Utility Styling System',  color: '#38bdf8' },
  { name: 'FastAPI',           role: 'Python Backend API',       color: '#10b981' },
  { name: 'Swiss Ephemeris',   role: 'Astronomical Engine',     color: '#a855f7' },
  { name: 'MongoDB Atlas',     role: 'Cloud Database',          color: '#4db33d' },
  { name: 'Vercel + Render',   role: 'Cloud Deployment',        color: '#6366f1' },
  { name: 'PyJWT',             role: 'Admin Authentication',    color: '#fbbf24' },
  { name: 'html2canvas',       role: 'Chart PNG Export',        color: '#ec4899' },
]

const FLOW_STEPS = [
  { step: '01', title: 'Cinematic Entry',      desc: 'Full-screen star field intro with the ASTROLOGICA logotype.' },
  { step: '02', title: 'Identity Collection',  desc: 'User enters their name — seeding the personalized journey.' },
  { step: '03', title: 'Crossroads',           desc: 'Choose between exploring the platform or running a live calculation.' },
  { step: '04', title: 'Birth Data Entry',     desc: 'Date, time and geocoded location collected via Nominatim.' },
  { step: '05', title: 'Ephemeris Calculation',desc: 'Swiss Ephemeris computes dual Tropical + Sidereal charts server-side.' },
  { step: '06', title: 'Cosmic Blueprint',     desc: 'Infographic overlay rendered and available for PNG download.' },
]

const ARCH_NODES = [
  { label: 'Browser', children: ['UniverseCanvas (WebGL)', 'Zustand Store', 'React Router v7'] },
  { label: 'FastAPI Server', children: ['Ephemeris Engine', 'MBTI Psychometrics', 'Admin & Auth', 'Journey Telemetry'] },
  { label: 'Data Layer', children: ['MongoDB Atlas (blueprints, visitors)', 'In-Memory Fallback Dict'] },
]

const tabContent = {
  flow: (
    <div className="space-y-3">
      {FLOW_STEPS.map((s, i) => (
        <motion.div
          key={s.step}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          animate="visible"
          className="flex gap-4 items-start p-3 rounded-xl bg-white/5 border border-white/8"
        >
          <div className="text-2xl font-black text-[#3858f6]/60 font-mono w-8 shrink-0">{s.step}</div>
          <div>
            <div className="text-sm font-bold text-white">{s.title}</div>
            <div className="text-xs text-white/50 mt-0.5">{s.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  ),
  tech: (
    <div className="grid grid-cols-2 gap-2">
      {TECH_STACK.map((t, i) => (
        <motion.div
          key={t.name}
          variants={fadeUp}
          custom={i * 0.5}
          initial="hidden"
          animate="visible"
          className="p-3 rounded-xl bg-white/5 border border-white/8 flex items-start gap-2"
        >
          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: t.color }} />
          <div>
            <div className="text-xs font-bold text-white">{t.name}</div>
            <div className="text-[10px] text-white/40">{t.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  ),
  arch: (
    <div className="space-y-4">
      {ARCH_NODES.map((node, i) => (
        <motion.div
          key={node.label}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#00d2ff] mb-2">{node.label}</div>
          <div className="flex flex-wrap gap-2">
            {node.children.map(c => (
              <span key={c} className="px-2.5 py-0.5 rounded-full bg-[#3858f6]/20 border border-[#3858f6]/30 text-[11px] text-white/75">{c}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  ),
  about: (
    <div className="space-y-4 text-center">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-[#3858f6] to-[#00d2ff] p-0.5 shadow-lg shadow-[#3858f6]/30">
          <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center text-3xl font-black text-[#00d2ff]">P</div>
        </div>
      </motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="space-y-1">
        <div className="text-xl font-bold text-white tracking-tight">Pratham Upadhyay</div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#00d2ff]">Full-Stack Cloud Architect & AI Engineer</div>
      </motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible"
        className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">
        Built Astrologica as a fusion of ancient astronomical wisdom and modern full-stack engineering — marrying Swiss Ephemeris precision, Jungian psychology, and cinematic 3D interfaces into one unified platform.
      </motion.div>
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
        className="grid grid-cols-3 gap-3 pt-2">
        {[
          { label: 'Stack', value: 'React + FastAPI' },
          { label: 'Engine', value: 'Swiss Ephemeris' },
          { label: 'DB', value: 'MongoDB Atlas' },
        ].map(s => (
          <div key={s.label} className="p-2 rounded-xl bg-white/5 border border-white/8 text-center">
            <div className="text-xs font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-white/40">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  ),
}

export default function AboutPanel() {
  const [activeTab, setActiveTab] = useState('flow')

  return (
    <div className="w-full max-w-lg mx-auto p-5 space-y-4">
      {/* Tab Bar — pure text, no background */}
      <div className="flex gap-6 justify-center mb-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === t.id ? 'rgba(200,220,255,0.95)' : 'rgba(160,200,255,0.3)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '4px 0',
              borderBottom: activeTab === t.id ? '1px solid rgba(160,200,255,0.4)' : '1px solid transparent',
              transition: 'all 0.25s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
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
