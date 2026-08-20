import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useCallbackDetector from "../useCallbackDetector";

describe("useCallbackDetector", () => {
  it("returns a callbacks array", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(result.current.callbacks).toBeDefined();
    expect(Array.isArray(result.current.callbacks)).toBe(true);
  });

  it("returns callbacks with expected structure", () => {
    const { result } = renderHook(() => useCallbackDetector());
    const callbacks = result.current.callbacks;

    callbacks.forEach((cb: any) => {
      expect(cb).toHaveProperty("id");
      expect(cb).toHaveProperty("element");
      expect(cb).toHaveProperty("firstAppearance");
      expect(cb).toHaveProperty("callback");
      expect(cb).toHaveProperty("suggestion");
      expect(typeof cb.id).toBe("number");
      expect(typeof cb.element).toBe("string");
      expect(typeof cb.firstAppearance).toBe("string");
      expect(typeof cb.callback).toBe("string");
      expect(typeof cb.suggestion).toBe("string");
    });
  });

  it("returns a rerunAnalysis function", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(typeof result.current.rerunAnalysis).toBe("function");
  });

  it("memoizes callbacks — returns the same array on re-render", () => {
    const { result, rerender } = renderHook(() => useCallbackDetector());
    const first = result.current.callbacks;
    rerender();
    expect(result.current.callbacks).toBe(first);
  });

  it("calls onComplete when rerunAnalysis is invoked", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCallbackDetector({ onComplete }));
    result.current.rerunAnalysis();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onComplete is not provided", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(() => result.current.rerunAnalysis()).not.toThrow();
  });
});
