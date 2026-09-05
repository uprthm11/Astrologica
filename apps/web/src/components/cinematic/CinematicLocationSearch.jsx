import React from 'react';

export default function CinematicLocationSearch({ onSelect }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-sm uppercase tracking-widest text-blue-300/60 font-light">
        Geographical Parameters
      </div>
      <button
        onClick={() => onSelect && onSelect({
          lat: 22.7196,
          lng: 75.8577,
          locationName: 'Indore, Madhya Pradesh, India',
          utcOffset: '+05:30',
          timezone: 'Asia/Kolkata'
        })}
        className="px-6 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10 text-xs tracking-wider transition-all"
      >
        Select Default Coordinates (Indore, India)
      </button>
    </div>
  );
}
