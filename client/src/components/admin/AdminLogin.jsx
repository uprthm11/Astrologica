import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminLogin } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'

const LockIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

export default function AdminLogin() {
  const navigate = useNavigate()
  const setAdminToken = useAppStore((state) => state.setAdminToken)

  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await adminLogin({ username: username.trim(), password: password.trim() })
      if (data && data.access_token) {
        setAdminToken(data.access_token)
        navigate('/admin/dashboard')
      } else {
        setError('Authentication response did not contain access token.')
      }
    } catch (err) {
      console.error('Admin Login Error:', err)
      setError(
        err.response?.data?.detail || 'Authentication failed. Please verify admin credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto py-8 text-left">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card p-8 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#262a63] pb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#3858f6]/15 border border-[#3858f6]/30 flex items-center justify-center text-[#00d2ff] shadow-md shadow-[#3858f6]/20">
            <LockIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Astrologica Admin Console
          </h2>
          <p className="text-xs text-[#7b82b8] font-mono">
            Restricted Security Gateway & Telemetry Control
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#9aa0cf] mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dashboard-input w-full font-mono text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#9aa0cf] mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dashboard-input w-full font-mono text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 font-bold"
            >
              {loading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <span>Enter Admin Console →</span>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3 rounded-xl bg-[#101336] border border-[#262a63] text-[11px] font-mono text-[#7b82b8] text-center">
          Default Credentials: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs font-mono text-[#7b82b8] hover:text-[#00d2ff] transition"
          >
            ← Return to Public Assessment
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
