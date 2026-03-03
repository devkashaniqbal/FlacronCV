import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Star, ArrowRight, Quote } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('testimonials_page');
  return { title: `${t('title')} — FlacronCV` };
}

const testimonialMeta = [
  { key: 't1', name: 'Sarah Johnson',       company: 'Google',           avatar: 'SJ', avatarColor: 'bg-violet-500' },
  { key: 't2', name: 'Mohammed Al-Rashid',  company: 'Goldman Sachs',    avatar: 'MA', avatarColor: 'bg-brand-500' },
  { key: 't3', name: 'Emma Müller',         company: 'Spotify',          avatar: 'EM', avatarColor: 'bg-emerald-500' },
  { key: 't4', name: 'James Chen',          company: 'Stripe',           avatar: 'JC', avatarColor: 'bg-cyan-500' },
  { key: 't5', name: 'Priya Patel',         company: 'Microsoft',        avatar: 'PP', avatarColor: 'bg-pink-500' },
  { key: 't6', name: 'Carlos Rivera',       company: 'HubSpot',          avatar: 'CR', avatarColor: 'bg-amber-500' },
  { key: 't7', name: 'Aisha Kamara',        company: 'Deloitte',         avatar: 'AK', avatarColor: 'bg-teal-500' },
  { key: 't8', name: 'Tom Nakamura',        company: 'AWS',              avatar: 'TN', avatarColor: 'bg-orange-500' },
  { key: 't9', name: 'Fatima Zahra',        company: 'Oxford University', avatar: 'FZ', avatarColor: 'bg-indigo-500' },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default async function TestimonialsPage() {
  const t = await getTranslations('testimonials_page');

  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white dark:border-stone-800 dark:from-stone-900 dark:to-black">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-center">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            {t('subtitle')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-white">{t('stats_users')}</span> {t('happy_users')} ·
            <span className="font-semibold text-stone-900 dark:text-white">{t('stats_rating')}</span> {t('average_rating')} ·
            <span className="font-semibold text-stone-900 dark:text-white">{t('stats_cvs')}</span> {t('cvs_created_label')}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {testimonialMeta.map((item) => (
            <Card key={item.key} className="break-inside-avoid">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${item.avatarColor}`}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {t(`${item.key}_role`)} · {item.company}
                    </p>
                  </div>
                </div>
                <Quote className="h-5 w-5 shrink-0 text-brand-300 dark:text-brand-700" />
              </div>
              <StarRating count={5} />
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                "{t(`${item.key}_text`)}"
              </p>
              <div className="mt-3">
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  {t(`${item.key}_tag`)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-gradient-to-br from-brand-600 to-brand-700 dark:border-stone-800">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            {t('cta_title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-200">
            {t('cta_desc')}
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                className="bg-white text-brand-600 hover:bg-brand-50"
              >
                {t('cta_btn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
