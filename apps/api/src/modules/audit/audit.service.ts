import { Injectable, Logger } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { v4 as uuidv4 } from 'uuid';

export interface AuditLogEntry {
  actorId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: { before?: unknown; after?: unknown };
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private firebaseAdmin: FirebaseAdminService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const id = uuidv4();
      await this.firebaseAdmin.firestore.collection('audit_logs').doc(id).set({
        id,
        ...entry,
        createdAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${(error as Error).message}`);
    }
  }
}
