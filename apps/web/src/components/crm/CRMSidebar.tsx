'use client';

import { Link, usePathname } from '@/i18n/routing';
import {
  LayoutDashboard,
  Users,
  Target,
  DollarSign,
  ArrowLeft,
  FileText as Logo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/crm', icon: LayoutDashboard, label: 'Overview' },
  { href: '/crm/customers', icon: Users, label: 'Customers' },
  { href: '/crm/leads', icon: Target, label: 'Leads' },
  { href: '/crm/revenue', icon: DollarSign, label: 'Revenue' },
];

export default function CRMSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/crm' ? pathname === '/crm' : pathname.startsWith(href);

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-e border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-stone-200 px-4 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Logo className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-stone-900 dark:text-white">
              Flacron<span className="text-brand-600">CRM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
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
        ))}
      </nav>

      {/* Back to app */}
      <div className="border-t border-stone-200 p-3 dark:border-stone-700">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}
