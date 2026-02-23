'use client';

import { useTranslations } from 'next-intl';
import { Star, BadgeCheck, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Lina Petrov',
    role: 'Senior Finance Analyst',
    company: 'Barclays',
    avatar: 'LP',
    avatarColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    content: 'Got 3 interview calls in 2 weeks after rebuilding my CV with FlacronCV. The ATS checker flagged 8 issues I never would have caught — fixed them all in 20 minutes.',
    rating: 5,
    verified: true,
    result: '3 interviews in 2 weeks',
    resultColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    highlight: true,
  },
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'SJ',
    avatarColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
    content: 'Landed my offer at Google after using FlacronCV to tailor my CV for the role. The AI rewrite suggestions were shockingly accurate — it took 10 minutes start to finish.',
    rating: 5,
    verified: true,
    result: 'Landed Google offer',
    resultColor: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400',
  },
  {
    name: 'David Kim',
    role: 'Full Stack Developer',
    company: 'Stripe',
    avatar: 'DK',
    avatarColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    content: 'My callback rate literally doubled. I was applying for months with zero responses — FlacronCV showed me my ATS score was 38. After the fix, it jumped to 91 and the callbacks started.',
    rating: 5,
    verified: true,
    result: '2× callback rate',
    resultColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Marketing Director',
    company: 'Publicis Groupe',
    avatar: 'AR',
    avatarColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    content: 'Needed my CV in both Arabic and English for roles in Dubai and London. FlacronCV handled the translation and RTL formatting perfectly — saved me days of reformatting.',
    rating: 5,
    verified: true,
    result: 'Hired across two markets',
    resultColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  {
    name: 'Maria Garcia',
    role: 'Product Designer',
    company: 'Meta',
    avatar: 'MG',
    avatarColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    content: 'I\'ve tried Canva, Resume.io, and Kickresume. FlacronCV is the only one that actually tells you why your CV isn\'t getting through — the ATS scanner is genuinely useful.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Fatima Hassan',
    role: 'Product Manager',
    company: 'Careem',
    avatar: 'FH',
    avatarColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    content: 'Created a tailored cover letter for each application in under 5 minutes using the AI generator. Got 2 offers at once and had to choose. Genuinely life-changing tool.',
    rating: 5,
    verified: true,
    result: '2 offers simultaneously',
    resultColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400',
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
            { stat: '4.9 / 5', label: 'Average rating' },
            { stat: '10,000+', label: 'Professionals' },
            { stat: '2×', label: 'Avg. callback rate increase' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-stone-900 dark:text-white">{stat}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                item.highlight
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30'
                  : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800'
              }`}
            >
              {/* Result badge */}
              {item.result && (
                <div className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.resultColor}`}>
                  <span>✓</span>
                  {item.result}
                </div>
              )}

              <Quote className="mb-2 h-5 w-5 text-stone-300 dark:text-stone-600" />

              <p className="flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {item.content}
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
                      {item.role}
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
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
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
