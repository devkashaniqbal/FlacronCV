import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useInView } from './useInView';

// Per-test tracking of the IntersectionObserver created inside the hook
let latestObserve: ReturnType<typeof vi.fn>;
let latestUnobserve: ReturnType<typeof vi.fn>;
let latestDisconnect: ReturnType<typeof vi.fn>;
let latestCallback: IntersectionObserverCallback | null = null;
let latestOptions: IntersectionObserverInit | undefined;

beforeEach(() => {
  latestObserve = vi.fn();
  latestUnobserve = vi.fn();
  latestDisconnect = vi.fn();
  latestCallback = null;
  latestOptions = undefined;

  // Must use a real constructor (class), NOT an arrow function, because
  // IntersectionObserver is always called with `new` inside useInView.
  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      latestCallback = callback;
      latestOptions = options;
    }
    observe = latestObserve;
    unobserve = latestUnobserve;
    disconnect = latestDisconnect;
    root = null;
    rootMargin = '';
    thresholds: number[] = [];
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

function triggerIntersection(isIntersecting: boolean) {
  act(() => {
    latestCallback!([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
}

/**
 * Renders a test component that uses useInView with a real <div> ref.
 */
function renderUseInView(opts?: Parameters<typeof useInView>[0]) {
  let capturedIsInView = false;

  function TestComponent() {
    const { ref, isInView } = useInView(opts);
    capturedIsInView = isInView;
    return <div ref={ref} />;
  }

  const { unmount, rerender } = render(<TestComponent />);
  return {
    getIsInView: () => capturedIsInView,
    unmount,
    rerender: () => rerender(<TestComponent />),
  };
}

describe('useInView', () => {
  it('starts with isInView=false', () => {
    const { getIsInView } = renderUseInView();
    expect(getIsInView()).toBe(false);
  });

  it('creates IntersectionObserver with correct options', () => {
    renderUseInView({ threshold: 0.5, rootMargin: '10px' });
    // IntersectionObserver should have been constructed with our options
    expect(latestOptions).toBeDefined();
    expect(latestOptions!.threshold).toBe(0.5);
    expect(latestOptions!.rootMargin).toBe('10px');
  });

  it('with triggerOnce=true, becomes in-view and does not toggle back', () => {
    let isInView = false;

    function TestComponent() {
      const result = useInView({ triggerOnce: true });
      isInView = result.isInView;
      return <div ref={result.ref} />;
    }

    render(<TestComponent />);

    triggerIntersection(true);
    expect(isInView).toBe(true);

    // Triggering false should not revert (triggerOnce=true)
    triggerIntersection(false);
    expect(isInView).toBe(true);
  });

  it('with triggerOnce=false, toggles isInView on/off', () => {
    let isInView = false;

    function TestComponent() {
      const result = useInView({ triggerOnce: false });
      isInView = result.isInView;
      return <div ref={result.ref} />;
    }

    render(<TestComponent />);

    triggerIntersection(true);
    expect(isInView).toBe(true);

    triggerIntersection(false);
    expect(isInView).toBe(false);
  });

  it('calls observer.disconnect on unmount', () => {
    const { unmount } = renderUseInView();
    unmount();
    expect(latestDisconnect).toHaveBeenCalled();
  });
});
