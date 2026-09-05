import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center text-zinc-100">
      <div className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-3">
        404 &bull; Celestial Anomaly
      </div>
      <h1 className="text-4xl font-extralight tracking-widest uppercase mb-4">
        Coordinates Not Found
      </h1>
      <p className="text-sm text-zinc-400 font-light max-w-sm mb-8 leading-relaxed">
        The requested navigational route does not map to any active planetary module.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors"
      >
        Return to Hub
      </Link>
    </div>
  );
};

export default NotFound;
