import React from 'react';

export interface GlowIconProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GlowIcon: React.FC<GlowIconProps> = ({
  color = '#6366f1',
  glowColor,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const actualGlow = glowColor || `${color}40`;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-transform duration-300 ${sizeClasses} ${className}`}
      style={{
        boxShadow: `0 0 24px ${actualGlow}`,
        color,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowIcon;
