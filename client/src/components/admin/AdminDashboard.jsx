import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAdminConfig,
  updateAdminConfig,
  getAdminMessages,
  deleteAdminMessage,
  getAdminVisitors,
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
const UsersIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { adminToken, logoutAdmin, setSiteConfig, resetJourney } = useAppStore()

  const [activeTab, setActiveTab] = useState('banner')
  const [config, setConfig] = useState({ banner_message: '', show_banner: true, maintenance_mode: false })
  const [messages, setMessages] = useState([])
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!adminToken) { navigate('/admin'); return }
    const load = async () => {
      setLoading(true); setError(null)
      try {
        const [cfg, msgs, vis] = await Promise.all([
          getAdminConfig(adminToken),
          getAdminMessages(adminToken),
          getAdminVisitors(adminToken),
        ])
        setConfig(cfg); setSiteConfig(cfg)
        setMessages(msgs)
        setVisitors(vis)
      } catch (err) {
        if (err.response?.status === 401) { logoutAdmin(); navigate('/admin') }
        else setError('Could not retrieve admin telemetry from backend.')
      } finally { setLoading(false) }
    }
    load()
  }, [adminToken, navigate, logoutAdmin, setSiteConfig])

  const handleSaveConfig = async (e) => {
    e.preventDefault(); setError(null); setSaveSuccess(false)
    try {
      const updated = await updateAdminConfig(config, adminToken)
      setConfig(updated); setSiteConfig(updated); setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) { setError(err.response?.data?.detail || 'Failed to save configuration.') }
  }

  const handleDeleteMessage = async (id) => {
    try { await deleteAdminMessage(id, adminToken); setMessages(p => p.filter(m => m.id !== id)) }
    catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="w-full max-w-xl mx-auto text-center p-12 dashboard-card space-y-4">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-[#3858f6]/15 border border-[#3858f6]/30 flex items-center justify-center animate-spin text-xl text-[#00d2ff]">✦</div>
      <div className="text-base font-bold text-white">Loading Admin Console...</div>
    </div>
  )

  const TABS = [
    { id: 'banner',   icon: BellIcon,  label: 'Site Banner' },
    { id: 'messages', icon: MailIcon,  label: `Inquiries (${messages.length})` },
    { id: 'visitors', icon: UsersIcon, label: `Visitors (${visitors.length})` },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Bar */}
      <div className="dashboard-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-status bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated Session
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Platform Management Console</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { resetJourney(); navigate('/') }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3858f6]/20 to-[#00d2ff]/10 border border-[#3858f6]/40 hover:border-[#00d2ff]/60 text-white/80 hover:text-white text-xs font-bold tracking-wider transition cursor-pointer flex items-center gap-2"
          >
            <span className="text-[#00d2ff]">✦</span> Return to Universe
          </button>
          <button onClick={() => { logoutAdmin(); navigate('/admin') }}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold transition cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-[#101336] border border-[#262a63]">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === t.id ? 'bg-[#3858f6] text-white shadow-md' : 'text-[#7b82b8] hover:text-white'
              }`}>
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">⚠️ {error}</div>
      )}

      {/* TAB: Site Banner */}
      {activeTab === 'banner' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 space-y-6">
          <div className="border-b border-[#262a63] pb-4">
            <h2 className="text-base font-bold text-white">Global Announcement Banner</h2>
            <p className="text-xs text-[#7b82b8]">Broadcast announcements across all user sessions in real-time.</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold text-[#7b82b8]">Live Preview</label>
            {config.show_banner ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#3858f6]/20 via-[#161942] to-[#00d2ff]/20 border border-[#3858f6]/40 text-xs text-white font-medium flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="text-[#00d2ff]">✦</span><span>{config.banner_message || 'Preview...'}</span></div>
                <span className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">Active</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#101336] border border-[#262a63] text-xs text-[#6b729f] italic">Banner is toggled OFF.</div>
            )}
          </div>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="show_banner" checked={config.show_banner}
                onChange={e => setConfig({ ...config, show_banner: e.target.checked })}
                className="w-4 h-4 rounded bg-[#101336] border border-[#262a63] text-[#3858f6] cursor-pointer" />
              <label htmlFor="show_banner" className="text-xs font-bold text-white cursor-pointer">Enable banner on all pages</label>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#9aa0cf] mb-1.5">Banner Message</label>
              <input type="text" value={config.banner_message} onChange={e => setConfig({ ...config, banner_message: e.target.value })}
                placeholder="e.g. Swiss Ephemeris v2.2 active!"
                className="dashboard-input w-full" />
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button type="submit" className="btn-primary">Save Configuration</button>
              {saveSuccess && <span className="text-xs font-mono font-bold text-emerald-400">✓ Published!</span>}
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB: Messages */}
      {activeTab === 'messages' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#262a63] pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Contact Inquiries</h2>
              <p className="text-xs text-[#7b82b8]">Messages submitted via consultation forms.</p>
            </div>
            <span className="badge-status bg-[#101336] text-[#00d2ff] border border-[#262a63]">{messages.length} Messages</span>
          </div>
          {messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6b729f] italic">No inquiries found.</div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="p-4 rounded-xl bg-[#101336] border border-[#262a63] space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262a63] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{msg.name}</span>
                      <span className="text-[#00d2ff] font-mono">({msg.email})</span>
                      <span className="badge-status bg-[#161942] text-[#3858f6] border border-[#262a63]">{msg.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#7b82b8]">{new Date(msg.created_at).toLocaleString()}</span>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 cursor-pointer transition">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#c5c9f5] leading-relaxed pt-1">"{msg.message}"</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* TAB: Visitors */}
      {activeTab === 'visitors' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#262a63] pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Live Visitor Journey Log</h2>
              <p className="text-xs text-[#7b82b8]">Real-time session paths through the cinematic experience.</p>
            </div>
            <span className="badge-status bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {visitors.length} Sessions
            </span>
          </div>
          {visitors.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6b729f] italic">No visitor sessions recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {visitors.map(v => (
                <div key={v.session_id} className="p-4 rounded-xl bg-[#101336] border border-[#262a63] space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262a63] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#3858f6]/20 border border-[#3858f6]/30 flex items-center justify-center text-[#00d2ff] font-bold text-[10px]">
                        {(v.name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-white">{v.name || 'Anonymous'}</span>
                      <span className="font-mono text-[#7b82b8] text-[10px]">{v.session_id?.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#7b82b8]">
                      <span>Started: {v.started_at ? new Date(v.started_at).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                  {v.action_log && v.action_log.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#6b729f] tracking-wider mb-1">Journey Path</div>
                      <div className="flex flex-wrap gap-1.5">
                        {v.action_log.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#1c2154] border border-[#262a63] text-[10px] font-mono text-[#c5c9f5]">
                            {i + 1}. {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
