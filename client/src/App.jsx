import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

function Home() {
  const [apiStatus, setApiStatus] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/health', { timeout: 3000 })
        setApiStatus({ loading: false, data: response.data, error: null })
      } catch (err) {
        setApiStatus({
          loading: false,
          data: null,
          error: 'Backend offline (run `uvicorn main:app --reload` inside server/)'
        })
      }
    }
    checkBackend()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl text-center space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-950/60 border border-purple-500/30 rounded-full">
          FARM Stack Scaffolded
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
          Personality Application
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto">
          FastAPI + React + MongoDB architecture with Vite, Tailwind CSS, Framer Motion, and Axios.
        </p>

        {/* Status Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <span className="text-sm font-medium text-slate-400">Backend Connection</span>
            {apiStatus.loading ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Checking...
              </span>
            ) : apiStatus.data ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Offline
              </span>
            )}
          </div>

          <div className="text-sm text-slate-300">
            {apiStatus.loading && <p>Pinging FastAPI server at <code className="text-purple-300">http://localhost:8000</code>...</p>}
            {apiStatus.data && (
              <pre className="p-3 bg-slate-950 rounded-lg text-emerald-400 text-xs overflow-x-auto">
                {JSON.stringify(apiStatus.data, null, 2)}
              </pre>
            )}
            {apiStatus.error && (
              <p className="text-rose-400 text-xs">{apiStatus.error}</p>
            )}
          </div>
        </motion.div>

        {/* Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="font-semibold text-purple-400 text-sm">FastAPI</h3>
            <p className="text-xs text-slate-400 mt-1">Python async backend with PyMongo</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="font-semibold text-cyan-400 text-sm">React + Vite</h3>
            <p className="text-xs text-slate-400 mt-1">Fast frontend with HMR</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="font-semibold text-emerald-400 text-sm">MongoDB</h3>
            <p className="text-xs text-slate-400 mt-1">AsyncMongoClient persistence</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="font-semibold text-pink-400 text-sm">Tailwind + Motion</h3>
            <p className="text-xs text-slate-400 mt-1">Modern UI & smooth animations</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/about"
            className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
          >
            About Application
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-slate-950 text-slate-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-left"
      >
        <h2 className="text-2xl font-bold text-slate-100">About the Architecture</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          This workspace is configured with a modular FARM stack architecture:
        </p>
        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          <li><strong className="text-purple-300">Client:</strong> Vite, React Router, Tailwind CSS, Framer Motion, Axios</li>
          <li><strong className="text-purple-300">Server:</strong> FastAPI, Async PyMongo, Flatlib, Pydantic</li>
          <li><strong className="text-purple-300">CORS:</strong> Configured for Vite dev server (<code className="text-xs bg-slate-950 px-1.5 py-0.5 rounded">http://localhost:5173</code>)</li>
        </ul>
        <Link 
          to="/"
          className="inline-block px-4 py-2 text-sm font-medium text-purple-300 bg-purple-950/60 border border-purple-500/30 rounded-lg hover:bg-purple-900/50 transition"
        >
          &larr; Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
