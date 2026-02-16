import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { InMemoryFirestore } from './in-memory-firestore';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app!: admin.app.App;
  private _isConfigured = false;
  private _useInMemory = false;
  private _inMemoryFirestore: InMemoryFirestore | null = null;

  constructor(private configService: ConfigService) {}

  get isConfigured(): boolean {
    return this._isConfigured;
  }

  async onModuleInit() {
    if (admin.apps.length > 0) {
      this.app = admin.apps[0]!;
      this._isConfigured = true;
    } else {
      this.initializeApp();
    }

    // Test Firestore connectivity
    if (this._isConfigured) {
      try {
        await this.app.firestore().listCollections();
        this.logger.log('Firestore connection verified');
      } catch (error) {
        this.logger.warn(`Firestore not accessible: ${(error as Error).message}`);
        this.logger.warn('Falling back to in-memory store (dev mode - data lost on restart)');
        this._useInMemory = true;
        this._inMemoryFirestore = new InMemoryFirestore();
      }
    } else {
      this._useInMemory = true;
      this._inMemoryFirestore = new InMemoryFirestore();
      this.logger.warn('Using in-memory store (dev mode - data lost on restart)');
    }
  }

  private initializeApp() {
    const projectId = this.configService.get<string>('firebase.projectId');
    const privateKey = this.configService.get<string>('firebase.privateKey');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const storageBucket = this.configService.get<string>('firebase.storageBucket');

    // Try cert-based auth if all credentials available
    if (projectId && privateKey && clientEmail) {
      try {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
          storageBucket,
        });
        this._isConfigured = true;
        this.logger.log('Firebase Admin initialized with service account credentials');
        return;
      } catch (error) {
        this.logger.warn(`Failed to init with cert: ${(error as Error).message}`);
      }
    }

    // Try Application Default Credentials
    try {
      this.app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId,
        storageBucket,
      });
      this._isConfigured = true;
      this.logger.log('Firebase Admin initialized with Application Default Credentials');
      return;
    } catch (error) {
      this.logger.warn(`Failed to init with ADC: ${(error as Error).message}`);
    }

    // Last resort: initialize with just project ID
    try {
      this.app = admin.initializeApp({ projectId: projectId || 'dev-project', storageBucket });
      this._isConfigured = true;
      this.logger.warn('Firebase Admin initialized without credentials');
    } catch (error) {
      this.logger.error(`Firebase Admin failed to initialize: ${(error as Error).message}`);
      this.app = admin.initializeApp({ projectId: projectId || 'dev-project' });
    }
  }

  get auth(): admin.auth.Auth {
    return this.app.auth();
  }

  get firestore(): any {
    if (this._useInMemory && this._inMemoryFirestore) {
      return this._inMemoryFirestore;
    }
    return this.app.firestore();
  }

  get storage(): admin.storage.Storage {
    return this.app.storage();
  }

  get bucket(): ReturnType<admin.storage.Storage['bucket']> {
    return this.storage.bucket();
  }
}
