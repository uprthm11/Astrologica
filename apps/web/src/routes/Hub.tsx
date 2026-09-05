import React from 'react';
import { getEnabledModules } from '@lib/moduleRegistry';
import { useWebGLStore } from '@stores';
import {
  CinematicHeading,
  CinematicBody,
  CinematicCard,
  GlowIcon,
} from '@ui-kit';

export const Hub: React.FC = () => {
  const modules = getEnabledModules();
  const setCameraTargetZ = useWebGLStore((s) => s.setCameraTargetZ);
  const resetCameraTargetZ = useWebGLStore((s) => s.resetCameraTargetZ);

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
        <CinematicHeading level={1} tracking="widest" className="mb-4">
          Astrologica
        </CinematicHeading>
        <CinematicBody variant="lead" className="max-w-md text-zinc-400">
          High-precision astrological ephemeris computing, psychodynamic synthesis, and typological matrices.
        </CinematicBody>
      </header>

      {/* Dynamic Module Grid (Driven by Registry & UI Kit Primitives) */}
      <main className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {modules.map((mod) => (
          <CinematicCard
            key={mod.id}
            data-testid={`module-card-${mod.id}`}
            glowColor={mod.glowColor}
            onMouseEnter={() => setCameraTargetZ(85)}
            onMouseLeave={() => resetCameraTargetZ()}
            className="cursor-pointer"
          >
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
              <CinematicHeading
                level={3}
                tracking="wide"
                gradient={false}
                className="text-zinc-100 group-hover:text-white transition-colors mb-2.5"
              >
                {mod.name}
              </CinematicHeading>

              {/* Description */}
              <CinematicBody variant="normal" className="text-zinc-400 mb-6">
                {mod.description}
              </CinematicBody>
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
          </CinematicCard>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative mt-16 text-center">
        <CinematicBody variant="caption" className="text-zinc-600 font-mono tracking-widest uppercase">
          Autonomous Monorepo Architecture &bull; Pluggable Module System
        </CinematicBody>
      </footer>
    </div>
  );
};

export default Hub;
