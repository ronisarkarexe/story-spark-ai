import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCallbackDetector from "../useCallbackDetector";

describe("useCallbackDetector", () => {
  it("returns a callbacks array", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(result.current.callbacks).toBeDefined();
    expect(Array.isArray(result.current.callbacks)).toBe(true);
    expect(result.current.callbacks.length).toBeGreaterThan(0);
  });

  it("returns callbacks with expected structure", () => {
    const { result } = renderHook(() => useCallbackDetector());
    const callbacks = result.current.callbacks;

    callbacks.forEach((cb) => {
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

  it("keeps rerunAnalysis stable until onComplete changes", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { result, rerender } = renderHook(
      ({ onComplete }) => useCallbackDetector({ onComplete }),
      { initialProps: { onComplete: firstCallback } }
    );
    const first = result.current.rerunAnalysis;

    rerender({ onComplete: firstCallback });
    expect(result.current.rerunAnalysis).toBe(first);

    rerender({ onComplete: secondCallback });
    expect(result.current.rerunAnalysis).not.toBe(first);
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

    act(() => {
      result.current.rerunAnalysis();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not throw or call alert when onComplete is not provided", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useCallbackDetector());

    expect(() => {
      act(() => {
        result.current.rerunAnalysis();
      });
    }).not.toThrow();

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
