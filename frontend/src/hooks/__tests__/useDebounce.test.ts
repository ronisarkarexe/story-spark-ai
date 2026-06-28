import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("should return the initial value for a number", () => {
    const { result } = renderHook(() => useDebounce(42, 300));
    expect(result.current).toBe(42);
  });

  it("should update the debounced value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 300 });

    // Value should still be old before the timer fires
    expect(result.current).toBe("initial");

    // Advance time past the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now the debounced value should be updated
    expect(result.current).toBe("updated");
  });

  it("should reset the timer when a new value arrives before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "first", delay: 500 } }
    );

    expect(result.current).toBe("first");

    rerender({ value: "second", delay: 500 });

    // Advance time partially (250ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Value should still be first since 250ms < 500ms delay
    expect(result.current).toBe("first");

    // Advance remaining time (250ms more = 500ms total)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Still first because the timer reset when second value came
    expect(result.current).toBe("first");

    // Advance past the reset timer
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now the debounced value should be the second value
    expect(result.current).toBe("second");
  });

  it("should use the default delay of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value),
      { initialProps: { value: "start" } }
    );

    expect(result.current).toBe("start");

    rerender({ value: "end" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("end");
  });

  it("should work with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: number; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 100, delay: 1000 } }
    );

    expect(result.current).toBe(100);

    rerender({ value: 200, delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe(100);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(200);
  });

  it("should debounce with a short delay of 100ms", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 100),
      { initialProps: { value: "a" } }
    );

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");
  });

  it("should debounce with a long delay of 1000ms", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 1000),
      { initialProps: { value: "long" } }
    );

    expect(result.current).toBe("long");

    rerender({ value: "longer" });
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toBe("long");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("longer");
  });

  it("should handle null and undefined values", () => {
    const { result: result1, rerender: rerender1 } = renderHook(
      ({ value }: { value: string | null }) => useDebounce(value, 300),
      { initialProps: { value: "has value" } }
    );

    expect(result1.current).toBe("has value");

    rerender1({ value: null });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result1.current).toBeNull();
  });

  it("should handle object values", () => {
    const obj = { key: "value" };
    const { result, rerender } = renderHook(
      ({ value }: { value: object }) => useDebounce(value, 300),
      { initialProps: { value: obj } }
    );

    expect(result.current).toBe(obj);

    const newObj = { key: "new value" };
    rerender({ value: newObj });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(newObj);
  });
});
