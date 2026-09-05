import React from 'react';

export interface CinematicScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  orientation?: 'vertical' | 'horizontal' | 'both';
  children: React.ReactNode;
}

export const CinematicScrollArea: React.FC<CinematicScrollAreaProps> = ({
  maxHeight = '100%',
  orientation = 'vertical',
  className = '',
  children,
  ...props
}) => {
  const overflowClass = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto',
  }[orientation];

  return (
    <div
      className={`relative scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${overflowClass} ${className}`}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </div>
  );
};

export default CinematicScrollArea;
