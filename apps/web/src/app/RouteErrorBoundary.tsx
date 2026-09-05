import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  let errorMessage = 'An unexpected planetary alignment disruption occurred.';
  let errorTitle = 'Orbital Anomaly';

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center text-zinc-100">
      <div className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-3 px-3 py-1 rounded bg-rose-950/40 border border-rose-800/30">
        System Boundary Warning
      </div>
      <h2 className="text-3xl font-light tracking-wide mb-3">{errorTitle}</h2>
      <p className="text-sm text-zinc-400 max-w-md font-light mb-6 leading-relaxed">
        {errorMessage}
      </p>
      <Link
        to="/"
        className="px-5 py-2 rounded-full text-xs font-mono tracking-widest uppercase bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.15] transition-colors"
      >
        Return to Navigation Hub
      </Link>
    </div>
  );
};

export default RouteErrorBoundary;
