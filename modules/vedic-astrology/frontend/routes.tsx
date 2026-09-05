import React from 'react';

export const VedicAstrologyComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-3 px-2 py-1 rounded bg-amber-950/40 border border-amber-800/30">
        Module Staging
      </span>
      <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-zinc-100 mb-3">
        Vedic Astrology
      </h2>
      <p className="text-sm text-zinc-400 max-w-md font-light leading-relaxed mb-6">
        Sidereal zodiac calculations, 27 Nakshatras, and Vimshottari Dasha timelines.
      </p>
      <div className="text-xs font-mono text-zinc-500 tracking-wider">
        STATUS: COMING SOON
      </div>
    </div>
  );
};

export default VedicAstrologyComingSoon;
