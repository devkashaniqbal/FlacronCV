'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] dark:from-stone-800 dark:via-stone-700 dark:to-stone-800',
        roundedMap[rounded],
        className,
      )}
      style={{ width, height }}
    />
  );
}
