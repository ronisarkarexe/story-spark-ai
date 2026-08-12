// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value before delay passes", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("returns debounced value after delay has passed", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    vi.advanceTimersByTime(300);
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );
    expect(result.current).toBe("initial");
    rerender({ value: "updated" });
    expect(result.current).toBe("initial");
    vi.advanceTimersByTime(150);
    expect(result.current).toBe("initial");
  });

  it("returns updated value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );
    rerender({ value: "updated" });
    vi.advanceTimersByTime(300);
    expect(result.current).toBe("updated");
  });

  it("resets timer when value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "first" } }
    );
    rerender({ value: "second" });
    vi.advanceTimersByTime(200);
    expect(result.current).toBe("first");
    vi.advanceTimersByTime(200);
    expect(result.current).toBe("second");
  });

  it("uses default delay of 300ms when not specified", () => {
    const { result } = renderHook(() => useDebounce("test"));
    expect(result.current).toBe("test");
    vi.advanceTimersByTime(299);
    expect(result.current).toBe("test");
    vi.advanceTimersByTime(1);
    expect(result.current).toBe("test");
  });

  it("handles debouncing with zero delay", () => {
    const { result } = renderHook(() => useDebounce("immediate", 0));
    vi.advanceTimersByTime(0);
    expect(result.current).toBe("immediate");
  });

  it("handles different generic types", () => {
    const { result: stringResult } = renderHook(() => useDebounce("text"));
    expect(stringResult.current).toBe("text");

    const { result: numberResult } = renderHook(() => useDebounce(42));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() =>
      useDebounce({ key: "value" })
    );
    expect(objectResult.current).toEqual({ key: "value" });
  });
});
