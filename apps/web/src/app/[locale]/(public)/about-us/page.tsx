import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import {
  Target,
  BookOpen,
  Heart,
  Shield,
  Zap,
  Globe,
  Users,
  FileText,
  ArrowRight,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return { title: `${t('title')} — FlacronCV` };
}

/* ─── Stat card ─── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
      <p className="text-4xl font-bold text-brand-600">{value}</p>
      <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400">{label}</p>
    </div>
  );
}

/* ─── Value card ─── */
function ValueCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-stone-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{desc}</p>
      </div>
    </div>
  );
}

export default async function AboutUsPage() {
  const t = await getTranslations('about');

  return (
    <>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-brand-50 to-white dark:border-stone-800 dark:from-stone-900 dark:to-black">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <FileText className="h-4 w-4" />
            FlacronCV
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            {t('hero_title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            {t('hero_desc')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value={t('stats_users')} label={t('stats_users_label')} />
            <StatCard value={t('stats_cvs')} label={t('stats_cvs_label')} />
            <StatCard value={t('stats_languages')} label={t('stats_languages_label')} />
            <StatCard value={t('stats_countries')} label={t('stats_countries_label')} />
          </div>
        </div>
      </section>

      {/* Mission + Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              {t('mission_title')}
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
              {t('mission_desc')}
            </p>
          </div>
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              {t('story_title')}
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
              {t('story_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-2xl font-bold text-stone-900 dark:text-white">
            {t('values_title')}
          </h2>
          <p className="mb-10 text-center text-stone-500 dark:text-stone-400">
            The principles that guide everything we build
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ValueCard icon={Zap} title={t('value1_title')} desc={t('value1_desc')} />
            <ValueCard icon={Heart} title={t('value2_title')} desc={t('value2_desc')} />
            <ValueCard icon={Globe} title={t('value3_title')} desc={t('value3_desc')} />
            <ValueCard icon={Shield} title={t('value4_title')} desc={t('value4_desc')} />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{t('team_title')}</h2>
          <p className="max-w-xl text-stone-600 dark:text-stone-400">{t('team_desc')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-gradient-to-br from-brand-600 to-brand-700 dark:border-stone-800">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">{t('cta_title')}</h2>
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
