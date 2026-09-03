import React, { Suspense, lazy, useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { checkHealth, getPublicConfig, calculateDual } from './services/api'
import { useAppStore } from './store/useAppStore'

// Lazy-load the heavy Three.js canvas to keep initial paint fast
const UniverseCanvas = lazy(() => import('./components/canvas/UniverseCanvas'))

// Cinematic route sub-pages (loaded lazily too)
const SharedDossier    = lazy(() => import('./components/SharedDossier'))
const AdminLogin       = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard   = lazy(() => import('./components/admin/AdminDashboard'))
const CinematicChart   = lazy(() => import('./components/cinematic/CinematicChart'))
const AboutPanel       = lazy(() => import('./components/cinematic/AboutPanel'))
const BlueprintForm    = lazy(() => import('./components/BlueprintForm'))
const MBTIQuiz         = lazy(() => import('./components/MBTIQuiz'))

import {
  GlassPanel,
  CinematicButton,
  CinematicGhostButton,
  CinematicInput,
  fadeUp,
  fadeIn,
} from './components/cinematic/CinematicPrimitives'

// ─── Step 0 — Intro Screen ─────────────────────────────────────────────────
function IntroStep() {
  const { advanceStep } = useAppStore()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pointer-events-none">
      <motion.div
        variants={fadeIn}
        custom={0}
        initial="hidden"
        animate="visible"
        className="mb-3 text-[10px] font-mono uppercase tracking-[0.5em] text-white/30"
      >
        A cosmic journey awaits
      </motion.div>

      <motion.h1
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
        className="text-[clamp(3rem,10vw,7rem)] font-black tracking-[0.15em] text-transparent bg-clip-text select-none"
        style={{
          backgroundImage: 'linear-gradient(90deg, #a8c4ff 0%, #ffffff 40%, #00d2ff 80%, #3858f6 100%)',
          textShadow: 'none',
        }}
      >
        ASTROLOGICA
      </motion.h1>

      <motion.p
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="visible"
        className="mt-4 text-white/40 text-sm font-light tracking-widest"
      >
        Developed by{' '}
        <span className="text-[#00d2ff] font-semibold">Pratham Upadhyay</span>
      </motion.p>

      <motion.p
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="visible"
        className="mt-2 text-white/25 text-xs font-mono max-w-xs"
      >
        Dual-spectrum ephemeris · Jungian psychometrics · Swiss Ephemeris v2.10
      </motion.p>

      <div className="mt-12 pointer-events-auto">
        <CinematicButton onClick={() => advanceStep(1, 'Opened Astrologica')} delay={4}>
          ✦ Explore the Universe
        </CinematicButton>
      </div>
    </div>
  )
}

// ─── Step 1 — Name Input ───────────────────────────────────────────────────
function NameStep() {
  const { userName, setUserName, advanceStep } = useAppStore()
  const [draft, setDraft] = useState(userName)

  const handleContinue = () => {
    const name = draft.trim() || 'Cosmic Traveller'
    setUserName(name)
    advanceStep(2, `${name} entered their name`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">Step 1 of 2</div>
        <h2 className="text-3xl font-bold text-white tracking-wide">What is your name?</h2>
        <p className="text-sm text-white/35 font-light">Your identity seeds the cosmic blueprint.</p>
      </motion.div>

      <CinematicInput
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleContinue()}
        placeholder="Enter your name…"
        autoFocus
      />

      <CinematicButton onClick={handleContinue} delay={2}>
        Continue →
      </CinematicButton>
    </div>
  )
}

// ─── Step 2 — Crossroads ──────────────────────────────────────────────────
function CrossroadsStep() {
  const { userName, advanceStep, adminToken } = useAppStore()
  const navigate = useNavigate()
  const isAdmin = userName.toLowerCase() === 'admin'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">
          Welcome, {userName}
        </div>
        <h2 className="text-4xl font-bold text-white tracking-wide">Choose your path</h2>
        <p className="text-sm text-white/35">Two doors. Only you know which calls to you.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <CinematicGhostButton
          onClick={() => advanceStep(3, `${userName} chose About Website`)}
          delay={1}
          className="w-full sm:w-auto"
        >
          🔭 Explore the Platform
        </CinematicGhostButton>

        <CinematicButton
          onClick={() => advanceStep(4, `${userName} chose Astrologica Journey`)}
          delay={2}
          className="w-full sm:w-auto"
        >
          ✦ Calculate My Blueprint
        </CinematicButton>
      </div>

      {/* Admin Trap — visible only when name is 'admin' */}
      {isAdmin && (
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
          <button
            onClick={() => {
              advanceStep(99, 'Admin accessed dashboard')
              navigate(adminToken ? '/admin/dashboard' : '/admin')
            }}
            className="text-xs font-mono text-[#00d2ff] hover:text-white transition cursor-pointer border border-[#00d2ff]/30 px-4 py-2 rounded-xl bg-[#00d2ff]/5 hover:bg-[#00d2ff]/10"
          >
            🔐 Explore Admin Console
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ─── Step 3 — About / Platform Info ──────────────────────────────────────
function AboutStep() {
  const { advanceStep } = useAppStore()
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-16 gap-6">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="text-center space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">Platform Intelligence</div>
        <h2 className="text-3xl font-bold text-white">Astrologica</h2>
      </motion.div>

      <Suspense fallback={null}>
        <AboutPanel />
      </Suspense>

      <div className="flex gap-4 pt-4">
        <CinematicGhostButton onClick={() => advanceStep(2, 'Returned to Crossroads from About')} delay={0}>
          ← Back
        </CinematicGhostButton>
        <CinematicButton onClick={() => advanceStep(4, 'Navigated from About to Blueprint')} delay={1}>
          Calculate Blueprint →
        </CinematicButton>
      </div>
    </div>
  )
}

// ─── Step 4 — Astrologica Form (full dashboard) ───────────────────────────
function AstrologicaStep() {
  const { advanceStep, setAstrologyData, userName } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Minimal cinematic header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="text-sm font-bold tracking-wider text-white/80">✦ ASTROLOGICA</div>
        <button
          onClick={() => advanceStep(2, `${userName} returned to Crossroads`)}
          className="text-xs font-mono text-white/40 hover:text-white cursor-pointer transition"
        >
          ← Crossroads
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
          className="text-center space-y-1 mb-8">
          <h2 className="text-2xl font-bold text-white">Birth Ephemeris Calculation</h2>
          <p className="text-sm text-white/40">Enter your birth details to generate your dual cosmic blueprint.</p>
        </motion.div>

        <Suspense fallback={
          <div className="text-center text-white/40 py-12 animate-pulse">Loading calculation engine...</div>
        }>
          <BlueprintForm
            onComplete={(data) => {
              setAstrologyData(data)
              advanceStep(5, `${userName} generated ephemeris chart`)
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}

// ─── Step 5 — Cinematic Chart ─────────────────────────────────────────────
function ChartStep() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start py-8 px-4">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="text-center space-y-1 mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">Your Cosmic Blueprint</div>
        <h2 className="text-2xl font-bold text-white">Stellar Dossier</h2>
      </motion.div>
      <Suspense fallback={null}>
        <CinematicChart />
      </Suspense>
    </div>
  )
}

// ─── Main Cinematic Root ──────────────────────────────────────────────────
function CinematicRoot() {
  const { cinematicStep, setBackendStatus, setBackendReady, setSiteConfig } = useAppStore()

  const checkServer = async (attempt = 0) => {
    try {
      if (attempt > 0) setBackendStatus({ state: 'waking', retries: attempt })
      else setBackendStatus({ state: 'checking', retries: 0 })
      await checkHealth(60000)
      setBackendStatus({ state: 'online', retries: 0 })
      setBackendReady(true)
    } catch (err) {
      if (attempt < 5) {
        setBackendStatus({ state: 'waking', retries: attempt + 1 })
        setTimeout(() => checkServer(attempt + 1), 6000)
      } else {
        setBackendStatus({ state: 'offline', retries: attempt })
        setBackendReady(false)
      }
    }
  }

  useEffect(() => {
    checkServer(0)
    getPublicConfig()
      .then(cfg => { if (cfg) setSiteConfig(cfg) })
      .catch(() => {})
  }, [])

  const STEPS = [
    <IntroStep />,
    <NameStep />,
    <CrossroadsStep />,
    <AboutStep />,
    <AstrologicaStep />,
    <ChartStep />,
  ]

  const current = STEPS[Math.min(cinematicStep, STEPS.length - 1)]

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Full-screen star field — always behind everything */}
      <Suspense fallback={
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #0a0d2e 0%, #020308 100%)',
        }} />
      }>
        <UniverseCanvas />
      </Suspense>

      {/* Cinematic step overlay */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${cinematicStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.7 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Admin Shell — completely separate from the cinematic universe ────────
// The universe fades out here. Admin panel has its own dark solid environment.
function AdminShell({ children, centered = false }) {
  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #0d1145 0%, #07081a 60%, #020308 100%)',
      }}
    >
      {/* Subtle grid overlay for depth */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#3858f6 1px, transparent 1px), linear-gradient(90deg, #3858f6 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className={`relative z-10 ${centered ? 'flex items-center justify-center min-h-screen p-6' : 'p-6 sm:p-8'}`}>
        {children}
      </div>
    </div>
  )
}

// ─── App Root with Router ─────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cinematic entry — handles all journey steps 0-5 */}
        <Route path="/" element={<CinematicRoot />} />

        {/* Saved blueprint dossier page */}
        <Route path="/blueprint/:id" element={
          <AdminShell>
            <Suspense fallback={null}><SharedDossier /></Suspense>
          </AdminShell>
        } />

        {/* Admin routes — solid dark shell, universe does not render here */}
        <Route path="/admin" element={
          <AdminShell centered>
            <Suspense fallback={null}><AdminLogin /></Suspense>
          </AdminShell>
        } />
        <Route path="/admin/dashboard" element={
          <AdminShell>
            <Suspense fallback={null}><AdminDashboard /></Suspense>
          </AdminShell>
        } />
      </Routes>
    </BrowserRouter>
  )
}

