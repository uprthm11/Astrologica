import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminLogin } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import { CinematicButton, CinematicGhostButton, fadeUp } from '../cinematic/CinematicPrimitives'

const TS = { textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)' }

export default function AdminLogin() {
  const navigate = useNavigate()
  const setAdminToken = useAppStore((state) => state.setAdminToken)
  const goBack = useAppStore((state) => state.goBack)

  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!password) return
    setLoading(true)
    setError(null)

    try {
      const data = await adminLogin({ username: 'admin', password: password.trim() })
      if (data && data.access_token) {
        setAdminToken(data.access_token)
        navigate('/admin/dashboard')
      } else {
        setError('Authorization failed.')
      }
    } catch (_) {
      setError('INVALID AUTHORIZATION CODE')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-10">
      {/* Title */}
      <motion.h2
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{
          ...TS,
          color: 'white',
          fontSize: 'clamp(1.5rem, 4.5vw, 2.5rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        ENTER AUTHORIZATION CODE
      </motion.h2>

      {/* Minimalist borderless password input */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="w-full max-w-xs space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="authorization code…"
          autoFocus
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(160,200,255,0.3)',
            outline: 'none',
            color: 'white',
            textAlign: 'center',
            textShadow: '0 0 12px rgba(160,200,255,0.4)',
            caretColor: 'rgba(160,200,255,0.7)',
            width: '100%',
          }}
          className="text-xl font-light tracking-[0.3em] py-3 placeholder-white/20"
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: 'rgba(255,140,140,0.85)', fontSize: '11px', letterSpacing: '0.2em' }}
            className="font-mono"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-6">
        <CinematicButton onClick={handleSubmit} disabled={loading || !password}>
          {loading ? 'AUTHENTICATING…' : 'AUTHENTICATE'}
        </CinematicButton>

        <CinematicGhostButton onClick={goBack}>
          ← BACK
        </CinematicGhostButton>
      </div>
    </div>
  )
}
