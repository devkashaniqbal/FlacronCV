'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  FileText,
  Lock,
  Star,
  LayoutTemplate,
  Sparkles,
} from 'lucide-react';
import {
  Template,
  TemplateCategory,
  SubscriptionPlan,
} from '@flacroncv/shared-types';

type CategoryFilter = 'all' | TemplateCategory;
type TierFilter = 'all' | SubscriptionPlan;

const categoryTabs: { value: CategoryFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'allTemplates' },
  { value: TemplateCategory.CV, labelKey: 'cvTemplates' },
  { value: TemplateCategory.COVER_LETTER, labelKey: 'coverLetterTemplates' },
];

const tierOptions: { value: TierFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'allTiers' },
  { value: SubscriptionPlan.FREE, labelKey: 'free' },
  { value: SubscriptionPlan.PRO, labelKey: 'pro' },
  { value: SubscriptionPlan.ENTERPRISE, labelKey: 'enterprise' },
];

const tierVariantMap: Record<SubscriptionPlan, 'success' | 'brand' | 'warning'> = {
  [SubscriptionPlan.FREE]: 'success',
  [SubscriptionPlan.PRO]: 'brand',
  [SubscriptionPlan.ENTERPRISE]: 'warning',
};

const tierLabelMap: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.FREE]: 'Free',
  [SubscriptionPlan.PRO]: 'Pro',
  [SubscriptionPlan.ENTERPRISE]: 'Enterprise',
};

const categoryLabelMap: Record<TemplateCategory, string> = {
  [TemplateCategory.CV]: 'CV',
  [TemplateCategory.COVER_LETTER]: 'Cover Letter',
};

const gradients = [
  'from-brand-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-brand-500 to-brand-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-brand-600',
  'from-violet-500 to-fuchsia-600',
  'from-amber-500 to-yellow-600',
];

export default function TemplatesPage() {
  const t = useTranslations('templates');
  const router = useRouter();
  const { user } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.get<Template[]>('/templates'),
    enabled: !!user,
  });

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];

    return templates.filter((tmpl) => {
      if (categoryFilter !== 'all' && tmpl.category !== categoryFilter) return false;
      if (tierFilter !== 'all' && tmpl.tier !== tierFilter) return false;
      return true;
    });
  }, [templates, categoryFilter, tierFilter]);

  const userPlan = user?.subscription?.plan || SubscriptionPlan.FREE;

  const canUseTemplate = (template: Template): boolean => {
    const planOrder = [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.ENTERPRISE];
    return planOrder.indexOf(userPlan) >= planOrder.indexOf(template.tier);
  };

  const handleUseTemplate = (template: Template) => {
    if (!canUseTemplate(template)) {
      toast.error(t('upgradePlanMessage'));
      return;
    }

    if (template.category === TemplateCategory.CV) {
      router.push(`/cv/new?template=${template.id}`);
    } else {
      router.push(`/cover-letters/new?template=${template.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {t('description')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1 dark:border-stone-700 dark:bg-stone-800/50">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setCategoryFilter(tab.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                categoryFilter === tab.value
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-white'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white',
              )}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tier filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
            {t('tier')}:
          </span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as TierFilter)}
            className="input-field py-1.5 text-sm"
          >
            {tierOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Template grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} padding="none" className="animate-pulse overflow-hidden">
              <div className="h-48 bg-stone-200 dark:bg-stone-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-2/3 rounded bg-stone-200 dark:bg-stone-700" />
                <div className="flex gap-2">
                  <div className="h-5 w-12 rounded-full bg-stone-200 dark:bg-stone-700" />
                  <div className="h-5 w-12 rounded-full bg-stone-200 dark:bg-stone-700" />
                </div>
                <div className="h-9 w-full rounded bg-stone-200 dark:bg-stone-700" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template, index) => {
            const isLocked = !canUseTemplate(template);
            const gradient = gradients[index % gradients.length];

            return (
              <Card
                key={template.id}
                padding="none"
                hover
                className="group overflow-hidden"
              >
                {/* Thumbnail placeholder */}
                <div className="relative">
                  <div
                    className={cn(
                      'flex h-48 items-center justify-center bg-gradient-to-br',
                      gradient,
                    )}
                  >
                    {/* Template mockup lines */}
                    <div className="w-28 space-y-2 rounded-lg bg-white/90 p-4 shadow-lg dark:bg-stone-800/90">
                      <div className="h-2 w-full rounded bg-stone-300 dark:bg-stone-600" />
                      <div className="h-2 w-3/4 rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="mt-3 h-1.5 w-full rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="h-1.5 w-full rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="h-1.5 w-2/3 rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="mt-3 h-1.5 w-full rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="h-1.5 w-5/6 rounded bg-stone-200 dark:bg-stone-700" />
                    </div>

                    {/* Lock overlay for locked templates */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                        <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white">
                          <Lock className="h-4 w-4" />
                          {tierLabelMap[template.tier]}
                        </div>
                      </div>
                    )}

                    {/* Featured badge */}
                    {template.isFeatured && (
                      <div className="absolute end-3 top-3">
                        <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          <Star className="h-3 w-3" />
                          {t('featured')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card content */}
                <div className="space-y-3 p-4">
                  <h3 className="text-base font-semibold text-stone-900 dark:text-white">
                    {template.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">
                      {categoryLabelMap[template.category]}
                    </Badge>
                    <Badge variant={tierVariantMap[template.tier]}>
                      {tierLabelMap[template.tier]}
                    </Badge>
                  </div>

                  <Button
                    className="w-full"
                    variant={isLocked ? 'secondary' : 'primary'}
                    size="sm"
                    icon={
                      isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )
                    }
                    onClick={() => handleUseTemplate(template)}
                  >
                    {isLocked ? t('upgrade') : t('useTemplate')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <LayoutTemplate className="mb-4 h-12 w-12 text-stone-300 dark:text-stone-600" />
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
            {t('noTemplates')}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
            {t('noTemplatesDescription')}
          </p>
          {(categoryFilter !== 'all' || tierFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCategoryFilter('all');
                setTierFilter('all');
              }}
            >
              {t('clearFilters')}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
