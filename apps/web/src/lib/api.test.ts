import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted runs before vi.mock hoisting, so the variable is available in the factory
const { mockCurrentUser } = vi.hoisted(() => {
  const mockCurrentUser: { currentUser: { getIdToken: () => Promise<string> } | null } = {
    currentUser: null,
  };
  return { mockCurrentUser };
});

// Mock the firebase module that api.ts depends on
vi.mock('./firebase', () => ({
  auth: mockCurrentUser,
}));

// Import api AFTER mocks are set up
import { api } from './api';

describe('api lib', () => {
  beforeEach(() => {
    mockCurrentUser.currentUser = null;
    vi.stubGlobal('fetch', vi.fn());
  });

  function makeFetchResponse(body: unknown, ok = true) {
    return Promise.resolve({
      ok,
      status: ok ? 200 : 404,
      json: () => Promise.resolve(body),
    } as Response);
  }

  it('sends GET request without auth header when no user is logged in', async () => {
    mockCurrentUser.currentUser = null;
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ data: { items: [] } }),
    );

    await api.get('/test');

    const [, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = (opts as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('injects Authorization header when user is logged in', async () => {
    mockCurrentUser.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('my-id-token'),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ data: { id: 1 } }),
    );

    await api.get('/protected');

    const [, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = (opts as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer my-id-token');
  });

  it('POST sends JSON body', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ data: { created: true } }),
    );

    await api.post('/items', { name: 'Test' });

    const [, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((opts as RequestInit).method).toBe('POST');
    expect((opts as RequestInit).body).toBe(JSON.stringify({ name: 'Test' }));
  });

  it('throws Error with server message on non-ok response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ message: 'Not found' }, false),
    );

    await expect(api.get('/missing')).rejects.toThrow('Not found');
  });

  it('unwraps data envelope — returns data.data when present', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ success: true, data: { id: 42 }, timestamp: '2024-01-01' }),
    );

    const result = await api.get<{ id: number }>('/wrapped');
    expect(result).toEqual({ id: 42 });
  });

  it('returns response body directly when no data envelope', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ id: 99, name: 'raw' }),
    );

    const result = await api.get<{ id: number; name: string }>('/raw');
    expect(result).toEqual({ id: 99, name: 'raw' });
  });

  it('proceeds without auth header when token fetch fails', async () => {
    mockCurrentUser.currentUser = {
      getIdToken: vi.fn().mockRejectedValue(new Error('token fetch failed')),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      makeFetchResponse({ data: {} }),
    );

    await api.get('/fallback');

    const [, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = (opts as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });
});
