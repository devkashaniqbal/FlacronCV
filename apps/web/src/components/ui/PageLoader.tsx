'use client';

import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  text?: string;
}

export default function PageLoader({ text }: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      {text && <p className="text-sm text-stone-500 dark:text-stone-400">{text}</p>}
    </div>
  );
}
