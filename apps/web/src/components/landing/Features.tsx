'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Layout, Globe, Download, GripVertical, Target } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const featureIcons = [Sparkles, Layout, Globe, Download, GripVertical, Target];

export default function Features() {
  const t = useTranslations();
  const { ref: headingRef, isInView: headingInView } = useInView({ threshold: 0.2 });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.1 });

  const features = [
    { icon: Sparkles, key: 'ai_writing', color: 'from-violet-500 to-purple-600' },
    { icon: Layout, key: 'templates', color: 'from-brand-500 to-brand-600' },
    { icon: Globe, key: 'multilingual', color: 'from-emerald-500 to-teal-600' },
    { icon: Download, key: 'export', color: 'from-amber-500 to-orange-600' },
    { icon: GripVertical, key: 'drag_drop', color: 'from-pink-500 to-rose-600' },
    { icon: Target, key: 'ats', color: 'from-cyan-500 to-brand-600' },
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headingRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${headingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
            {t('features.subtitle')}
          </p>
        </div>

        <div ref={gridRef} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, key, color }, index) => (
            <div
              key={key}
              className={`group relative rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg hover:-translate-y-1 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-brand-800 ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDuration: '500ms', transitionDelay: gridInView ? `${index * 100}ms` : '0ms' }}
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900 dark:text-white">
                {t(`features.${key}`)}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {t(`features.${key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
