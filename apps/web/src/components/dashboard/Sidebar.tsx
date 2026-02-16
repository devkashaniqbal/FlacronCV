'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useAuth } from '@/providers/AuthProvider';
import {
  LayoutDashboard,
  FileText,
  Mail,
  Palette,
  Settings,
  HelpCircle,
  CreditCard,
  Shield,
  X,
  FileText as Logo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('title') },
    { href: '/cv', icon: FileText, label: t('my_cvs') },
    { href: '/cover-letters', icon: Mail, label: t('my_cover_letters') },
    { href: '/templates', icon: Palette, label: t('templates') },
  ];

  const bottomItems = [
    { href: '/settings', icon: Settings, label: t('settings') },
    { href: '/settings/billing', icon: CreditCard, label: t('billing') },
    { href: '/support', icon: HelpCircle, label: t('support') },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive(href)
          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200',
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-stone-200 bg-white transition-transform lg:static lg:translate-x-0 dark:border-stone-700 dark:bg-stone-900',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Logo className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-stone-900 dark:text-white">
              Flacron<span className="text-brand-600">CV</span>
            </span>
          </Link>
          <button className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 lg:hidden dark:hover:bg-stone-800" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* Admin link */}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <>
              <div className="my-3 border-t border-stone-200 dark:border-stone-700" />
              <NavLink href="/admin" icon={Shield} label="Admin" />
            </>
          )}
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-stone-200 p-3 dark:border-stone-700">
          {bottomItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </aside>
    </>
  );
}
