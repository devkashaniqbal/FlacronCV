'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, FileText, MoreVertical, Trash2, Copy, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { CV } from '@flacroncv/shared-types';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function CVListPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.get<{ items: CV[] }>('/cvs'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cvs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      toast.success('CV deleted');
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => api.post(`/cvs/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      toast.success('CV duplicated');
    },
  });

  const cvs = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{t('dashboard.my_cvs')}</h1>
        <Link href="/cv/new">
          <Button icon={<Plus className="h-4 w-4" />}>{t('dashboard.create_cv')}</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="none" className="overflow-hidden">
              <Skeleton className="h-40 w-full" rounded="sm" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-16" rounded="full" />
                  <Skeleton className="h-5 w-16" rounded="full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : cvs.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950">
            <FileText className="h-8 w-8 text-brand-600" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            {t('common.create_your_first_cv')}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">{t('dashboard.start_creating')}</p>
          <Link href="/cv/new">
            <Button variant="gradient" className="mt-6" size="lg" icon={<Sparkles className="h-5 w-5" />}>
              {t('common.get_started')}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              onDelete={() => deleteMutation.mutate(cv.id)}
              onDuplicate={() => duplicateMutation.mutate(cv.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CVCard({
  cv,
  onDelete,
  onDuplicate,
}: {
  cv: CV;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card hover padding="none" className="overflow-hidden">
      {/* Preview area */}
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900">
        <div className="w-24 rounded border border-stone-200 bg-white p-2 shadow-sm dark:border-stone-600 dark:bg-stone-700">
          <div className="mb-1 h-2 w-14 rounded bg-stone-800 dark:bg-stone-200" />
          <div className="mb-1 h-1 w-10 rounded bg-stone-300" />
          <div className="mb-2 h-px w-full bg-brand-400" />
          <div className="space-y-0.5">
            <div className="h-1 w-full rounded bg-stone-200 dark:bg-stone-500" />
            <div className="h-1 w-4/5 rounded bg-stone-200 dark:bg-stone-500" />
            <div className="h-1 w-3/5 rounded bg-stone-200 dark:bg-stone-500" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link href={`/cv/${cv.id}`}>
              <h3 className="truncate font-semibold text-stone-900 hover:text-brand-600 dark:text-white">
                {cv.title}
              </h3>
            </Link>
            <p className="mt-1 text-xs text-stone-500">
              Updated {formatDate(cv.updatedAt)}
            </p>
          </div>
          <div className="relative">
            <button
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute end-0 z-20 mt-1 w-36 rounded-lg border border-stone-200 bg-white py-1 shadow-lg dark:border-stone-700 dark:bg-stone-800">
                  <button
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-700"
                    onClick={() => { onDuplicate(); setMenuOpen(false); }}
                  >
                    <Copy className="h-4 w-4" /> Duplicate
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => { onDelete(); setMenuOpen(false); }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant={cv.status === 'published' ? 'success' : 'default'}>{cv.status}</Badge>
          <Badge variant="info">{cv.templateId}</Badge>
        </div>
      </div>
    </Card>
  );
}
