import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// Inline SVG Icons for clean zero-dependency rendering
const DashboardIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const SparklesIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const BrainIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const DossierIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const TerminalIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const location = useLocation()
  const isDossierPage = location.pathname.startsWith('/blueprint')

  const navItems = [
    {
      id: 'astrology',
      label: 'Ephemeris Engine',
      description: 'Dual Tropical & Sidereal',
      icon: SparklesIcon,
      accent: 'text-[#00d2ff]',
      onClick: () => {
        if (setActiveTab) setActiveTab('astrology')
        if (setIsOpen) setIsOpen(false)
      }
    },
    {
      id: 'psychology',
      label: 'Psychometrics',
      description: 'Jungian 8-Function Stack',
      icon: BrainIcon,
      accent: 'text-[#3858f6]',
      onClick: () => {
        if (setActiveTab) setActiveTab('psychology')
        if (setIsOpen) setIsOpen(false)
      }
    }
  ]

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0d1033] border-r border-[#262a63] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Logo Section */}
        <div>
          <div className="p-5 border-b border-[#262a63] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3858f6] via-[#2435a8] to-[#00d2ff] p-0.5 shadow-lg shadow-[#3858f6]/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0e29] rounded-[10px] flex items-center justify-center text-[#00d2ff] font-black text-lg">
                  ✦
                </div>
              </div>
              <div className="text-left">
                <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Astrologica</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1f245c] text-[#00d2ff] border border-[#2e3682]">
                    v2.1
                  </span>
                </div>
                <div className="text-[10px] uppercase font-mono text-[#7b82b8] tracking-wider">
                  Enterprise Console
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-[#161942] text-[#7b82b8] hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="p-4 space-y-6">
            <div>
              <div className="px-3 text-[10px] uppercase font-mono font-bold text-[#6b729f] tracking-wider mb-2">
                Core Modules
              </div>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = !isDossierPage && activeTab === item.id
                  const Icon = item.icon

                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer group relative ${
                        isActive
                          ? 'bg-[#1c2154] text-white border border-[#3858f6]/50 shadow-md shadow-[#3858f6]/10'
                          : 'text-[#9aa0cf] hover:text-white hover:bg-[#151945]'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gradient-to-b from-[#3858f6] to-[#00d2ff]" />
                      )}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isActive
                            ? 'bg-[#3858f6]/20 text-[#00d2ff] border border-[#3858f6]/40'
                            : 'bg-[#141842] text-[#7b82b8] group-hover:text-white group-hover:bg-[#1a1f54]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] font-mono text-[#6b729f] truncate">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Platform Sub-sections */}
            <div>
              <div className="px-3 text-[10px] uppercase font-mono font-bold text-[#6b729f] tracking-wider mb-2">
                Intelligence & Storage
              </div>
              <div className="space-y-1.5">
                <Link
                  to="/"
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-3 ${
                    isDossierPage
                      ? 'bg-[#1c2154] text-white border border-[#3858f6]/50'
                      : 'text-[#9aa0cf] hover:text-white hover:bg-[#151945]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#141842] text-[#7b82b8] flex items-center justify-center shrink-0">
                    <DossierIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white leading-tight">
                      Saved Dossiers
                    </div>
                    <div className="text-[10px] font-mono text-[#6b729f]">
                      MongoDB Profile Store
                    </div>
                  </div>
                </Link>

                <div className="px-3.5 py-2.5 rounded-xl bg-[#12163b]/60 border border-[#1f245c] text-xs text-[#7b82b8] flex items-center gap-2.5">
                  <TerminalIcon className="w-4 h-4 text-[#00d2ff] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[#c5c9f5]">Swiss Ephemeris</div>
                    <div className="text-[10px] font-mono text-[#6b729f]">Ayanamshas: Lahiri/KP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom System Telemetry Card */}
        <div className="p-4 border-t border-[#262a63] bg-[#0b0e29]/70">
          <div className="p-3 rounded-xl bg-[#141842] border border-[#262a63] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#c5c9f5]">System Telemetry</span>
              <span className="badge-status bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#7b82b8] space-y-0.5">
              <div className="flex justify-between">
                <span>FastAPI Engine</span>
                <span className="text-[#00d2ff]">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Cache</span>
                <span className="text-white">Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
