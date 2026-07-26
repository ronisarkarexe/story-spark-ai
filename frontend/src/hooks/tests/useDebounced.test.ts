/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounced } from '../global';

describe('useDebounced hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns the initial value immediately on render', () => {
    const { result } = renderHook(() =>
      useDebounced({ searchQuery: 'initial search', delay: 500 })
    );
    expect(result.current).toBe('initial search');
  });

  it('updates the debounced value after the delay period', () => {
    const { result, rerender } = renderHook(
      ({ searchQuery, delay }) => useDebounced({ searchQuery, delay }),
      {
        initialProps: { searchQuery: 'hello', delay: 500 },
      }
    );

    expect(result.current).toBe('hello');

    rerender({ searchQuery: 'hello world', delay: 500 });
    // Value should remain unchanged before the delay period finishes
    expect(result.current).toBe('hello');

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('hello');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('hello world');
  });

  it('clears and resets the timeout on a new searchQuery before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ searchQuery, delay }) => useDebounced({ searchQuery, delay }),
      {
        initialProps: { searchQuery: 'a', delay: 500 },
      }
    );

    rerender({ searchQuery: 'ab', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('a');

    // User types 'abc' before the 'ab' delay of 500ms finishes
    rerender({ searchQuery: 'abc', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should still be 'a' because 'abc' timer is reset and needs 500ms
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('abc');
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() =>
      useDebounced({ searchQuery: 'test', delay: 500 })
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('handles different delay values correctly', () => {
    const { result, rerender } = renderHook(
      ({ searchQuery, delay }) => useDebounced({ searchQuery, delay }),
      {
        initialProps: { searchQuery: 'start', delay: 200 },
      }
    );

    rerender({ searchQuery: 'fast update', delay: 200 });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('start');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('fast update');

    // Test with a longer delay
    rerender({ searchQuery: 'slow update', delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('fast update');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('slow update');
  });
});
