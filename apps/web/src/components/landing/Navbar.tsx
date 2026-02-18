'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Menu, X, FileText, Sun, Moon } from 'lucide-react';
import Button from '@/components/ui/Button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations();
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-lg dark:border-stone-700/80 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-stone-900 dark:text-white">
            Flacron<span className="text-brand-600">CV</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors dark:text-stone-400">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors dark:text-stone-400">
            {t('nav.pricing')}
          </a>
          <Link href="/templates" className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors dark:text-stone-400">
            {t('nav.templates')}
          </Link>
          <a href="#faq" className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors dark:text-stone-400">
            {t('nav.faq')}
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <button
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary">{t('nav.dashboard')}</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t('nav.login')}</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">{t('nav.signup')}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden dark:text-stone-400"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden dark:border-stone-700 dark:bg-black">
          <div className="flex flex-col gap-3">
            <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400" onClick={() => setMobileOpen(false)}>
              {t('nav.features')}
            </a>
            <a href="#pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400" onClick={() => setMobileOpen(false)}>
              {t('nav.pricing')}
            </a>
            <Link href="/templates" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400" onClick={() => setMobileOpen(false)}>
              {t('nav.templates')}
            </Link>
            <a href="#faq" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400" onClick={() => setMobileOpen(false)}>
              {t('nav.faq')}
            </a>
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <LanguageSwitcher />
              <button
                className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
            <hr className="border-stone-200 dark:border-stone-700" />
            {user ? (
              <Link href="/dashboard">
                <Button variant="primary" className="w-full">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" className="w-full">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="w-full">{t('nav.signup')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
