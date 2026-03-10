import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { createMockFirebaseAdmin, makeDecodedToken } from '../../test-utils/mock-firebase-admin';

function makeContext(headers: Record<string, string> = {}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

describe('FirebaseAuthGuard', () => {
  let mockFirebaseAdmin: ReturnType<typeof createMockFirebaseAdmin>;

  beforeEach(() => {
    mockFirebaseAdmin = createMockFirebaseAdmin();
  });

  it('accepts a valid token and populates request.user', async () => {
    const decoded = makeDecodedToken();
    mockFirebaseAdmin.auth.verifyIdToken.mockResolvedValue(decoded);

    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any);
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
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any);
    const ctx = makeContext();
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when Authorization header has wrong prefix', async () => {
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any);
    const ctx = makeContext({ authorization: 'Basic some-token' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws 401 when verifyIdToken rejects', async () => {
    mockFirebaseAdmin.auth.verifyIdToken.mockRejectedValue(new Error('Firebase: invalid token'));
    const guard = new FirebaseAuthGuard(mockFirebaseAdmin as any);
    const ctx = makeContext({ authorization: 'Bearer bad-token' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
