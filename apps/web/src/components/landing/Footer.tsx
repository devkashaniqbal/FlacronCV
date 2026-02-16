'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FileText } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-stone-900 dark:text-white">
                Flacron<span className="text-brand-600">CV</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
              {t('footer.product')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#features" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('nav.features')}</a></li>
              <li><a href="#pricing" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('nav.pricing')}</a></li>
              <li><Link href="/register" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('dashboard.templates')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
              {t('footer.company')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.about')}</a></li>
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.blog')}</a></li>
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.contact')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
              {t('footer.legal')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.terms')}</a></li>
              <li><a href="#" className="text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400">{t('footer.cookies')}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-8 dark:border-stone-800">
          <p className="text-center text-xs text-stone-500 dark:text-stone-400">
            &copy; {new Date().getFullYear()} FlacronCV. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
