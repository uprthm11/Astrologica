import React from 'react'

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const BellIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const MenuIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export default function Header({ backendStatus, onRetryHealth, activeTab, onOpenSidebar }) {
  const sectionTitle =
    activeTab === 'astrology'
      ? 'Dual Ephemeris Calculation Console'
      : 'Jungian Psychometrics Assessment'

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0e29]/90 backdrop-blur-xl border-b border-[#262a63]">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#161942] border border-[#262a63] text-[#9aa0cf] hover:text-white"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#7b82b8] flex items-center gap-1.5">
              <span>CONSOLE</span>
              <span className="text-[#3858f6]">&gt;</span>
              <span className="text-[#00d2ff]">
                {activeTab === 'astrology' ? 'EPHEMERIS' : 'PSYCHOMETRICS'}
              </span>
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              {sectionTitle}
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-[#6b729f] pointer-events-none">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search planets, nakshatras, cognitive functions, archetypes..."
              className="w-full bg-[#101336] border border-[#262a63] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#6b729f] focus:border-[#3858f6] focus:ring-1 focus:ring-[#3858f6] outline-none transition"
            />
          </div>
        </div>

        {/* Right Action Hub & Telemetry */}
        <div className="flex items-center gap-3">
          {/* Live Telemetry Server Status Badge */}
          {backendStatus.state === 'online' ? (
            <span className="badge-status bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-900/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API: Online
            </span>
          ) : backendStatus.state === 'waking' ? (
            <button
              onClick={onRetryHealth}
              title="Render free tier spinning up"
              className="badge-status bg-amber-950/80 border border-amber-500/40 text-amber-300 animate-pulse cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              API: Waking Up...
            </button>
          ) : backendStatus.state === 'checking' ? (
            <span className="badge-status bg-[#161942] border border-[#262a63] text-[#7b82b8]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              API: Connecting...
            </span>
          ) : (
            <button
              onClick={onRetryHealth}
              title="Click to retry connecting to API"
              className="badge-status bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 transition cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              API: Offline (Retry)
            </button>
          )}

          {/* Notification Hub */}
          <div className="relative">
            <button className="p-2 rounded-xl bg-[#161942] border border-[#262a63] text-[#9aa0cf] hover:text-white transition relative">
              <BellIcon className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00d2ff]" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#262a63]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3858f6] to-[#00d2ff] p-0.5 flex items-center justify-center shadow-md shadow-[#3858f6]/30">
              <div className="w-full h-full bg-[#101336] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#00d2ff]">
                ✦
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-none">
                Cosmic Admin
              </div>
              <div className="text-[10px] font-mono text-[#7b82b8] leading-none mt-1">
                Astrologer Pro
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
