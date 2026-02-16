'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-800',
        hover && 'transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        paddings[padding],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
