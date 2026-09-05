import React from 'react';

export interface CinematicBodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'lead' | 'normal' | 'caption' | 'mono';
  dimmed?: boolean;
  children: React.ReactNode;
}

export const CinematicBody: React.FC<CinematicBodyProps> = ({
  variant = 'normal',
  dimmed = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    lead: 'text-sm sm:text-base font-light leading-relaxed',
    normal: 'text-xs sm:text-sm font-light leading-relaxed',
    caption: 'text-[11px] font-normal tracking-wider',
    mono: 'text-xs font-mono tracking-widest uppercase',
  }[variant];

  const colorClass = dimmed ? 'text-zinc-500' : variant === 'caption' ? 'text-zinc-400' : 'text-zinc-300';

  return (
    <p className={`${variantStyles} ${colorClass} ${className}`} {...props}>
      {children}
    </p>
  );
};

export default CinematicBody;
