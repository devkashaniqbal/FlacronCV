import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { BillingInterval, SubscriptionPlan } from '../types/enums';
import { useAuthStore } from '../store/auth-store';

interface CheckoutSession {
  sessionId: string;
  url: string;
}

interface PortalSession {
  url: string;
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: ({
      plan,
      interval,
    }: {
      plan: SubscriptionPlan;
      interval: BillingInterval;
    }) => api.post<CheckoutSession>('/payments/create-checkout-session', { plan, interval }),
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: () => api.post<PortalSession>('/payments/create-portal-session'),
  });
}

export function useSubscriptionStatus() {
  const { firebaseUser } = useAuthStore();
  return useQuery({
    queryKey: ['subscription', firebaseUser?.uid],
    queryFn: () => api.get(`/users/${firebaseUser!.uid}/subscription`),
    enabled: !!firebaseUser?.uid,
    staleTime: 5 * 60 * 1000,
  });
}
