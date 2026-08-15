import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useCallbackDetector from "../useCallbackDetector";

describe("useCallbackDetector", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("returns a callbacks array", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(Array.isArray(result.current.callbacks)).toBe(true);
  });

  it("returns at least one callback item", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(result.current.callbacks.length).toBeGreaterThan(0);
  });

  it("callback items have expected structure", () => {
    const { result } = renderHook(() => useCallbackDetector());
    const callback = result.current.callbacks[0];
    expect(callback).toHaveProperty("id");
    expect(callback).toHaveProperty("element");
    expect(callback).toHaveProperty("firstAppearance");
    expect(callback).toHaveProperty("callback");
    expect(callback).toHaveProperty("suggestion");
    expect(typeof callback.id).toBe("number");
    expect(typeof callback.element).toBe("string");
    expect(typeof callback.firstAppearance).toBe("string");
    expect(typeof callback.callback).toBe("string");
    expect(typeof callback.suggestion).toBe("string");
  });

  it("callbacks are stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useCallbackDetector());
    const firstCallbacks = result.current.callbacks;
    rerender();
    expect(result.current.callbacks).toEqual(firstCallbacks);
  });

  it("rerunAnalysis is a function", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(typeof result.current.rerunAnalysis).toBe("function");
  });

  it("rerunAnalysis does not throw when called", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(() => result.current.rerunAnalysis()).not.toThrow();
  });
});
