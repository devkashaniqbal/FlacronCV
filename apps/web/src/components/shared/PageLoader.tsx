'use client';

export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600 dark:border-stone-700 dark:border-t-brand-500" />
        </div>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Loading...</p>
      </div>
    </div>
  );
}
