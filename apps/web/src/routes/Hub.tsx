import React from 'react';
import { getEnabledModules } from '@lib/moduleRegistry';

export const Hub: React.FC = () => {
  const modules = getEnabledModules();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-zinc-100 selection:bg-indigo-500/30">
      {/* Cinematic Ambient Backdrop Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-indigo-950/20 blur-[140px]" />
      </div>

      {/* Header Branding */}
      <header className="relative flex flex-col items-center text-center max-w-2xl mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
            Platform Engine v1.0
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
          Astrologica
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-md leading-relaxed">
          High-precision astrological ephemeris computing, psychodynamic synthesis, and typological matrices.
        </p>
      </header>

      {/* Dynamic Module Grid (Driven by Registry) */}
      <main className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {modules.map((mod) => (
          <article
            key={mod.id}
            data-testid={`module-card-${mod.id}`}
            className="group relative flex flex-col justify-between p-7 rounded-2xl bg-zinc-950/60 border border-white/[0.07] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] hover:bg-zinc-900/40 hover:-translate-y-1 overflow-hidden"
          >
            {/* Subtle glow behind card */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: mod.glowColor }}
            />

            <div>
              {/* Category and Tag */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
                  style={{
                    color: mod.accentColor,
                    borderColor: `${mod.accentColor}33`,
                    backgroundColor: `${mod.accentColor}11`,
                  }}
                >
                  {mod.tag}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                  {mod.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-light tracking-wide text-zinc-100 group-hover:text-white transition-colors mb-2.5">
                {mod.name}
              </h2>

              {/* Description */}
              <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                {mod.description}
              </p>
            </div>

            {/* Footer Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
                STATUS
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-zinc-300 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                COMING SOON
              </span>
            </div>
          </article>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative mt-16 text-center">
        <p className="text-[11px] font-mono text-zinc-600 tracking-widest uppercase">
          Autonomous Monorepo Architecture &bull; Pluggable Module System
        </p>
      </footer>
    </div>
  );
};

export default Hub;
