'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Check, ShieldCheck, Lock, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PLAN_CONFIGS, SubscriptionPlan } from '@flacroncv/shared-types';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

export default function Pricing() {
  const t = useTranslations();
  const [yearly, setYearly] = useState(false);
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });

  const plans = [
    {
      key: SubscriptionPlan.FREE,
      featured: false,
      bestFor: 'Students & job seekers starting out',
    },
    {
      key: SubscriptionPlan.PRO,
      featured: true,
      bestFor: 'Active job seekers & career switchers',
    },
    {
      key: SubscriptionPlan.ENTERPRISE,
      featured: false,
      bestFor: 'Teams, recruiters & career coaches',
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-stone-50 dark:bg-stone-900/50">
      <div
        ref={sectionRef}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
            {t('pricing.subtitle')}
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white p-1 dark:border-stone-700 dark:bg-stone-800">
            <button
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-800',
                !yearly
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white',
              )}
              onClick={() => setYearly(false)}
            >
              {t('pricing.monthly')}
            </button>
            <button
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-800',
                yearly
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white',
              )}
              onClick={() => setYearly(true)}
            >
              {t('pricing.yearly')}
              {yearly && (
                <span className="ms-1.5 text-xs text-emerald-500 font-semibold">{t('pricing.save')}</span>
              )}
            </button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            We never sell your data
          </div>
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-emerald-500" />
            Delete your account anytime
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            Payments secured by Stripe
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            SSL encrypted &amp; GDPR compliant
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map(({ key, featured, bestFor }) => {
            const config = PLAN_CONFIGS[key];
            const price = yearly ? config.priceYearly : config.priceMonthly;
            const interval = yearly ? t('pricing.per_year') : t('pricing.per_month');

            return (
              <div
                key={key}
                className={cn(
                  'relative rounded-2xl border p-5 sm:p-8 transition-shadow',
                  featured
                    ? 'border-brand-500 bg-white shadow-xl ring-1 ring-brand-500 dark:border-brand-400 dark:bg-stone-800 dark:ring-brand-400'
                    : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800',
                )}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="brand" size="md">
                      {t('pricing.popular')}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                    {config.name}
                  </h3>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                    Best for: {bestFor}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-stone-900 dark:text-white">
                      ${price === 0 ? '0' : price.toFixed(2)}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-stone-500">{interval}</span>
                    )}
                  </div>
                  {yearly && price > 0 && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {t('pricing.billed_annually')}
                    </p>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {config.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span className="text-stone-600 dark:text-stone-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={key === SubscriptionPlan.FREE ? '/register' : '/register'}>
                  <Button
                    variant={featured ? 'primary' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    {key === SubscriptionPlan.FREE ? t('pricing.get_started') : t('pricing.upgrade')}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
