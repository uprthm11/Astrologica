import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import BlueprintForm from './components/BlueprintForm'
import MBTIQuiz from './components/MBTIQuiz'

export default function App() {
  const [activeTab, setActiveTab] = useState('astrology') // 'astrology' | 'psychology'
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
          </button>
        </div>
      </section>

      {/* Main Tab Content Display */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
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
              <BlueprintForm />
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
              <MBTIQuiz />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        Astrologica &bull; FastAPI + React 19 + MongoDB + Flatlib Ephemeris &bull; Cognitive Personality Archetypes
      </footer>
    </div>
  )
}
