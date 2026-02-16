import { TicketCategory, TicketPriority, TicketStatus } from './enums';

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  closedAt: Date | null;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'user' | 'admin';
  content: string;
  attachments: TicketAttachment[];
  createdAt: Date;
}

export interface TicketAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CreateTicketData {
  subject: string;
  category: TicketCategory;
  priority?: TicketPriority;
  message: string;
}
