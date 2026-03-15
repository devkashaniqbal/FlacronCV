import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { AIGenerateRequest, AIResponse } from '../types/api.types';

export function useGenerateSummary() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/cv-summary', data),
  });
}

export function useImproveSection() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/improve', data),
  });
}

export function useSuggestSkills() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/suggest-skills', data),
  });
}

export function useGenerateCoverLetterAI() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/cover-letter', data),
  });
}

export function useATSCheck() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/ats-check', data),
  });
}

export function useGenerateJobDescription() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/generate-job-description', data),
  });
}

export function useTranslateContent() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) =>
      api.post<AIResponse>('/ai/translate', data),
  });
}
