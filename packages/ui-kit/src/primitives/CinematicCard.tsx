import React from 'react';

export interface CinematicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  hoverable?: boolean;
  padded?: boolean;
  children: React.ReactNode;
}

export const CinematicCard: React.FC<CinematicCardProps> = ({
  glowColor = 'rgba(99, 102, 241, 0.25)',
  hoverable = true,
  padded = true,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-zinc-950/60 border border-white/[0.07] backdrop-blur-xl overflow-hidden transition-all duration-300 ${
        hoverable ? 'hover:border-white/[0.18] hover:bg-zinc-900/40 hover:-translate-y-1' : ''
      } ${padded ? 'p-7' : ''} ${className}`}
      {...props}
    >
      {/* Subtle radial glow positioned in top corner */}
      {hoverable && (
        <div
          className="pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: glowColor }}
        />
      )}
      {children}
    </div>
  );
};

export default CinematicCard;
