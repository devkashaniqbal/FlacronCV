import { InMemoryFirestore } from '../modules/firebase/in-memory-firestore';

/**
 * Creates a mock FirebaseAdminService for use in unit/integration tests.
 * Returns a plain object (not a NestJS injectable), safe for use with
 * TestingModule.overrideProvider() or direct construction.
 */
export function createMockFirebaseAdmin() {
  const inMemoryFirestore = new InMemoryFirestore();

  return {
    firestore: inMemoryFirestore,
    isConfigured: true,
    onModuleInit: jest.fn().mockResolvedValue(undefined),
    auth: {
      verifyIdToken: jest.fn(),
      getUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
      revokeRefreshTokens: jest.fn().mockResolvedValue(undefined),
      generatePasswordResetLink: jest.fn().mockResolvedValue('https://example.com/reset'),
      generateEmailVerificationLink: jest.fn().mockResolvedValue('https://example.com/verify'),
      listUsers: jest.fn(),
    },
    storage: {},
    bucket: {},
  };
}

/**
 * Creates a fake Firebase decoded token (DecodedIdToken shape).
 */
export function makeDecodedToken(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    uid: 'test-uid-123',
    email: 'test@example.com',
    email_verified: true,
    name: 'Test User',
    picture: null,
    role: 'user',
    iss: 'https://securetoken.google.com/test-project',
    aud: 'test-project',
    auth_time: Math.floor(Date.now() / 1000) - 60,
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 3600,
    sub: 'test-uid-123',
    firebase: {
      identities: { email: ['test@example.com'] },
      sign_in_provider: 'password',
    },
    ...overrides,
  };
}
