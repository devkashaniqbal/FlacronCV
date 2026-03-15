import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Template } from '../types/template.types';
import { TemplateCategory } from '../types/enums';

export function useTemplates(category?: TemplateCategory) {
  return useQuery({
    queryKey: ['templates', category],
    queryFn: () => api.get<Template[]>('/templates', category ? { category } : {}),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTemplate(id: string | null) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => api.get<Template>(`/templates/${id}`),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
