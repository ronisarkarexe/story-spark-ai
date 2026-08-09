import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("should return initial value before delay expires", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("hello");
  });

  it("should return debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 300 } }
    );

    rerender({ value: "world", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");
  });

  it("should use custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    );

    rerender({ value: "world", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("world");
  });

  it("should debounce multiple rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 200 } }
    );

    rerender({ value: "b", delay: 200 });
    rerender({ value: "c", delay: 200 });
    rerender({ value: "d", delay: 200 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("d");
  });

  it("should return correct type for generic values", () => {
    const { result: stringResult } = renderHook(() => useDebounce("text", 100));
    expect(typeof stringResult.current).toBe("string");

    const { result: numberResult } = renderHook(() => useDebounce(42, 100));
    expect(typeof numberResult.current).toBe("number");

    const { result: objectResult } = renderHook(() =>
      useDebounce({ key: "value" }, 100)
    );
    expect(objectResult.current).toEqual({ key: "value" });
  });

  it("should default to 300ms delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("updated");
  });
});
