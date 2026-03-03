import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { createMockFirebaseAdmin, makeDecodedToken } from '../../test-utils/mock-firebase-admin';

/**
 * Creates a minimal mock ExecutionContext with the given request shape.
 */
function makeContext(headers: Record<string, string> = {}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

/**
 * Creates a minimal ConfigService mock.
 */
function makeConfigService(nodeEnv = 'production') {
  return {
    get: jest.fn((key: string) => (key === 'nodeEnv' ? nodeEnv : undefined)),
  };
}

describe('FirebaseAuthGuard', () => {
  let mockFirebaseAdmin: ReturnType<typeof createMockFirebaseAdmin>;

  beforeEach(() => {
    mockFirebaseAdmin = createMockFirebaseAdmin();
  });

  it('accepts a valid token and populates request.user', async () => {
    const decoded = makeDecodedToken();
    mockFirebaseAdmin.auth.verifyIdToken.mockResolvedValue(decoded);

    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService() as any);
    const req: any = { headers: { authorization: 'Bearer valid-token' } };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe('test-uid-123');
    expect(req.user.email).toBe('test@example.com');
    expect(mockFirebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it('throws 401 when no Authorization header is present', async () => {
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService() as any);
    const ctx = makeContext();
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when Authorization header has wrong prefix', async () => {
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService() as any);
    const ctx = makeContext({ authorization: 'Basic some-token' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when verifyIdToken rejects in production', async () => {
    mockFirebaseAdmin.auth.verifyIdToken.mockRejectedValue(new Error('Firebase: invalid token'));
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService('production') as any);
    const ctx = makeContext({ authorization: 'Bearer bad-token' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('accepts an unverified token in development mode when JWT payload has user_id', async () => {
    mockFirebaseAdmin.auth.verifyIdToken.mockRejectedValue(new Error('Firebase: invalid'));

    // Build a minimal valid JWT (header.payload.signature) with user_id
    const payload = { user_id: 'dev-uid', email: 'dev@example.com', email_verified: false };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const devToken = `eyJhbGciOiJSUzI1NiJ9.${encodedPayload}.fakesig`;

    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService('development') as any);
    const req: any = { headers: { authorization: `Bearer ${devToken}` } };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(req.user.uid).toBe('dev-uid');
  });

  it('throws 401 in dev mode when JWT payload is invalid (no user_id)', async () => {
    mockFirebaseAdmin.auth.verifyIdToken.mockRejectedValue(new Error('Firebase: invalid'));

    // Payload missing user_id
    const payload = { sub: 'no-user-id-field', email: 'x@x.com' };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const devToken = `eyJhbGciOiJSUzI1NiJ9.${encodedPayload}.fakesig`;

    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any, makeConfigService('development') as any);
    const ctx = makeContext({ authorization: `Bearer ${devToken}` });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
