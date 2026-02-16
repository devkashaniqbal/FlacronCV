'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  BarChart3,
  Users,
  CreditCard,
  Layout,
  MessageSquare,
  FileSearch,
  ArrowLeft,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: BarChart3, label: t('dashboard') },
    { href: '/admin/users', icon: Users, label: t('users') },
    { href: '/admin/subscriptions', icon: CreditCard, label: t('subscriptions') },
    { href: '/admin/templates', icon: Layout, label: t('templates') },
    { href: '/admin/tickets', icon: MessageSquare, label: t('tickets') },
    { href: '/admin/audit-logs', icon: FileSearch, label: t('audit_logs') },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const NavLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => (
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
          'fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-stone-200 bg-white transition-transform lg:static lg:transtone-x-0 dark:border-stone-700 dark:bg-stone-900',
          open ? 'transtone-x-0' : '-transtone-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-stone-900 dark:text-white">
              Flacron<span className="text-brand-600">CV</span>
            </span>
          </Link>
          <button
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 lg:hidden dark:hover:bg-stone-800"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {t('admin_panel')}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Back to Dashboard */}
        <div className="border-t border-stone-200 p-3 dark:border-stone-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <ArrowLeft className="h-5 w-5 flex-shrink-0" />
            {t('back_to_dashboard')}
          </Link>
        </div>
      </aside>
    </>
  );
}
