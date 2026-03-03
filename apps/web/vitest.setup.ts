import '@testing-library/jest-dom';

// ── Browser API stubs (not in jsdom) ─────────────────────────────────────────

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    private callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {}

  observe = vi.fn((element: Element) => {
    // Store element for manual triggering in tests
    (element as any).__intersectionObserver = this;
    (element as any).__ioCallback = this.callback;
  });

  unobserve = vi.fn();
  disconnect = vi.fn();

  // Helper for tests to manually trigger intersection
  _trigger(isIntersecting: boolean, element?: Element) {
    const entry = { isIntersecting } as IntersectionObserverEntry;
    this.callback([entry], this);
  }
}

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── localStorage stub ─────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(global, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// ── Per-test cleanup ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});
