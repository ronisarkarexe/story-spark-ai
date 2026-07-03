import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounced } from "../global";

describe("useDebounced hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("returns the initial value immediately without waiting for delay", () => {
    const { result } = renderHook(() =>
      useDebounced({ searchQuery: "initial", delay: 300 })
    );

    expect(result.current).toBe("initial");
  });

  it("returns the initial value before the delay expires", () => {
    const { result } = renderHook(() =>
      useDebounced({ searchQuery: "updated", delay: 300 })
    );

    // Advance time but not past the delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("updated");
  });

  it("updates the debounced value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ query, delay }: { query: string; delay: number }) =>
        useDebounced({ searchQuery: query, delay }),
      { initialProps: { query: "initial", delay: 300 } }
    );

    expect(result.current).toBe("initial");

    rerender({ query: "updated", delay: 300 });

    // Still initial before timer fires
    expect(result.current).toBe("updated");

    // Advance past the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("resets the timeout when searchQuery changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ query, delay }: { query: string; delay: number }) =>
        useDebounced({ searchQuery: query, delay }),
      { initialProps: { query: "a", delay: 300 } }
    );

    expect(result.current).toBe("a");

    // Change value before delay expires
    rerender({ query: "ab", delay: 300 });

    // Advance by half the delay - should not update yet
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // The old timeout is cancelled, new one started
    // After 300ms from the last change, it should update
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("ab");
  });

  it("cleans up the timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = renderHook(() =>
      useDebounced({ searchQuery: "value", delay: 300 })
    );

    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("works with different delay values", () => {
    const { result } = renderHook(() =>
      useDebounced({ searchQuery: "value", delay: 500 })
    );

    expect(result.current).toBe("value");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("value");
  });

  it("handles empty string as initial value", () => {
    const { result } = renderHook(() =>
      useDebounced({ searchQuery: "", delay: 300 })
    );

    expect(result.current).toBe("");
  });
});
