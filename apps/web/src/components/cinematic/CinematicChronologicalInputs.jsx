import React from 'react';

export default function CinematicChronologicalInputs({ onComplete }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-sm uppercase tracking-widest text-blue-300/60 font-light">
        Chronological Parameters
      </div>
      <button
        onClick={() => onComplete && onComplete({ date: '2000-01-01', time: '12:00', isComplete: true })}
        className="px-6 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10 text-xs tracking-wider transition-all"
      >
        Set Standard Ephemeris Time (2000-01-01 12:00)
      </button>
    </div>
  );
}
