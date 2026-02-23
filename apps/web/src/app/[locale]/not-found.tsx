import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import { FileText, Home } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('not_found');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-black">
      <div className="text-center">
        {/* Logo */}
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-stone-900 dark:text-white">
            Flacron<span className="text-brand-600">CV</span>
          </span>
        </Link>

        {/* 404 graphic */}
        <div className="mb-6">
          <p className="text-9xl font-black tracking-tight text-stone-100 dark:text-stone-800">
            404
          </p>
          <div className="-mt-8 flex justify-center">
            <div className="rounded-2xl bg-brand-600 px-6 py-2">
              <p className="text-lg font-bold text-white">{t('title')}</p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-sm text-stone-500 dark:text-stone-400">{t('desc')}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" icon={<Home className="h-5 w-5" />}>
              {t('btn_home')}
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="secondary" size="lg">
              Browse Templates
            </Button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Looking for something?
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/templates" className="text-sm text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">Templates</Link>
            <Link href="/about-us" className="text-sm text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">About Us</Link>
            <Link href="/contact-us" className="text-sm text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">Contact Us</Link>
            <Link href="/login" className="text-sm text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
