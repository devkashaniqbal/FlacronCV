import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SupportTicket, TicketMessage, CreateTicketData } from '../types/support.types';
import { PaginatedResponse } from '../types/api.types';

export function useSupportTickets(page = 1) {
  return useQuery({
    queryKey: ['support-tickets', page],
    queryFn: () => api.get<PaginatedResponse<SupportTicket>>('/support/tickets', { page }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSupportTicket(id: string | null) {
  return useQuery({
    queryKey: ['support-ticket', id],
    queryFn: () => api.get<SupportTicket>(`/support/tickets/${id}`),
    enabled: !!id,
  });
}

export function useTicketMessages(ticketId: string | null) {
  return useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: () => api.get<TicketMessage[]>(`/support/tickets/${ticketId}/messages`),
    enabled: !!ticketId,
    refetchInterval: 15000, // Poll every 15s for new messages
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketData) =>
      api.post<SupportTicket>('/support/tickets', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
}

export function useAddTicketMessage(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post<TicketMessage>(`/support/tickets/${ticketId}/messages`, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
    },
  });
}
