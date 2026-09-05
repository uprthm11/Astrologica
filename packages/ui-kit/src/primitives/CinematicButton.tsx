import React from 'react';

export interface CinematicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CinematicButton: React.FC<CinematicButtonProps> = ({
  variant = 'secondary',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3 text-sm',
  }[size];

  const variantStyles = {
    primary: 'bg-white text-black hover:bg-zinc-200 border border-transparent shadow-lg shadow-white/10',
    secondary: 'bg-white/[0.04] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.18]',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent',
    glow: 'bg-white/[0.06] text-white border border-white/[0.12] hover:border-white/[0.3]',
  }[variant];

  return (
    <button
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      style={variant === 'glow' ? { boxShadow: `0 0 20px ${glowColor}` } : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default CinematicButton;
