import React, { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { checkHealth, getPublicConfig, calculateDual } from './services/api'
import { useAppStore } from './store/useAppStore'
import {
  CinematicButton,
  CinematicGhostButton,
  CinematicInput,
  fadeUp,
  fadeIn,
} from './components/cinematic/CinematicPrimitives'

// ─── Lazy imports ──────────────────────────────────────────────────────────────
const UniverseCanvas                = lazy(() => import('./components/canvas/UniverseCanvas'))
const SharedDossier                 = lazy(() => import('./components/SharedDossier'))
const AdminLogin                    = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard                = lazy(() => import('./components/admin/AdminDashboard'))
const CinematicReveal               = lazy(() => import('./components/cinematic/CinematicReveal'))
const CinematicLocationSearch       = lazy(() => import('./components/cinematic/CinematicLocationSearch'))
const CinematicChronologicalInputs  = lazy(() => import('./components/cinematic/CinematicChronologicalInputs'))
const AboutPanel                    = lazy(() => import('./components/cinematic/AboutPanel'))

// ─── Step text drop-shadow for visibility on stars ───────────────────────────
const TS = { textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)' }

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — INTRO
// ═══════════════════════════════════════════════════════════════════════════════
function IntroStep() {
  const { advanceStep } = useAppStore()
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center">
      <motion.div
        variants={fadeIn} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(160,200,255,0.5)', fontSize: '10px',
          letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '1.5rem' }}
      >
        a cosmic journey awaits
      </motion.div>

      <motion.h1
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{
          color: '#ffffff',
          fontSize: 'clamp(2.5rem, 9vw, 6.5rem)',
          fontWeight: 200,
          letterSpacing: '0.4em',
          lineHeight: 1.1,
          userSelect: 'none',
          textShadow: 'none',
        }}
      >
        ASTROLOGICA
      </motion.h1>

      <motion.p
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
        style={{ ...TS, color: 'rgba(200,220,255,0.7)', fontSize: '13px',
          fontWeight: 300, letterSpacing: '0.2em', marginTop: '1.4rem' }}
      >
        Developed by Pratham Upadhyay
      </motion.p>

      <div style={{ marginTop: '3.5rem' }}>
        <CinematicButton onClick={() => advanceStep(1, 'Entered Astrologica')} delay={0.8}>
          Explore
        </CinematicButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — NAME (Auto-Capitalized Full Name Validation)
// ═══════════════════════════════════════════════════════════════════════════════
function NameStep() {
  const { userName, setUserName, advanceStep } = useAppStore()
  const [draft, setDraft] = useState(userName)

  // Validation: Must contain at least one space (e.g. "Pratham Upadhyay") OR be exact string "admin"
  const isValidName = (str) => {
    const trimmed = str.trim()
    if (trimmed.toLowerCase() === 'admin') return true
    return trimmed.length >= 3 && trimmed.includes(' ')
  }

  const canSubmit = isValidName(draft)

  const submit = () => {
    if (!canSubmit) return
    const name = draft.trim()
    setUserName(name)
    advanceStep(2, `${name} entered their name`)
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center gap-10">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.6rem,4vw,2.6rem)',
          fontWeight: 300, letterSpacing: '0.08em' }}
      >
        May I have your name?
      </motion.h2>

      <CinematicInput
        value={draft}
        onChange={e => setDraft(e.target.value.replace(/\b\w/g, char => char.toUpperCase()))}
        onKeyDown={e => e.key === 'Enter' && canSubmit && submit()}
        placeholder="Your full name..."
        autoFocus
      />

      {canSubmit ? (
        <CinematicButton onClick={submit} delay={0.2}>Continue</CinematicButton>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-blue-200/40 tracking-widest pt-2">
          Please enter your full name (first & last)
        </motion.div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — CROSSROADS (Correct Text Order & Cleaned Buttons)
// ═══════════════════════════════════════════════════════════════════════════════
function CrossroadsStep() {
  const { userName, advanceStep, goBack } = useAppStore()
  const isAdmin = userName.toLowerCase() === 'admin'

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center gap-10">
      {/* Fixed Text Order: WELCOME on top, userName below in larger glowing font */}
      <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="space-y-2">
        <div style={{ ...TS, color: 'rgba(160,200,255,0.5)', fontSize: '11px',
          letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          WELCOME
        </div>
        <div
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(0, 210, 255, 0.7), 0 0 40px rgba(0, 210, 255, 0.3)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '0.12em',
          }}
        >
          {userName}
        </div>
      </motion.div>

      {/* Choices */}
      <div className="flex flex-col items-center gap-6 pt-4">
        <CinematicButton
          onClick={() => advanceStep(4, `${userName} chose astro calculation`)}
          delay={0.2}
        >
          Start cosmic journey
        </CinematicButton>

        <CinematicGhostButton
          onClick={() => advanceStep(3, `${userName} explored About`)}
          delay={0.4}
        >
          About website
        </CinematicGhostButton>

        {/* Admin Trap -> Step 25 */}
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
// STEP 25 — ADMIN LOGIN
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
    <div className="min-h-screen w-full flex flex-col justify-start items-center overflow-hidden px-4 md:px-8 py-16 gap-8 text-center">
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

      <div className="pt-4">
        <CinematicGhostButton onClick={goBack} delay={0}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — DATE & TIME OF BIRTH (Wheel Pickers & Enlarged Helper Text)
// ═══════════════════════════════════════════════════════════════════════════════
function DobStep() {
  const { advanceStep, setBirthData, birthData, goBack } = useAppStore()
  const [chronData, setChronData] = useState({ date: '', time: '', isComplete: false })

  const submit = () => {
    if (!chronData.isComplete) return
    setBirthData({ ...birthData, date: chronData.date, time: chronData.time })
    advanceStep(5, `DOB set: ${chronData.date} at ${chronData.time}`)
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center gap-8">
      <Suspense fallback={null}>
        <CinematicChronologicalInputs onComplete={setChronData} />
      </Suspense>

      <div className="flex flex-col items-center gap-5 pt-2">
        {chronData.isComplete ? (
          <CinematicButton onClick={submit} delay={0.2}>Continue</CinematicButton>
        ) : (
          <div className="text-xl md:text-2xl font-light tracking-wide text-blue-200/50">
            Select all date & time fields to continue
          </div>
        )}
        <CinematicGhostButton onClick={goBack} delay={0.4}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — LOCATION (Direct Western Routing & Select your birth location)
// ═══════════════════════════════════════════════════════════════════════════════
function LocationStep() {
  const { advanceStep, setBirthData, birthData, setPreferredSystem, goBack } = useAppStore()

  const handleSelect = (locationResult) => {
    setBirthData({ ...birthData, ...locationResult })
    setPreferredSystem('western') // Automatically set to 'western' (Psychological Depth)
    advanceStep(6, `Location set: ${locationResult.locationName}. Commencing calculation.`)
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center gap-8">
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ ...TS, color: 'white', fontSize: 'clamp(1.5rem,4vw,2.5rem)',
          fontWeight: 300, letterSpacing: '0.06em' }}
      >
        Select your birth location
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
// STEP 6 — PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════
function ProcessingStep() {
  const { birthData, userName, setAstrologyData, advanceStep, setRevealSlide } = useAppStore()
  const [errorMsg, setErrorMsg] = useState(null)
  const [loaderIndex, setLoaderIndex] = useState(0)
  const called = React.useRef(false)

  const LOADER_PHRASES = [
    "Aligning Swiss Ephemeris coordinates…",
    "Synthesizing planetary architectures…",
    "AI Cosmic Reader weaving storyboard…",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaderIndex(i => (i + 1) % LOADER_PHRASES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (called.current) return
    called.current = true

    const compute = async () => {
      try {
        const payload = {
          date:         birthData?.date || '2000-01-01',
          time:         birthData?.time || '12:00',
          utc_offset:   birthData?.utcOffset || '+00:00',
          timezone:     birthData?.timezone || null,
          lat:          parseFloat(birthData?.lat ?? 0.0),
          lon:          parseFloat(birthData?.lng ?? 0.0),
          ayanamsha:    'lahiri',
          house_system: 'placidus',
        }

        // Hold warp tunnel until AI Cosmic Reader payload fully resolves
        const result = await calculateDual(payload)
        
        // Instantaneous load into Chapter 1 (Slide 1)
        setAstrologyData(result)
        setRevealSlide(0)
        advanceStep(7, `${userName} received ephemeris storyboard`)
      } catch (e) {
        setErrorMsg('The ephemeris could not be aligned. Please try again.')
        console.error('Calculation payload error:', e)
      }
    }

    compute()
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 text-center gap-10">
      {!errorMsg ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            key={loaderIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.8 }}
            style={{
              ...TS,
              color: 'rgba(200,220,255,0.95)',
              fontSize: 'clamp(1.1rem,3.5vw,1.6rem)',
              fontWeight: 300,
              letterSpacing: '0.15em'
            }}
          >
            {LOADER_PHRASES[loaderIndex]}
          </motion.div>
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-blue-200/40">
            Hold for cosmic calibration
          </div>
        </div>
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
// STEP 7 — COSMIC REVEAL (11-Slide Deep Dive)
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
      <Suspense fallback={
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #080b22 0%, #010208 100%)',
        }} />
      }>
        <UniverseCanvas />
      </Suspense>

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
