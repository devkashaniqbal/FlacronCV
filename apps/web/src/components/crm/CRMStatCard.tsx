'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface CRMStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string; // Tailwind classes for icon container
  change?: number; // % change vs last period (positive = up, negative = down)
  prefix?: string;
  suffix?: string;
  loading?: boolean;
}

export default function CRMStatCard({
  label,
  value,
  icon: Icon,
  color,
  change,
  prefix = '',
  suffix = '',
  loading = false,
}: CRMStatCardProps) {
  const hasChange = change !== undefined && change !== null;
  const isPositive = (change ?? 0) > 0;
  const isNeutral = (change ?? 0) === 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400 truncate">
            {label}
          </p>

          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded-md bg-stone-200 dark:bg-stone-700" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-white">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          )}

          {hasChange && !loading && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-xs font-medium',
                isNeutral
                  ? 'text-stone-500 dark:text-stone-400'
                  : isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400',
              )}
            >
              {isNeutral ? (
                <Minus className="h-3.5 w-3.5" />
              ) : isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? '+' : ''}{change}% vs last month
              </span>
            </div>
          )}
        </div>

        <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
