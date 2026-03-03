'use client';

import { useTranslations } from 'next-intl';
import { Star, BadgeCheck, Quote } from 'lucide-react';

const testimonialMeta = [
  {
    key: 't1',
    name: 'Lina Petrov',
    company: 'Barclays',
    avatar: 'LP',
    avatarColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    resultColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    highlight: true,
    hasResult: true,
    rating: 5,
    verified: true,
  },
  {
    key: 't2',
    name: 'Sarah Johnson',
    company: 'Google',
    avatar: 'SJ',
    avatarColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
    resultColor: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400',
    highlight: false,
    hasResult: true,
    rating: 5,
    verified: true,
  },
  {
    key: 't3',
    name: 'David Kim',
    company: 'Stripe',
    avatar: 'DK',
    avatarColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    resultColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    highlight: false,
    hasResult: true,
    rating: 5,
    verified: true,
  },
  {
    key: 't4',
    name: 'Ahmed Al-Rashid',
    company: 'Publicis Groupe',
    avatar: 'AR',
    avatarColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    resultColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    highlight: false,
    hasResult: true,
    rating: 5,
    verified: true,
  },
  {
    key: 't5',
    name: 'Maria Garcia',
    company: 'Meta',
    avatar: 'MG',
    avatarColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    resultColor: '',
    highlight: false,
    hasResult: false,
    rating: 5,
    verified: true,
  },
  {
    key: 't6',
    name: 'Fatima Hassan',
    company: 'Careem',
    avatar: 'FH',
    avatarColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    resultColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400',
    highlight: false,
    hasResult: true,
    rating: 5,
    verified: true,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Summary stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { stat: t('testimonials.stat1_value'), label: t('testimonials.stat1_label') },
            { stat: t('testimonials.stat2_value'), label: t('testimonials.stat2_label') },
            { stat: t('testimonials.stat3_value'), label: t('testimonials.stat3_label') },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-stone-900 dark:text-white">{stat}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialMeta.map((item) => (
            <div
              key={item.key}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                item.highlight
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30'
                  : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800'
              }`}
            >
              {/* Result badge */}
              {item.hasResult && (
                <div className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.resultColor}`}>
                  <span>✓</span>
                  {t(`testimonials.${item.key}_result`)}
                </div>
              )}

              <Quote className="mb-2 h-5 w-5 text-stone-300 dark:text-stone-600" />

              <p className="flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {t(`testimonials.${item.key}_content`)}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${item.avatarColor}`}>
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t(`testimonials.${item.key}_role`)}
                      {item.company && (
                        <span className="font-medium text-stone-600 dark:text-stone-300"> · {item.company}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stars count={item.rating} />
                  {item.verified && (
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{t('testimonials.verified')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
