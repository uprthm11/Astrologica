import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { saveBlueprint, checkHealth } from './services/api'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import BlueprintForm from './components/BlueprintForm'
import MBTIQuiz from './components/MBTIQuiz'
import SharedDossier from './components/SharedDossier'

// Quick Status Metrics Row
function MetricCardsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6 text-left">
      <div className="dashboard-card !p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#3858f6]/15 border border-[#3858f6]/30 flex items-center justify-center text-[#00d2ff] font-bold text-lg shrink-0">
          ✦
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-mono font-bold text-[#7b82b8]">
            Astronomical Engine
          </div>
          <div className="text-sm font-bold text-white truncate">Swiss Ephemeris v2.10</div>
          <div className="text-[10px] font-mono text-[#00d2ff]">Lahiri &bull; Raman &bull; KP</div>
        </div>
      </div>

      <div className="dashboard-card !p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/15 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] font-bold text-lg shrink-0">
          🧠
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-mono font-bold text-[#7b82b8]">
            Cognitive Stack
          </div>
          <div className="text-sm font-bold text-white truncate">Jungian 8-Function Model</div>
          <div className="text-[10px] font-mono text-[#10b981]">PCI Clarity Bipolar Index</div>
        </div>
      </div>

      <div className="dashboard-card !p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
          ⚡
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-mono font-bold text-[#7b82b8]">
            Storage & Synthesis
          </div>
          <div className="text-sm font-bold text-white truncate">MongoDB Atlas Cloud</div>
          <div className="text-[10px] font-mono text-[#7b82b8]">Universal JSON Schemas</div>
        </div>
      </div>
    </div>
  )
}

function MainAssessment({ activeTab, setActiveTab }) {
  const navigate = useNavigate()

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
      {/* Top Metric Cards */}
      <div className="w-full max-w-5xl">
        <MetricCardsRow />
      </div>

      {/* Module View Tabs */}
      <section className="relative z-10 flex justify-center px-4 my-2 mb-4">
        <div className="inline-flex p-1 rounded-xl bg-[#101336] border border-[#262a63] backdrop-blur-xl shadow-lg">
          {/* Astrology Tab */}
          <button
            onClick={() => setActiveTab('astrology')}
            className={`relative px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'astrology' ? 'text-white' : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            {activeTab === 'astrology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3858f6] to-[#00d2ff] shadow-md shadow-[#3858f6]/30 -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>✨</span>
            <span>1. Ephemeris Engine</span>
            {astrologyData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Psychology Tab */}
          <button
            onClick={() => setActiveTab('psychology')}
            className={`relative px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'psychology' ? 'text-white' : 'text-[#7b82b8] hover:text-white'
            }`}
          >
            {activeTab === 'psychology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3858f6] to-[#00d2ff] shadow-md shadow-[#3858f6]/30 -z-10"
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
      <div className="w-full flex-1 flex items-center justify-center py-2">
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
            <div className="dashboard-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-[#3858f6]/50 shadow-xl shadow-[#3858f6]/10">
              <div className="text-left">
                <div className="text-xs font-bold uppercase font-mono tracking-wider text-[#00d2ff]">
                  Assessments Complete
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Synthesize Astrology & Jungian Cognitive Dossier
                </div>
              </div>

              <motion.button
                onClick={handleGenerateCosmicBlueprint}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full sm:w-auto shrink-0 !py-3.5 !px-6"
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
  const [activeTab, setActiveTab] = useState('astrology') // 'astrology' | 'psychology'
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <div className="min-h-screen bg-[#0b0e29] text-[#e2e8f0] flex">
        {/* Left Fixed Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Workspace Wrapper */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
          {/* Top Executive Header */}
          <Header
            activeTab={activeTab}
            backendStatus={backendStatus}
            onRetryHealth={() => checkServer(0)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {/* Dynamic Route View */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <MainAssessment
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                }
              />
              <Route path="/blueprint/:id" element={<SharedDossier />} />
            </Routes>
          </main>

          {/* Footer Bar */}
          <footer className="w-full max-w-6xl mx-auto px-6 py-5 border-t border-[#262a63] text-center text-xs text-[#7b82b8] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <div>Astrologica &bull; Enterprise Ephemeris & Jungian Intelligence</div>
            <div className="text-[#6b729f]">FastAPI &bull; React 19 &bull; Swiss Ephemeris v2.10</div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}
