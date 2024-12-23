import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm p-6',
        hover && 'transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]',
        className
      )}
    >
      {children}
    </div>
  );
}