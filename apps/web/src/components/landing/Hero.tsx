'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function Hero() {
  const t = useTranslations();
  const { ref: contentRef, isInView: contentInView } = useInView({ threshold: 0.1 });
  const { ref: mockupRef, isInView: mockupInView } = useInView({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white dark:from-brand-950/20 dark:via-stone-950 dark:to-stone-950" />
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-600/5" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div
          ref={contentRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
            <Sparkles className="h-4 w-4" />
            Powered by AI
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white">
            {t('hero.title').split('AI').map((part, i) =>
              i === 0 ? (
                <span key={i}>
                  {part}
                  <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
                    AI
                  </span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h1>

          {/* Subtitle */}
          <p className="mb-6 text-lg text-stone-600 sm:text-xl dark:text-stone-400">
            {t('hero.subtitle')}
          </p>

          {/* Proof point */}
          <div className="mb-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/60">
            <span className="flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300">
              <span className="text-brand-600">✓</span> ATS-friendly templates
            </span>
            <span className="hidden h-4 w-px bg-stone-300 dark:bg-stone-600 sm:block" />
            <span className="flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300">
              <span className="text-brand-600">✓</span> Export to PDF &amp; DOCX
            </span>
            <span className="hidden h-4 w-px bg-stone-300 dark:bg-stone-600 sm:block" />
            <span className="flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300">
              <span className="text-brand-600">✓</span> Ready in minutes
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button variant="gradient" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                {t('hero.cta_primary')}
              </Button>
            </Link>
            <a href="#features" className="text-sm font-medium text-stone-500 underline-offset-4 hover:text-stone-700 hover:underline dark:text-stone-400 dark:hover:text-stone-200 transition-colors">
              {t('hero.cta_secondary')} →
            </a>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ATS-optimized templates
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div
          ref={mockupRef}
          className={`relative mx-auto mt-16 max-w-5xl transition-all duration-700 delay-300 ${mockupInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="rounded-xl border border-stone-200 bg-white/50 p-2 shadow-2xl backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/50">
            <div className="rounded-lg bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900">
              <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-3 dark:border-stone-700">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ms-2 text-xs text-stone-400">FlacronCV Builder</span>
              </div>
              <div className="flex min-h-[350px] sm:min-h-[450px]">
                {/* Left editor mockup */}
                <div className="w-1/2 border-e border-stone-200 p-4 dark:border-stone-700">
                  <div className="mb-4 space-y-3">
                    <div className="h-4 w-32 rounded bg-brand-200 dark:bg-brand-800" />
                    <div className="h-3 w-full rounded bg-stone-200 dark:bg-stone-700" />
                    <div className="h-3 w-3/4 rounded bg-stone-200 dark:bg-stone-700" />
                  </div>
                  <div className="mb-4 space-y-3">
                    <div className="h-4 w-28 rounded bg-brand-200 dark:bg-brand-800" />
                    <div className="h-3 w-full rounded bg-stone-200 dark:bg-stone-700" />
                    <div className="h-3 w-5/6 rounded bg-stone-200 dark:bg-stone-700" />
                    <div className="h-3 w-2/3 rounded bg-stone-200 dark:bg-stone-700" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-24 rounded bg-brand-200 dark:bg-brand-800" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 rounded-full bg-brand-100 dark:bg-brand-900" />
                      <div className="h-6 w-20 rounded-full bg-brand-100 dark:bg-brand-900" />
                      <div className="h-6 w-14 rounded-full bg-brand-100 dark:bg-brand-900" />
                    </div>
                  </div>
                </div>
                {/* Right preview mockup */}
                <div className="w-1/2 p-4">
                  <div className="mx-auto max-w-[200px] rounded border border-stone-200 bg-white p-3 shadow-sm dark:border-stone-600 dark:bg-stone-800">
                    <div className="mb-2 h-3 w-24 rounded bg-stone-800 dark:bg-stone-200" />
                    <div className="mb-1 h-2 w-20 rounded bg-stone-400" />
                    <div className="mb-3 h-px w-full bg-brand-500" />
                    <div className="mb-2 space-y-1">
                      <div className="h-1.5 w-full rounded bg-stone-200 dark:bg-stone-600" />
                      <div className="h-1.5 w-5/6 rounded bg-stone-200 dark:bg-stone-600" />
                    </div>
                    <div className="mb-1 h-2 w-16 rounded bg-brand-300" />
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded bg-stone-200 dark:bg-stone-600" />
                      <div className="h-1.5 w-4/5 rounded bg-stone-200 dark:bg-stone-600" />
                      <div className="h-1.5 w-3/4 rounded bg-stone-200 dark:bg-stone-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-brand-400/20 via-violet-400/20 to-brand-400/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
