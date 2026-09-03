import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAdminConfig,
  updateAdminConfig,
  getAdminMessages,
  deleteAdminMessage,
} from '../../services/api'
import { useAppStore } from '../../store/useAppStore'

const BellIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const MailIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { adminToken, logoutAdmin, setSiteConfig } = useAppStore()

  const [activeTab, setActiveTab] = useState('banner') // 'banner' | 'messages' | 'telemetry'
  const [config, setConfig] = useState({
    banner_message: '',
    show_banner: true,
    maintenance_mode: false,
  })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if unauthenticated
  useEffect(() => {
    if (!adminToken) {
      navigate('/admin')
      return
    }

    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [configData, messagesData] = await Promise.all([
          getAdminConfig(adminToken),
          getAdminMessages(adminToken),
        ])
        setConfig(configData)
        setSiteConfig(configData)
        setMessages(messagesData)
      } catch (err) {
        console.error('Failed to load admin data:', err)
        if (err.response?.status === 401) {
          logoutAdmin()
          navigate('/admin')
        } else {
          setError('Could not retrieve admin telemetry from backend.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [adminToken, navigate, logoutAdmin, setSiteConfig])

  const handleSaveConfig = async (e) => {
    e.preventDefault()
    setError(null)
    setSaveSuccess(false)
    try {
      const updated = await updateAdminConfig(config, adminToken)
      setConfig(updated)
      setSiteConfig(updated)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save config:', err)
      setError(err.response?.data?.detail || 'Failed to save configuration.')
    }
  }

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteAdminMessage(msgId, adminToken)
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
    } catch (err) {
      console.error('Delete message error:', err)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin')
  }

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-12 dashboard-card space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#3858f6]/15 border border-[#3858f6]/30 flex items-center justify-center animate-spin text-xl text-[#00d2ff]">
          ✦
        </div>
        <div className="text-base font-bold text-white">Loading Admin Console...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Header Bar */}
      <div className="dashboard-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-status bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated Session
            </span>
            <span className="text-xs font-mono text-[#7b82b8]">Role: System Administrator</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Platform Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="btn-secondary text-xs"
          >
            ← View App
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-[#101336] border border-[#262a63]">
        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'banner'
              ? 'bg-[#3858f6] text-white shadow-md'
              : 'text-[#7b82b8] hover:text-white'
          }`}
        >
          <BellIcon className="w-4 h-4" />
          <span>Site Banner & Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-[#3858f6] text-white shadow-md'
              : 'text-[#7b82b8] hover:text-white'
          }`}
        >
          <MailIcon className="w-4 h-4" />
          <span>Inquiries ({messages.length})</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* TAB 1: Site Banner Configuration */}
      {activeTab === 'banner' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-card p-6 space-y-6"
        >
          <div className="border-b border-[#262a63] pb-4">
            <h2 className="text-base font-bold text-white">Global Announcement Banner</h2>
            <p className="text-xs text-[#7b82b8]">
              Broadcast real-time announcements, maintenance advisories, or ephemeris updates across all user sessions.
            </p>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold text-[#7b82b8]">
              Live Preview
            </label>
            {config.show_banner ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#3858f6]/20 via-[#161942] to-[#00d2ff]/20 border border-[#3858f6]/40 text-xs text-white font-medium flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-[#00d2ff]">✦</span>
                  <span>{config.banner_message || 'Announcement message preview...'}</span>
                </div>
                <span className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">
                  Active
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#101336] border border-[#262a63] text-xs text-[#6b729f] italic">
                Banner is currently toggled OFF (Hidden from users).
              </div>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show_banner"
                checked={config.show_banner}
                onChange={(e) => setConfig({ ...config, show_banner: e.target.checked })}
                className="w-4 h-4 rounded bg-[#101336] border border-[#262a63] text-[#3858f6] focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="show_banner"
                className="text-xs font-bold text-white cursor-pointer select-none"
              >
                Enable and display announcement banner on all pages
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#9aa0cf] mb-1.5">
                Banner Message Text
              </label>
              <input
                type="text"
                value={config.banner_message}
                onChange={(e) => setConfig({ ...config, banner_message: e.target.value })}
                placeholder="e.g. ✦ Swiss Ephemeris v2.2 active with KP & Raman Ayanamsha calibration!"
                className="dashboard-input w-full"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="btn-primary"
              >
                Save Site Configuration
              </button>
              {saveSuccess && (
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ✓ Configuration successfully published to database!
                </span>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 2: User Inquiries & Messages */}
      {activeTab === 'messages' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-card p-6 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#262a63] pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Received Consultation & Contact Inquiries</h2>
              <p className="text-xs text-[#7b82b8]">
                Messages sent through user consultation forms.
              </p>
            </div>
            <span className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">
              {messages.length} Messages
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6b729f] italic">
              No inquiries found in the database.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-[#101336] border border-[#262a63] space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262a63] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{msg.name}</span>
                      <span className="text-[#00d2ff] font-mono">({msg.email})</span>
                      <span className="badge-status bg-[#161942] text-[#3858f6] border border-[#262a63]">
                        {msg.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#7b82b8]">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition cursor-pointer"
                        title="Delete message"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#c5c9f5] leading-relaxed pt-1">
                    "{msg.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
