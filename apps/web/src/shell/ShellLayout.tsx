import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UniverseCanvas } from './UniverseCanvas';

export const ShellLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
      {/* 
        Persistent WebGL Canvas Singleton.
        Mounted ONCE in Shell outside the router Outlet so route changes NEVER unmount the canvas.
      */}
      <UniverseCanvas />

      {/* Top Ambient Navigation Bar */}
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

      {/* Main Outlet Container with Framer Motion Cross-Fade */}
      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ShellLayout;
