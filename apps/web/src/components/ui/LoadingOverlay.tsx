'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  text?: string;
  className?: string;
}

export default function LoadingOverlay({ text, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-black/80',
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      {text && <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{text}</p>}
    </div>
  );
}
