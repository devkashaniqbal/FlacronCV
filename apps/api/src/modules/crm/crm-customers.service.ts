import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import {
  CRMCustomer,
  CRMNote,
  CRMActivity,
  CreateCRMCustomerDto,
  UpdateCRMCustomerDto,
  AddCRMNoteDto,
  CRMCustomerListParams,
  CRMCustomerStatus,
  CRMActivityType,
  CRMCustomerSource,
} from '@flacroncv/shared-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CRMCustomersService {
  private readonly col = 'crm_customers';
  private readonly activitiesCol = 'crm_activities';

  constructor(private firebase: FirebaseAdminService) {}

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(
    dto: CreateCRMCustomerDto,
    authorId: string,
    authorName: string,
  ): Promise<CRMCustomer> {
    // Prevent duplicate emails
    const existing = await this.firebase.firestore
      .collection(this.col)
      .where('email', '==', dto.email)
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new ConflictException(
        'A customer with this email already exists.',
      );
    }

    const id = uuidv4();
    const now = new Date();
    const customer: CRMCustomer = {
      id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      company: dto.company ?? null,
      status: dto.status ?? CRMCustomerStatus.ACTIVE,
      tags: dto.tags ?? [],
      totalRevenue: 0,
      source: dto.source ?? CRMCustomerSource.MANUAL,
      notes: [],
      lastActivity: now,
      createdAt: now,
      updatedAt: now,
    };

    await this.firebase.firestore.collection(this.col).doc(id).set(customer);
    await this.logActivity(id, CRMActivityType.STATUS_CHANGE, 'Customer created', null, authorId, authorName);

    return customer;
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<CRMCustomer> {
    const doc = await this.firebase.firestore.collection(this.col).doc(id).get();
    if (!doc.exists) throw new NotFoundException('Customer not found');
    return doc.data() as CRMCustomer;
  }

  async list(params: CRMCustomerListParams): Promise<{
    items: CRMCustomer[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);

    // Build base query ordered by createdAt desc
    // Firestore does not support LIKE search — we fetch and filter in-memory for search
    let query: FirebaseFirestore.Query = this.firebase.firestore
      .collection(this.col)
      .orderBy('createdAt', 'desc');

    if (params.status) query = query.where('status', '==', params.status);
    if (params.source) query = query.where('source', '==', params.source);
    if (params.startDate) {
      query = query.where('createdAt', '>=', new Date(params.startDate));
    }
    if (params.endDate) {
      query = query.where('createdAt', '<=', new Date(params.endDate));
    }

    const snapshot = await query.limit(1000).get();
    let items: CRMCustomer[] = snapshot.docs.map((d: any) => d.data() as CRMCustomer);

    // In-memory search (Firestore doesn't support full-text)
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company ?? '').toLowerCase().includes(q),
      );
    }

    // In-memory sort override
    if (params.sortBy && params.sortBy !== 'createdAt') {
      items.sort((a, b) => {
        let aVal: number | string | Date | null;
        let bVal: number | string | Date | null;

        switch (params.sortBy) {
          case 'totalRevenue':
            aVal = a.totalRevenue;
            bVal = b.totalRevenue;
            break;
          case 'lastActivity':
            aVal = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
            bVal = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
            break;
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aVal! < bVal!) return params.sortOrder === 'asc' ? -1 : 1;
        if (aVal! > bVal!) return params.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (params.sortOrder === 'asc') {
      items.reverse(); // default is desc, flip for asc
    }

    const total = items.length;
    const pages = Math.ceil(total / limit);
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total, page, limit, pages };
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  async update(
    id: string,
    dto: UpdateCRMCustomerDto,
    authorId: string,
    authorName: string,
  ): Promise<CRMCustomer> {
    const customer = await this.findById(id);
    const now = new Date();

    if (dto.status && dto.status !== customer.status) {
      await this.logActivity(
        id,
        CRMActivityType.STATUS_CHANGE,
        `Status changed from ${customer.status} to ${dto.status}`,
        null,
        authorId,
        authorName,
      );
    }

    await this.firebase.firestore.collection(this.col).doc(id).update({
      ...dto,
      lastActivity: now,
      updatedAt: now,
    });

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.firebase.firestore.collection(this.col).doc(id).delete();
  }

  // ─── Notes ─────────────────────────────────────────────────────────────────

  async addNote(
    customerId: string,
    dto: AddCRMNoteDto,
    authorId: string,
    authorName: string,
  ): Promise<CRMNote> {
    const customer = await this.findById(customerId);
    const note: CRMNote = {
      id: uuidv4(),
      content: dto.content,
      authorId,
      authorName,
      createdAt: new Date(),
    };

    const updatedNotes = [...(customer.notes ?? []), note];
    const now = new Date();

    await this.firebase.firestore.collection(this.col).doc(customerId).update({
      notes: updatedNotes,
      lastActivity: now,
      updatedAt: now,
    });

    await this.logActivity(
      customerId,
      CRMActivityType.NOTE,
      `Note added by ${authorName}`,
      dto.content,
      authorId,
      authorName,
    );

    return note;
  }

  async deleteNote(customerId: string, noteId: string): Promise<void> {
    const customer = await this.findById(customerId);
    const notes = (customer.notes ?? []).filter((n) => n.id !== noteId);
    await this.firebase.firestore.collection(this.col).doc(customerId).update({
      notes,
      updatedAt: new Date(),
    });
  }

  // ─── Tags ──────────────────────────────────────────────────────────────────

  async addTag(
    customerId: string,
    tag: string,
    authorId: string,
    authorName: string,
  ): Promise<CRMCustomer> {
    const customer = await this.findById(customerId);
    const tags = Array.from(new Set([...customer.tags, tag.trim()]));
    const now = new Date();

    await this.firebase.firestore.collection(this.col).doc(customerId).update({
      tags,
      lastActivity: now,
      updatedAt: now,
    });

    await this.logActivity(
      customerId,
      CRMActivityType.TAG_ADDED,
      `Tag "${tag}" added`,
      null,
      authorId,
      authorName,
    );

    return this.findById(customerId);
  }

  async removeTag(
    customerId: string,
    tag: string,
    authorId: string,
    authorName: string,
  ): Promise<CRMCustomer> {
    const customer = await this.findById(customerId);
    const tags = customer.tags.filter((t) => t !== tag);
    const now = new Date();

    await this.firebase.firestore.collection(this.col).doc(customerId).update({
      tags,
      lastActivity: now,
      updatedAt: now,
    });

    await this.logActivity(
      customerId,
      CRMActivityType.TAG_REMOVED,
      `Tag "${tag}" removed`,
      null,
      authorId,
      authorName,
    );

    return this.findById(customerId);
  }

  // ─── Revenue ───────────────────────────────────────────────────────────────

  async incrementRevenue(customerId: string, amount: number): Promise<void> {
    const customer = await this.findById(customerId);
    await this.firebase.firestore.collection(this.col).doc(customerId).update({
      totalRevenue: customer.totalRevenue + amount,
      lastActivity: new Date(),
      updatedAt: new Date(),
    });
  }

  // ─── Activity ──────────────────────────────────────────────────────────────

  async getActivities(customerId: string): Promise<CRMActivity[]> {
    const snapshot = await this.firebase.firestore
      .collection(this.activitiesCol)
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return snapshot.docs.map((d: any) => d.data() as CRMActivity);
  }

  private async logActivity(
    customerId: string,
    type: CRMActivityType,
    title: string,
    description: string | null,
    authorId: string,
    authorName: string,
  ): Promise<void> {
    const activity: CRMActivity = {
      id: uuidv4(),
      customerId,
      type,
      title,
      description,
      metadata: {},
      authorId,
      authorName,
      createdAt: new Date(),
    };

    await this.firebase.firestore
      .collection(this.activitiesCol)
      .doc(activity.id)
      .set(activity);
  }

  // ─── Export ────────────────────────────────────────────────────────────────

  async getAllForExport(): Promise<CRMCustomer[]> {
    const snapshot = await this.firebase.firestore
      .collection(this.col)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((d: any) => d.data() as CRMCustomer);
  }
}
