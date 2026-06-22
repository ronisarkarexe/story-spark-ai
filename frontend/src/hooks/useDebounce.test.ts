// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));

    expect(result.current).toBe("hello");
  });

  it("should update the value after the delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "hello" },
      }
    );

    rerender({ value: "world" });

    // Value should not change immediately
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should update after delay
    expect(result.current).toBe("world");

    vi.useRealTimers();
  });

  it("should only keep the latest value when updated rapidly", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "A" },
      }
    );

    rerender({ value: "B" });
    rerender({ value: "C" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("C");

    vi.useRealTimers();
  });
});