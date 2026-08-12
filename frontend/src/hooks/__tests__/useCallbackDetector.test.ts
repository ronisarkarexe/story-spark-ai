import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useCallbackDetector from "../useCallbackDetector";
import { CallbackItem } from "../../utils/callbackDetector";

describe("useCallbackDetector hook", () => {
  it("returns an object with callbacks and rerunAnalysis", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(result.current).toHaveProperty("callbacks");
    expect(result.current).toHaveProperty("rerunAnalysis");
  });

  it("returns an array of callbacks", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(Array.isArray(result.current.callbacks)).toBe(true);
  });

  it("returns a function for rerunAnalysis", () => {
    const { result } = renderHook(() => useCallbackDetector());
    expect(typeof result.current.rerunAnalysis).toBe("function");
  });

  it("callbacks array contains objects with expected shape", () => {
    const { result } = renderHook(() => useCallbackDetector());
    result.current.callbacks.forEach((item: CallbackItem) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("element");
      expect(item).toHaveProperty("firstAppearance");
      expect(item).toHaveProperty("callback");
      expect(item).toHaveProperty("suggestion");
    });
  });
});
