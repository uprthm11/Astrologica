import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { saveBlueprint, checkHealth, API_BASE_URL } from './services/api'
import BlueprintForm from './components/BlueprintForm'
import MBTIQuiz from './components/MBTIQuiz'
import SharedDossier from './components/SharedDossier'

function MainAssessment() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('astrology') // 'astrology' | 'psychology'

  // Centralized lifted state
  const [astrologyData, setAstrologyData] = useState(null)
  const [mbtiData, setMbtiData] = useState(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const bothCompleted = Boolean(astrologyData && mbtiData)

  const handleGenerateCosmicBlueprint = async () => {
    if (!bothCompleted) return
    setSaving(true)
    setSaveError(null)

    try {
      const response = await saveBlueprint(astrologyData, mbtiData)
      const blueprintId = response.id
      navigate(`/blueprint/${blueprintId}`)
    } catch (err) {
      console.error('Save Blueprint Error:', err)
      setSaveError(
        err.response?.data?.detail ||
          'Failed to save blueprint. Ensure the backend API is reachable.'
      )
      setSaving(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Executive Segmented Navigation Tabs */}
      <section className="relative z-10 flex justify-center px-4 my-3">
        <div className="inline-flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl shadow-lg">
          {/* Astrology Tab */}
          <button
            onClick={() => setActiveTab('astrology')}
            className={`relative px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'astrology' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeTab === 'astrology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-lg bg-indigo-600 shadow-md -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>✨</span>
            <span>1. Astrological Ephemeris</span>
            {astrologyData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Psychology Tab */}
          <button
            onClick={() => setActiveTab('psychology')}
            className={`relative px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'psychology' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeTab === 'psychology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-lg bg-indigo-600 shadow-md -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>🧠</span>
            <span>2. Jungian Psychometrics</span>
            {mbtiData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>
      </section>

      {/* Main Tab Content Display */}
      <div className="w-full flex-1 flex items-center justify-center py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'astrology' ? (
            <motion.div
              key="astrology-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <BlueprintForm
                onComplete={(data) => setAstrologyData(data)}
                completedData={astrologyData}
              />
            </motion.div>
          ) : (
            <motion.div
              key="psychology-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <MBTIQuiz
                onComplete={(data) => setMbtiData(data)}
                completedData={mbtiData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {saveError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{saveError}</span>
        </div>
      )}

      {/* --- Executive Synthesis Trigger Action Bar --- */}
      <AnimatePresence>
        {bothCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="w-full max-w-2xl px-4 pt-4 pb-8"
          >
            <div className="p-4 rounded-2xl bg-zinc-900 border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Assessment Matrices Complete
                </div>
                <div className="text-sm font-semibold text-zinc-100 mt-0.5">
                  Ready to synthesize Astrology & Jungian Cognitive Dossier
                </div>
              </div>

              <motion.button
                onClick={handleGenerateCosmicBlueprint}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Synthesizing Dossier...</span>
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    <span>Generate Complete Dossier</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [backendStatus, setBackendStatus] = useState({
    state: 'checking', // 'checking' | 'waking' | 'online' | 'offline'
    retries: 0
  })

  const checkServer = async (attempt = 0) => {
    try {
      if (attempt > 0) {
        setBackendStatus({ state: 'waking', retries: attempt })
      } else {
        setBackendStatus({ state: 'checking', retries: 0 })
      }
      // 60s timeout to allow Render free tier cold start (~30-50s)
      await checkHealth(60000)
      setBackendStatus({ state: 'online', retries: 0 })
    } catch (err) {
      console.warn(`Health check attempt ${attempt + 1} failed:`, err.message)
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
  }, [])

  return (
    <BrowserRouter>
      <div className="relative min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        {/* Background Ambience Subtle Radial Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-950/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-950/15 rounded-full blur-[120px]" />
        </div>

        {/* Top Executive Header Bar */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center font-bold text-base shadow-lg shadow-indigo-950">
              ✦
            </div>
            <div className="text-left">
              <h1 className="font-extrabold text-lg tracking-tight text-white">
                Astrologica
              </h1>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Full-Spectrum Astronomical & Psychometric Console
              </p>
            </div>
          </div>

          {/* Telemetry Server Status Badge */}
          <div className="flex items-center gap-2">
            {backendStatus.state === 'online' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API: Online (Connected)
              </span>
            ) : backendStatus.state === 'waking' ? (
              <button
                onClick={() => checkServer(0)}
                title="Render free tier spinning up"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-950/80 border border-amber-500/40 text-amber-300 cursor-pointer animate-pulse"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                API: Waking Up (Cold Start)...
              </button>
            ) : backendStatus.state === 'checking' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                API: Connecting...
              </span>
            ) : (
              <button
                onClick={() => checkServer(0)}
                title="Click to retry connecting to API"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-950/80 border border-rose-500/30 text-rose-300 hover:bg-rose-900/80 transition cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                API: Offline (Click to Retry)
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
          <Routes>
            <Route path="/" element={<MainAssessment />} />
            <Route path="/blueprint/:id" element={<SharedDossier />} />
          </Routes>
        </main>

        {/* Executive Footer */}
        <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 border-t border-zinc-800/80 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div>Astrologica &bull; Enterprise Ephemeris & Jungian Intelligence</div>
          <div className="text-zinc-600">FastAPI &bull; React 19 &bull; Swiss Ephemeris v2.10</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
