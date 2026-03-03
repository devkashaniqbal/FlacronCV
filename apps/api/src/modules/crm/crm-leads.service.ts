import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { CRMCustomersService } from './crm-customers.service';
import {
  CRMLead,
  CreateCRMLeadDto,
  UpdateCRMLeadDto,
  CRMLeadListParams,
  CRMLeadStage,
  CRMCustomerStatus,
  CRMCustomerSource,
  CRMActivityType,
} from '@flacroncv/shared-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CRMLeadsService {
  private readonly col = 'crm_leads';
  private readonly activitiesCol = 'crm_activities';

  constructor(
    private firebase: FirebaseAdminService,
    private customersService: CRMCustomersService,
  ) {}

  async create(dto: CreateCRMLeadDto): Promise<CRMLead> {
    const id = uuidv4();
    const now = new Date();
    const lead: CRMLead = {
      id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      company: dto.company ?? null,
      source: dto.source ?? CRMCustomerSource.MANUAL,
      stage: dto.stage ?? CRMLeadStage.NEW,
      assignedTo: dto.assignedTo ?? null,
      assignedToName: dto.assignedToName ?? null,
      notes: dto.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await this.firebase.firestore.collection(this.col).doc(id).set(lead);
    return lead;
  }

  async findById(id: string): Promise<CRMLead> {
    const doc = await this.firebase.firestore.collection(this.col).doc(id).get();
    if (!doc.exists) throw new NotFoundException('Lead not found');
    return doc.data() as CRMLead;
  }

  async list(params: CRMLeadListParams): Promise<{
    items: CRMLead[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);

    let query: FirebaseFirestore.Query = this.firebase.firestore
      .collection(this.col)
      .orderBy('createdAt', 'desc');

    if (params.stage) query = query.where('stage', '==', params.stage);
    if (params.assignedTo) query = query.where('assignedTo', '==', params.assignedTo);

    const snapshot = await query.get();
    let items: CRMLead[] = snapshot.docs.map((d: any) => d.data() as CRMLead);

    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.company ?? '').toLowerCase().includes(q),
      );
    }

    const total = items.length;
    const pages = Math.ceil(total / limit);
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total, page, limit, pages };
  }

  async update(id: string, dto: UpdateCRMLeadDto): Promise<CRMLead> {
    await this.findById(id);
    await this.firebase.firestore.collection(this.col).doc(id).update({
      ...dto,
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.firebase.firestore.collection(this.col).doc(id).delete();
  }

  /**
   * Convert a lead to a CRM customer.
   * Creates the customer, logs the conversion, and deletes the lead.
   */
  async convertToCustomer(
    leadId: string,
    authorId: string,
    authorName: string,
  ) {
    const lead = await this.findById(leadId);

    const customer = await this.customersService.create(
      {
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? undefined,
        company: lead.company ?? undefined,
        status: CRMCustomerStatus.ACTIVE,
        source: lead.source,
      },
      authorId,
      authorName,
    );

    // Log conversion activity
    const activity = {
      id: uuidv4(),
      customerId: customer.id,
      type: CRMActivityType.LEAD_CONVERTED,
      title: `Converted from lead (stage: ${lead.stage})`,
      description: `Lead ID: ${leadId}`,
      metadata: { leadId, leadStage: lead.stage },
      authorId,
      authorName,
      createdAt: new Date(),
    };

    await this.firebase.firestore
      .collection(this.activitiesCol)
      .doc(activity.id)
      .set(activity);

    // Mark lead as closed-won then delete
    await this.firebase.firestore.collection(this.col).doc(leadId).update({
      stage: CRMLeadStage.CLOSED_WON,
      updatedAt: new Date(),
    });

    await this.firebase.firestore.collection(this.col).doc(leadId).delete();

    return customer;
  }

  async getAllForExport(): Promise<CRMLead[]> {
    const snapshot = await this.firebase.firestore
      .collection(this.col)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((d: any) => d.data() as CRMLead);
  }
}
