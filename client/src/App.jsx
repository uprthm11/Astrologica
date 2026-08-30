import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
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
      const payload = {
        astrology: astrologyData,
        mbti: mbtiData
      }
      const response = await axios.post(
        'http://localhost:8000/api/save-blueprint',
        payload
      )
      const blueprintId = response.data.id
      navigate(`/blueprint/${blueprintId}`)
    } catch (err) {
      console.error('Save Blueprint Error:', err)
      setSaveError(
        err.response?.data?.detail ||
          'Failed to save blueprint. Ensure the FastAPI server is running.'
      )
      setSaving(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sleek Animated Tab Navigation Menu */}
      <section className="relative z-10 flex justify-center px-4 my-2">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
          {/* Astrology Tab */}
          <button
            onClick={() => setActiveTab('astrology')}
            className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'astrology' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'astrology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-900/40 -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>✨</span>
            <span>Astrology (Blueprint)</span>
            {astrologyData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Psychology Tab */}
          <button
            onClick={() => setActiveTab('psychology')}
            className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2 z-10 ${
              activeTab === 'psychology' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'psychology' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-md shadow-indigo-900/40 -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>🧠</span>
            <span>Psychology (MBTI)</span>
            {mbtiData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>
      </section>

      {/* Main Tab Content Display */}
      <div className="w-full flex-1 flex items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'astrology' ? (
            <motion.div
              key="astrology-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
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
        <div className="mb-4 px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
          ⚠️ {saveError}
        </div>
      )}

      {/* --- Glowing, Animated 'Generate My Cosmic Blueprint' Button --- */}
      <AnimatePresence>
        {bothCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-full max-w-xl px-4 pt-4 pb-8"
          >
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <motion.button
                onClick={handleGenerateCosmicBlueprint}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-8 rounded-xl font-extrabold text-base sm:text-lg text-white bg-slate-950 hover:bg-slate-900 transition flex items-center justify-center gap-3 cursor-pointer shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-purple-400"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Synthesizing & Storing Cosmic Blueprint...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl animate-bounce">🔮</span>
                    <span className="bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
                      Generate My Cosmic Blueprint
                    </span>
                    <span className="text-xl">✨</span>
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
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true })

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get('http://localhost:8000/api/health', { timeout: 2500 })
        setBackendStatus({ online: true, checking: false })
      } catch (err) {
        setBackendStatus({ online: false, checking: false })
      }
    }
    checkServer()
  }, [])

  return (
    <BrowserRouter>
      <div className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white overflow-x-hidden">
        {/* Background Starry / Nebula Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-900/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-0 w-[500px] h-[350px] bg-cyan-900/10 rounded-full blur-[130px]" />
        </div>

        {/* Top Header & Brand */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-900/40">
              ✦
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-300 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Astrologica
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest -mt-1 font-semibold">
                Cosmic &bull; Psychological Blueprint
              </p>
            </div>
          </div>

          {/* Server Status Badge */}
          <div className="flex items-center gap-2">
            {backendStatus.checking ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                API: Connecting...
              </span>
            ) : backendStatus.online ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                API: Online (8000)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-950/60 border border-rose-500/30 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                API: Offline
              </span>
            )}
          </div>
        </header>

        {/* Routes View Container */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">
          <Routes>
            <Route path="/" element={<MainAssessment />} />
            <Route path="/blueprint/:id" element={<SharedDossier />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
          Astrologica &bull; FastAPI + React 19 + MongoDB + Flatlib Ephemeris &bull; Cognitive Personality Archetypes
        </footer>
      </div>
    </BrowserRouter>
  )
}
