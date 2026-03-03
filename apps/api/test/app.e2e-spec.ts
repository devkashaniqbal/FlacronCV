import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FirebaseAdminService } from '../src/modules/firebase/firebase-admin.service';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { createMockFirebaseAdmin, makeDecodedToken } from '../src/test-utils/mock-firebase-admin';

describe('App E2E', () => {
  let app: INestApplication;
  let mockFirebaseAdmin: ReturnType<typeof createMockFirebaseAdmin>;

  beforeAll(async () => {
    mockFirebaseAdmin = createMockFirebaseAdmin();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAdminService)
      .useValue(mockFirebaseAdmin)
      .compile();

    app = moduleFixture.createNestApplication({ rawBody: true });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Response envelope helpers ────────────────────────────────────────────

  function expectSuccess(res: request.Response) {
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  }

  function expectError(res: request.Response) {
    expect(res.body.success).toBe(false);
    expect(res.body.statusCode).toBeDefined();
    expect(res.body.path).toBeDefined();
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  describe('GET /api/v1/templates', () => {
    it('returns 200 with success envelope', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/templates').expect(200);
      expectSuccess(res);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/templates/:id', () => {
    it('returns 404 for unknown template id', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/templates/nonexistent-template-id')
        .expect(404);
      expectError(res);
    });
  });

  // ─── Auth ─────────────────────────────────────────────────────────────────

  describe('POST /api/v1/auth/verify', () => {
    it('returns 401 when no token provided', async () => {
      const res = await request(app.getHttpServer()).post('/api/v1/auth/verify').expect(401);
      expectError(res);
    });

    it('returns 200 when a valid Bearer token is provided', async () => {
      const decoded = makeDecodedToken();
      mockFirebaseAdmin.auth.verifyIdToken.mockResolvedValue(decoded as any);

      // Seed a user doc so verifyAndSync works
      await mockFirebaseAdmin.firestore
        .collection('users')
        .doc('test-uid-123')
        .set({
          uid: 'test-uid-123',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
          phoneNumber: null,
          profile: { firstName: 'Test', lastName: 'User', headline: '', bio: '', location: '', website: '', linkedin: '', github: '' },
          preferences: { language: 'en', theme: 'system', emailNotifications: true, marketingEmails: false, defaultCVTemplate: 'modern' },
          subscription: { plan: 'free', status: 'active', stripeCustomerId: null, stripeSubscriptionId: null, currentPeriodEnd: null, cancelAtPeriodEnd: false },
          usage: { cvsCreated: 0, coverLettersCreated: 0, aiCreditsUsed: 0, aiCreditsLimit: 5, exportsThisMonth: 0, lastExportReset: new Date() },
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true,
          deletedAt: null,
          welcomeEmailSent: true,
        });

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/verify')
        .set('Authorization', 'Bearer valid-test-token')
        .expect(200);

      expectSuccess(res);
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('returns 400 for missing email field', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/reset-password')
        .send({})
        .expect(400);
      expectError(res);
    });
  });

  // ─── CVs ──────────────────────────────────────────────────────────────────

  describe('GET /api/v1/cvs', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/cvs').expect(401);
      expectError(res);
    });

    it('returns 200 with authenticated user', async () => {
      const decoded = makeDecodedToken({ uid: 'cv-test-uid' });
      mockFirebaseAdmin.auth.verifyIdToken.mockResolvedValue(decoded as any);

      const res = await request(app.getHttpServer())
        .get('/api/v1/cvs')
        .set('Authorization', 'Bearer cv-test-token')
        .expect(200);

      expectSuccess(res);
    });
  });
});
