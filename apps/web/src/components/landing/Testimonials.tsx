'use client';

import { useTranslations } from 'next-intl';
import { Star, BadgeCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    avatar: 'SJ',
    content: 'FlacronCV helped me create a professional CV in under 10 minutes. The AI suggestions were spot-on and the ATS optimization got me more interviews than ever before.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Lina Petrov',
    role: 'Senior Finance Analyst',
    avatar: 'LP',
    content: 'Got 3 interviews in 2 weeks after rebuilding my CV with FlacronCV. The ATS checker flagged 8 issues I would never have caught — fixed them all in under 20 minutes.',
    rating: 5,
    verified: true,
    highlight: true,
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Marketing Director',
    avatar: 'AR',
    content: 'The multilingual support is amazing! I needed my CV in both Arabic and English, and FlacronCV handled the translation beautifully while maintaining the formatting.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Maria Garcia',
    role: 'UX Designer at Meta',
    avatar: 'MG',
    content: 'I love the drag-and-drop builder. Being able to rearrange sections and see a live preview made the whole process so intuitive. Best CV builder I\'ve ever used.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Fatima Hassan',
    role: 'Product Manager',
    avatar: 'FH',
    content: 'Switched from Resume.io to FlacronCV and never looked back. The templates are more professional and the AI features are significantly better.',
    rating: 5,
    verified: true,
  },
  {
    name: 'David Kim',
    role: 'Full Stack Developer',
    avatar: 'DK',
    content: 'The ATS scoring feature helped me understand why I wasn\'t getting callbacks. After optimizing with FlacronCV, my response rate doubled!',
    rating: 5,
    verified: true,
  },
];

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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className={`rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                item.highlight
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30'
                  : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800'
              }`}
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{item.role}</p>
                </div>
                {item.verified && (
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-950/40">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
