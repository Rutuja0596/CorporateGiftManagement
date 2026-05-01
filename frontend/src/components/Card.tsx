import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  hoverEffect = true 
}: CardProps) => {
  const baseClasses = 'glass-effect rounded-2xl p-6 shadow-xl border-0';
  const hoverClasses = hoverEffect 
    ? 'hover:shadow-2xl hover:-translate-y-2 hover:bg-white/50 transition-all duration-300' 
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};
