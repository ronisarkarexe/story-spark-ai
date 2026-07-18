import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useScrollDirection } from '../useScrollDirection';

/**
 * Helper to set window.scrollY and fire the 'scroll' event so that the
 * hook's internal handler picks up the new value.
 */
const fireScroll = (scrollY: number) => {
  Object.defineProperty(window, 'scrollY', {
    value: scrollY,
    writable: true,
    configurable: true,
  });

  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
};

describe('useScrollDirection', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset scrollY to 0 before every test.
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });

    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers a passive scroll listener on mount and removes it on unmount', () => {
    const { unmount } = renderHook(() => useScrollDirection());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  it('defaults to isAtTop=true and scrollDirection="up" before any scrolling', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current.isAtTop).toBe(true);
    expect(result.current.scrollDirection).toBe('up');
  });

  it('returns isAtTop=true when scrollY is less than 10', () => {
    const { result } = renderHook(() => useScrollDirection());

    fireScroll(5);

    expect(result.current.isAtTop).toBe(true);
  });

  it('returns isAtTop=false when scrollY is 10 or greater', () => {
    const { result } = renderHook(() => useScrollDirection());

    fireScroll(10);

    expect(result.current.isAtTop).toBe(false);
  });

  it('returns isAtTop=false for scrollY well past the top threshold', () => {
    const { result } = renderHook(() => useScrollDirection());

    fireScroll(500);

    expect(result.current.isAtTop).toBe(false);
  });

  it('sets scrollDirection="down" when scrollY increases', () => {
    const { result } = renderHook(() => useScrollDirection());

    fireScroll(100);
    expect(result.current.scrollDirection).toBe('down');

    fireScroll(250);
    expect(result.current.scrollDirection).toBe('down');
  });

  it('sets scrollDirection="up" when scrollY decreases', () => {
    const { result } = renderHook(() => useScrollDirection());

    // First scroll down so we have a baseline to scroll back up from.
    fireScroll(300);
    expect(result.current.scrollDirection).toBe('down');

    fireScroll(150);
    expect(result.current.scrollDirection).toBe('up');
  });

  it('updates direction correctly across multiple consecutive scroll events', () => {
    const { result } = renderHook(() => useScrollDirection());

    fireScroll(50); // down from 0
    expect(result.current.scrollDirection).toBe('down');
    expect(result.current.isAtTop).toBe(false);

    fireScroll(20); // up from 50
    expect(result.current.scrollDirection).toBe('up');

    fireScroll(0); // up from 20, back at top
    expect(result.current.scrollDirection).toBe('up');
    expect(result.current.isAtTop).toBe(true);

    fireScroll(40); // down from 0
    expect(result.current.scrollDirection).toBe('down');
  });
});
