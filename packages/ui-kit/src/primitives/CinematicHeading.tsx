import React from 'react';

export interface CinematicHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  gradient?: boolean;
  tracking?: 'normal' | 'wide' | 'widest' | 'ultra';
  children: React.ReactNode;
}

export const CinematicHeading: React.FC<CinematicHeadingProps> = ({
  level = 1,
  gradient = true,
  tracking = 'widest',
  className = '',
  children,
  ...props
}) => {
  const trackingClasses = {
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    widest: 'tracking-widest',
    ultra: 'tracking-[0.25em]',
  }[tracking];

  const gradientClass = gradient
    ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500'
    : 'text-zinc-100';

  const baseStyle = `font-extralight uppercase ${trackingClasses} ${gradientClass} ${className}`;

  if (level === 1) {
    return <h1 className={`text-4xl sm:text-6xl ${baseStyle}`} {...props}>{children}</h1>;
  }
  if (level === 2) {
    return <h2 className={`text-2xl sm:text-3xl font-light ${baseStyle}`} {...props}>{children}</h2>;
  }
  if (level === 3) {
    return <h3 className={`text-xl sm:text-2xl font-light ${baseStyle}`} {...props}>{children}</h3>;
  }
  return <h4 className={`text-lg sm:text-xl font-light ${baseStyle}`} {...props}>{children}</h4>;
};

export default CinematicHeading;
