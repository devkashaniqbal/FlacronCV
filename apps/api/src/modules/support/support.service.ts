import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { SupportTicket, TicketMessage, CreateTicketData, TicketStatus, TicketPriority } from '@flacroncv/shared-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupportService {
  private readonly collection = 'support_tickets';

  constructor(private firebaseAdmin: FirebaseAdminService) {}

  async createTicket(userId: string, userEmail: string, userName: string, data: CreateTicketData): Promise<SupportTicket> {
    const id = uuidv4();
    const now = new Date();

    const ticket: SupportTicket = {
      id,
      userId,
      userEmail,
      userDisplayName: userName,
      subject: data.subject,
      category: data.category,
      priority: data.priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      assignedTo: null,
      assignedToName: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      closedAt: null,
    };

    await this.firebaseAdmin.firestore.collection(this.collection).doc(id).set(ticket);

    // Add first message
    await this.addMessage(id, userId, userName, 'user', data.message);

    return ticket;
  }

  async getTicket(id: string): Promise<SupportTicket> {
    const doc = await this.firebaseAdmin.firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) throw new NotFoundException('Ticket not found');
    return doc.data() as SupportTicket;
  }

  async listByUser(userId: string) {
    const snapshot = await this.firebaseAdmin.firestore
      .collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc: any) => doc.data() as SupportTicket);
  }

  async listAll(status?: string) {
    let query: FirebaseFirestore.Query = this.firebaseAdmin.firestore
      .collection(this.collection)
      .orderBy('createdAt', 'desc');

    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as SupportTicket);
  }

  async addMessage(ticketId: string, authorId: string, authorName: string, authorRole: 'user' | 'admin', content: string): Promise<TicketMessage> {
    const id = uuidv4();
    const message: TicketMessage = {
      id,
      authorId,
      authorName,
      authorRole,
      content,
      attachments: [],
      createdAt: new Date(),
    };

    await this.firebaseAdmin.firestore
      .collection(this.collection)
      .doc(ticketId)
      .collection('messages')
      .doc(id)
      .set(message);

    await this.firebaseAdmin.firestore.collection(this.collection).doc(ticketId).update({
      updatedAt: new Date(),
      status: authorRole === 'admin' ? TicketStatus.IN_PROGRESS : TicketStatus.WAITING_ON_CUSTOMER,
    });

    return message;
  }

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const snapshot = await this.firebaseAdmin.firestore
      .collection(this.collection)
      .doc(ticketId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();
    return snapshot.docs.map((doc: any) => doc.data() as TicketMessage);
  }

  async updateTicket(id: string, data: Partial<SupportTicket>): Promise<SupportTicket> {
    await this.firebaseAdmin.firestore.collection(this.collection).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    return this.getTicket(id);
  }

  async closeTicket(id: string): Promise<SupportTicket> {
    return this.updateTicket(id, { status: TicketStatus.CLOSED, closedAt: new Date() });
  }
}
