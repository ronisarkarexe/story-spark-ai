import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollDirection } from '../useScrollDirection';

describe('useScrollDirection hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with scrollDirection as up and isAtTop as true', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.scrollDirection).toBe('up');
    expect(result.current.isAtTop).toBe(true);
  });

  it('should detect scroll down when currentScrollY is greater than lastScrollY', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { result, rerender } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
    rerender();
    expect(result.current.scrollDirection).toBe('down');
    expect(result.current.isAtTop).toBe(false);
  });

  it('should detect scroll up when currentScrollY is less than lastScrollY', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
    const { result, rerender } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true });
    rerender();
    expect(result.current.scrollDirection).toBe('up');
  });

  it('should set isAtTop to true when scrollY is below 10', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { result, rerender } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', { value: 9, writable: true, configurable: true });
    rerender();
    expect(result.current.isAtTop).toBe(true);
  });

  it('should set isAtTop to false when scrollY is 10 or above', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { result, rerender } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', { value: 10, writable: true, configurable: true });
    rerender();
    expect(result.current.isAtTop).toBe(false);
  });

  it('should set isAtTop to false when scrollY is well above 10', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { result, rerender } = renderHook(() => useScrollDirection());

    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true });
    rerender();
    expect(result.current.isAtTop).toBe(false);
    expect(result.current.scrollDirection).toBe('down');
  });

  it('should clean up the scroll event listener on unmount', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    const { unmount } = renderHook(() => useScrollDirection());
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });
});
