import React, { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { checkHealth, getPublicConfig, calculateDual } from './services/api'
import { useAppStore } from './store/useAppStore'
import {
  CinematicButton,
  CinematicGhostButton,
  CinematicInput,
  CinematicDateInput,
  CinematicTimeInput,
  fadeUp,
  fadeIn,
} from './components/cinematic/CinematicPrimitives'

// ─── Lazy imports ──────────────────────────────────────────────────────────────
const UniverseCanvas         = lazy(() => import('./components/canvas/UniverseCanvas'))
const SharedDossier          = lazy(() => import('./components/SharedDossier'))
const AdminLogin             = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard         = lazy(() => import('./components/admin/AdminDashboard'))
const CinematicReveal        = lazy(() => import('./components/cinematic/CinematicReveal'))
const CinematicLocationSearch = lazy(() => import('./components/cinematic/CinematicLocationSearch'))
const AboutPanel             = lazy(() => import('./components/cinematic/AboutPanel'))

// ─── Step text drop-shadow for visibility on stars ───────────────────────────
const TS = { textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)' }

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — INTRO
// ═══════════════════════════════════════════════════════════════════════════════
function IntroStep() {
  const { advanceStep } = useAppStore()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Eyebrow */}
      <motion.div
        variants={fadeIn} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(160,200,255,0.45)', fontSize: '10px',
          letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '1.5rem' }}
      >
        a cosmic journey awaits
      </motion.div>

      {/* Logotype */}
      <motion.h1
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{
          ...TS,
          fontSize: 'clamp(3rem, 11vw, 7.5rem)',
          fontWeight: 900,
          letterSpacing: '0.18em',
          background: 'linear-gradient(90deg, #a8c4ff 0%, #ffffff 40%, #c0e0ff 80%, #6090ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.05,
          userSelect: 'none',
        }}
      >
        ASTROLOGICA
      </motion.h1>

      {/* Developer credit — exact text per spec */}
      <motion.p
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(200,220,255,0.55)', fontSize: '13px',
          fontWeight: 300, letterSpacing: '0.2em', marginTop: '1.2rem' }}
      >
        Developed by Pratham Upadhyay
      </motion.p>

      {/* CTA — exact text per spec */}
      <div style={{ marginTop: '3.5rem' }}>
        <CinematicButton onClick={() => advanceStep(1, 'Entered Astrologica')} delay={0.8}>
          Explore
        </CinematicButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — NAME
// ═══════════════════════════════════════════════════════════════════════════════
function NameStep() {
  const { userName, setUserName, advanceStep } = useAppStore()
  const [draft, setDraft] = useState(userName)

  const submit = () => {
    const name = draft.trim() || 'Cosmic Traveller'
    setUserName(name)
    advanceStep(2, `${name} entered their name`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-12">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.6rem,4vw,2.6rem)',
          fontWeight: 300, letterSpacing: '0.08em' }}
      >
        What is your name?
      </motion.h2>

      <CinematicInput
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="your name…"
        autoFocus
      />

      <CinematicButton onClick={submit} delay={0.4}>Continue</CinematicButton>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — CROSSROADS
// ═══════════════════════════════════════════════════════════════════════════════
function CrossroadsStep() {
  const { userName, advanceStep, adminToken } = useAppStore()
  const navigate  = useNavigate()
  const isAdmin   = userName.toLowerCase() === 'admin'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-14">
      {/* Eyebrow greeting */}
      <motion.div
        variants={fadeIn} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(160,200,255,0.4)', fontSize: '11px',
          letterSpacing: '0.4em', textTransform: 'uppercase' }}
      >
        {userName}
      </motion.div>

      {/* Main question — exact text per spec */}
      <motion.h2
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4.5vw,2.8rem)',
          fontWeight: 300, letterSpacing: '0.06em', lineHeight: 1.3 }}
      >
        What seeks you in the cosmos?
      </motion.h2>

      {/* Choices — exact button text per spec */}
      <div className="flex flex-col items-center gap-8">
        <CinematicButton
          onClick={() => advanceStep(4, `${userName} chose astro calculation`)}
          delay={0.2}
        >
          Calculate my astro chart
        </CinematicButton>

        <CinematicGhostButton
          onClick={() => advanceStep(3, `${userName} explored About`)}
          delay={0.5}
        >
          About the web
        </CinematicGhostButton>

        {/* Admin Trap */}
        {isAdmin && (
          <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
            <CinematicGhostButton
              onClick={() => {
                advanceStep(99, 'Admin entered console')
                navigate(adminToken ? '/admin/dashboard' : '/admin')
              }}
              delay={0.8}
            >
              ∞ Admin Console
            </CinematicGhostButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — ABOUT
// ═══════════════════════════════════════════════════════════════════════════════
function AboutStep() {
  const { advanceStep } = useAppStore()
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-16 gap-8">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: '2rem', fontWeight: 300,
          letterSpacing: '0.1em', textAlign: 'center' }}
      >
        Astrologica
      </motion.h2>

      <Suspense fallback={null}>
        <AboutPanel />
      </Suspense>

      <div className="flex gap-10 pt-4">
        <CinematicGhostButton onClick={() => advanceStep(2, 'Back to Crossroads')} delay={0}>
          ← Back
        </CinematicGhostButton>
        <CinematicButton onClick={() => advanceStep(4, 'From About to Chart')} delay={0.3}>
          Calculate Blueprint
        </CinematicButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — DATE OF BIRTH
// ═══════════════════════════════════════════════════════════════════════════════
function DobStep() {
  const { advanceStep, setBirthData, birthData } = useAppStore()
  const [date, setDate] = useState(birthData?.date || '')
  const [time, setTime] = useState(birthData?.time || '12:00')
  const [err,  setErr]  = useState('')

  const submit = () => {
    if (!date) { setErr('Please enter your date of birth'); return }
    setBirthData({ ...birthData, date, time: time || '12:00' })
    advanceStep(5, `DOB set: ${date} at ${time}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-12">
      {/* Question — exact text per spec */}
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4vw,2.4rem)',
          fontWeight: 300, letterSpacing: '0.07em' }}
      >
        When did your journey begin?
      </motion.h2>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Date */}
        <CinematicDateInput value={date} onChange={e => { setDate(e.target.value); setErr('') }} autoFocus />

        {/* Time — subtle label above */}
        <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible"
          style={{ color: 'rgba(160,200,255,0.3)', fontSize: '10px', letterSpacing: '0.35em',
            textTransform: 'uppercase', marginBottom: '-0.5rem' }}>
          Birth time
        </motion.div>
        <CinematicTimeInput value={time} onChange={e => setTime(e.target.value)} />
      </div>

      {err && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: 'rgba(255,150,150,0.7)', fontSize: '12px', letterSpacing: '0.2em' }}>
          {err}
        </motion.div>
      )}

      <CinematicButton onClick={submit} delay={0.3}>Continue</CinematicButton>

      <CinematicGhostButton onClick={() => advanceStep(2, 'Back to Crossroads from DOB')} delay={0.6}>
        ← Back
      </CinematicGhostButton>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — LOCATION
// ═══════════════════════════════════════════════════════════════════════════════
function LocationStep() {
  const { advanceStep, setBirthData, birthData } = useAppStore()

  const handleSelect = (locationResult) => {
    setBirthData({ ...birthData, ...locationResult })
    advanceStep(6, `Location set: ${locationResult.locationName}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-12">
      {/* Question — exact text per spec */}
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4vw,2.4rem)',
          fontWeight: 300, letterSpacing: '0.07em' }}
      >
        Where did the stars greet you?
      </motion.h2>

      <Suspense fallback={null}>
        <CinematicLocationSearch onSelect={handleSelect} />
      </Suspense>

      <CinematicGhostButton onClick={() => advanceStep(4, 'Back to DOB')} delay={0.4}>
        ← Back
      </CinematicGhostButton>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════
function ProcessingStep() {
  const { birthData, userName, setAstrologyData, advanceStep, setRevealSlide } = useAppStore()
  const [errorMsg, setErrorMsg] = useState(null)
  const called = React.useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const compute = async () => {
      try {
        const [y, mo, d] = (birthData?.date || '2000-01-01').split('-').map(Number)
        const [h, mi]    = (birthData?.time || '12:00').split(':').map(Number)

        const payload = {
          year:        y,
          month:       mo,
          day:         d,
          hour:        h,
          minute:      mi,
          second:      0,
          latitude:    birthData?.lat   ?? 0,
          longitude:   birthData?.lng   ?? 0,
          altitude:    0,
          utc_offset:  birthData?.utcOffset ?? 0,
          house_system: 'P',
          ayanamsha:   'lahiri',
        }

        const result = await calculateDual(payload)
        setAstrologyData(result)
        setRevealSlide(0)
        advanceStep(7, `${userName} received ephemeris`)
      } catch (e) {
        setErrorMsg('The ephemeris could not be aligned. Please try again.')
        console.error(e)
      }
    }

    compute()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      {!errorMsg ? (
        /* ── Pulsating processing message — exact text per spec ── */
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...TS, color: 'rgba(200,220,255,0.9)', fontSize: 'clamp(1rem,3vw,1.4rem)',
            fontWeight: 300, letterSpacing: '0.15em' }}
        >
          Aligning the ephemeris…
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: 'rgba(255,150,150,0.75)', fontSize: '14px', letterSpacing: '0.15em' }}
          >
            {errorMsg}
          </motion.div>
          <CinematicGhostButton onClick={() => advanceStep(4, 'Retry from DOB')}>
            ← Try Again
          </CinematicGhostButton>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 7 — COSMIC REVEAL (5 slides)
// ═══════════════════════════════════════════════════════════════════════════════
function RevealStep() {
  return (
    <Suspense fallback={null}>
      <CinematicReveal />
    </Suspense>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC ROOT — orchestrates all steps
// ═══════════════════════════════════════════════════════════════════════════════
function CinematicRoot() {
  const { cinematicStep, setBackendStatus, setBackendReady, setSiteConfig } = useAppStore()

  // Server health with cold-start retries
  const checkServer = async (attempt = 0) => {
    try {
      if (attempt > 0) setBackendStatus({ state: 'waking', retries: attempt })
      else             setBackendStatus({ state: 'checking', retries: 0 })
      await checkHealth(60000)
      setBackendStatus({ state: 'online', retries: 0 })
      setBackendReady(true)
    } catch {
      if (attempt < 5) {
        setBackendStatus({ state: 'waking', retries: attempt + 1 })
        setTimeout(() => checkServer(attempt + 1), 6000)
      } else {
        setBackendStatus({ state: 'offline', retries: attempt })
      }
    }
  }

  useEffect(() => {
    checkServer(0)
    getPublicConfig().then(cfg => { if (cfg) setSiteConfig(cfg) }).catch(() => {})
  }, [])

  const STEPS = [
    <IntroStep      key="s0" />,
    <NameStep       key="s1" />,
    <CrossroadsStep key="s2" />,
    <AboutStep      key="s3" />,
    <DobStep        key="s4" />,
    <LocationStep   key="s5" />,
    <ProcessingStep key="s6" />,
    <RevealStep     key="s7" />,
  ]

  const step    = Math.min(Math.max(cinematicStep, 0), STEPS.length - 1)
  const current = STEPS[step]

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Star field — always present, always behind */}
      <Suspense fallback={
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #080b22 0%, #010208 100%)',
        }} />
      }>
        <UniverseCanvas />
      </Suspense>

      {/* Cinematic step overlay */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`cinematic-step-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.0 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN SHELL — solid background, no WebGL universe
// ═══════════════════════════════════════════════════════════════════════════════
function AdminShell({ children, centered = false }) {
  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0d1145 0%, #07081a 60%, #020308 100%)' }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#3858f6 1px,transparent 1px),linear-gradient(90deg,#3858f6 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className={`relative z-10 ${centered ? 'flex items-center justify-center min-h-screen p-6' : 'p-6 sm:p-8'}`}>
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CinematicRoot />} />

        <Route path="/blueprint/:id" element={
          <AdminShell>
            <Suspense fallback={null}><SharedDossier /></Suspense>
          </AdminShell>
        } />

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
