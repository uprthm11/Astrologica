import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import BlueprintForm from './components/BlueprintForm'

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
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Background Starry / Nebula Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation / Brand Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-900/40">
            ✦
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-300 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Astrologica
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest -mt-1 font-semibold">
              FARM Personality Stack
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

      {/* Main Content Area: Centered BlueprintForm */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <BlueprintForm />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-600">
        Astrologica &bull; FastAPI + React 19 + MongoDB + Flatlib Swiss Ephemeris
      </footer>
    </div>
  )
}
