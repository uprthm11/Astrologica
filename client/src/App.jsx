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
const UniverseCanvas          = lazy(() => import('./components/canvas/UniverseCanvas'))
const SharedDossier           = lazy(() => import('./components/SharedDossier'))
const AdminLogin              = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard          = lazy(() => import('./components/admin/AdminDashboard'))
const CinematicReveal         = lazy(() => import('./components/cinematic/CinematicReveal'))
const CinematicLocationSearch = lazy(() => import('./components/cinematic/CinematicLocationSearch'))
const AboutPanel              = lazy(() => import('./components/cinematic/AboutPanel'))

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
        style={{ ...TS, color: 'rgba(160,200,255,0.5)', fontSize: '10px',
          letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '1.5rem' }}
      >
        a cosmic journey awaits
      </motion.div>

      {/* Logotype: Pure white with bright ethereal cyan glow */}
      <motion.h1
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{
          color: '#ffffff',
          textShadow: '0 0 20px rgba(0, 210, 255, 0.7), 0 0 40px rgba(0, 210, 255, 0.4), 0 2px 24px rgba(0,0,0,0.9)',
          fontSize: 'clamp(3rem, 11vw, 7.5rem)',
          fontWeight: 900,
          letterSpacing: '0.18em',
          lineHeight: 1.05,
          userSelect: 'none',
        }}
      >
        ASTROLOGICA
      </motion.h1>

      {/* Developer credit — exact text per spec */}
      <motion.p
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(200,220,255,0.7)', fontSize: '13px',
          fontWeight: 300, letterSpacing: '0.2em', marginTop: '1.4rem' }}
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
  const { userName, advanceStep, goBack } = useAppStore()
  const isAdmin = userName.toLowerCase() === 'admin'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-12">
      {/* Personalized Welcome Eyebrow */}
      <motion.div
        variants={fadeIn} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(160,200,255,0.6)', fontSize: '12px',
          letterSpacing: '0.45em', textTransform: 'uppercase' }}
      >
        WELCOME, {userName.toUpperCase()}
      </motion.div>

      {/* Main question */}
      <motion.h2
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4.5vw,2.8rem)',
          fontWeight: 300, letterSpacing: '0.06em', lineHeight: 1.3 }}
      >
        What seeks you in the cosmos?
      </motion.h2>

      {/* Choices */}
      <div className="flex flex-col items-center gap-7">
        <CinematicButton
          onClick={() => advanceStep(4, `${userName} chose astro calculation`)}
          delay={0.2}
        >
          Calculate my astro chart
        </CinematicButton>

        <CinematicGhostButton
          onClick={() => advanceStep(3, `${userName} explored About`)}
          delay={0.4}
        >
          About the web
        </CinematicGhostButton>

        {/* Admin Trap -> Step 25 (Admin Login) */}
        {isAdmin && (
          <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
            <CinematicGhostButton
              onClick={() => advanceStep(25, 'Admin selected login prompt')}
              delay={0.6}
            >
              ∞ Admin Console
            </CinematicGhostButton>
          </motion.div>
        )}

        {/* Universal Back Button */}
        <CinematicGhostButton onClick={goBack} delay={0.8}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 25 — ADMIN LOGIN (WebGL Cinematic Flow)
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLoginStep() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — ABOUT
// ═══════════════════════════════════════════════════════════════════════════════
function AboutStep() {
  const { goBack } = useAppStore()
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

      {/* Universal Back Button as ONLY navigation out */}
      <div className="pt-4">
        <CinematicGhostButton onClick={goBack} delay={0}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — DATE OF BIRTH
// ═══════════════════════════════════════════════════════════════════════════════
function DobStep() {
  const { advanceStep, setBirthData, birthData, goBack } = useAppStore()
  const [date, setDate] = useState(birthData?.date || '')
  const [time, setTime] = useState(birthData?.time || '12:00')
  const [err,  setErr]  = useState('')

  const submit = () => {
    if (!date) { setErr('Please enter your date of birth'); return }
    setBirthData({ ...birthData, date, time: time || '12:00' })
    advanceStep(5, `DOB set: ${date} at ${time}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4vw,2.4rem)',
          fontWeight: 300, letterSpacing: '0.07em' }}
      >
        When did your journey begin?
      </motion.h2>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <CinematicDateInput value={date} onChange={e => { setDate(e.target.value); setErr('') }} autoFocus />

        <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible"
          style={{ color: 'rgba(160,200,255,0.4)', fontSize: '10px', letterSpacing: '0.35em',
            textTransform: 'uppercase', marginBottom: '-0.5rem' }}>
          Birth time
        </motion.div>
        <CinematicTimeInput value={time} onChange={e => setTime(e.target.value)} />
      </div>

      {err && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: 'rgba(255,150,150,0.85)', fontSize: '12px', letterSpacing: '0.2em' }}>
          {err}
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-5 pt-2">
        <CinematicButton onClick={submit} delay={0.3}>Continue</CinematicButton>
        <CinematicGhostButton onClick={goBack} delay={0.5}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — LOCATION (3-Tier Progressive Flow)
// ═══════════════════════════════════════════════════════════════════════════════
function LocationStep() {
  const { advanceStep, setBirthData, birthData, goBack } = useAppStore()

  const handleSelect = (locationResult) => {
    setBirthData({ ...birthData, ...locationResult })
    advanceStep(6, `Location set: ${locationResult.locationName}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.4rem,3.8vw,2.2rem)',
          fontWeight: 300, letterSpacing: '0.06em' }}
      >
        Where did the stars greet you? (Birthplace)
      </motion.h2>

      <Suspense fallback={null}>
        <CinematicLocationSearch onSelect={handleSelect} />
      </Suspense>

      <CinematicGhostButton onClick={goBack} delay={0.4}>
        ← BACK
      </CinematicGhostButton>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — PROCESSING (Strict Payload Calculation)
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
        // Construct payload strictly matching DualRequest Pydantic schema
        const payload = {
          date:         birthData?.date || '2000-01-01',
          time:         birthData?.time || '12:00',
          utc_offset:   birthData?.utcOffset || '+00:00',
          lat:          parseFloat(birthData?.lat ?? 0.0),
          lon:          parseFloat(birthData?.lng ?? 0.0),
          ayanamsha:    'lahiri',
          house_system: 'placidus',
        }

        const result = await calculateDual(payload)
        setAstrologyData(result)
        setRevealSlide(0)
        advanceStep(7, `${userName} received ephemeris`)
      } catch (e) {
        setErrorMsg('The ephemeris could not be aligned. Please try again.')
        console.error('Calculation payload error:', e)
      }
    }

    compute()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      {!errorMsg ? (
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
            style={{ color: 'rgba(255,150,150,0.85)', fontSize: '14px', letterSpacing: '0.15em' }}
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

  const renderCurrentStep = () => {
    switch (cinematicStep) {
      case 0:  return <IntroStep key="s0" />
      case 1:  return <NameStep key="s1" />
      case 2:  return <CrossroadsStep key="s2" />
      case 25: return <AdminLoginStep key="s25" />
      case 3:  return <AboutStep key="s3" />
      case 4:  return <DobStep key="s4" />
      case 5:  return <LocationStep key="s5" />
      case 6:  return <ProcessingStep key="s6" />
      case 7:  return <RevealStep key="s7" />
      default: return <IntroStep key="s0" />
    }
  }

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
            key={`cinematic-step-${cinematicStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.0 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            {renderCurrentStep()}
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
