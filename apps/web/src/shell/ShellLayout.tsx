import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const ShellLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
      {/* Top Ambient Navigation / Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-black/40 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-300">
            Astrologica
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span>MONOREPO FOUNDATION</span>
        </div>
      </header>

      {/* Main Outlet Container */}
      <div className="relative pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default ShellLayout;
