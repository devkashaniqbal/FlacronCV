'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations();
  const { user } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * When already on `/`, smooth-scroll to the section.
   * When on any other page, navigate to `/#hash` so the browser
   * lands on the homepage and jumps to the section automatically.
   */
  const handleSectionLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (pathname === '/') {
      e.preventDefault();
      setMobileOpen(false);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    // else: let the browser follow href="/#sectionId" normally
  };

  const navLinkClass =
    'text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors dark:text-stone-400 dark:hover:text-brand-400';

  const mobileNavLinkClass =
    'rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800';

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-lg dark:border-stone-700/80 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="FlacronCV" width={36} height={36} className="rounded-lg" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/#features"
            onClick={(e) => handleSectionLink(e, 'features')}
            className={navLinkClass}
          >
            {t('nav.features')}
          </a>
          <a
            href="/#pricing"
            onClick={(e) => handleSectionLink(e, 'pricing')}
            className={navLinkClass}
          >
            {t('nav.pricing')}
          </a>
          <Link href="/templates" className={navLinkClass}>
            {t('nav.templates')}
          </Link>
          <Link href="/about-us" className={navLinkClass}>
            {t('footer.about')}
          </Link>
          <Link href="/contact-us" className={navLinkClass}>
            {t('footer.contact')}
          </Link>
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
          <div className="flex flex-col gap-1">
            <a
              href="/#features"
              onClick={(e) => handleSectionLink(e, 'features')}
              className={mobileNavLinkClass}
            >
              {t('nav.features')}
            </a>
            <a
              href="/#pricing"
              onClick={(e) => handleSectionLink(e, 'pricing')}
              className={mobileNavLinkClass}
            >
              {t('nav.pricing')}
            </a>
            <Link
              href="/templates"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.templates')}
            </Link>
            <Link
              href="/about-us"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {t('footer.about')}
            </Link>
            <Link
              href="/contact-us"
              className={mobileNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {t('footer.contact')}
            </Link>

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
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" className="w-full">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">{t('nav.login')}</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
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
