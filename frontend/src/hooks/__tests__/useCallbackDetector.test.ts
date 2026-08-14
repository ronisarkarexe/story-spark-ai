import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCallbackDetector from "../useCallbackDetector";

describe("useCallbackDetector", () => {
  it("returns the detected callbacks", () => {
    const { result } = renderHook(() => useCallbackDetector());

    expect(result.current.callbacks).toHaveLength(3);

    expect(result.current.callbacks[0]).toMatchObject({
      id: 1,
      element: "Silver Necklace",
      firstAppearance: "Chapter 1",
      callback: "Chapter 8",
    });

    expect(result.current.callbacks[1]).toMatchObject({
      id: 2,
      element: "Old Letter",
      firstAppearance: "Chapter 2",
      callback: "Chapter 10",
    });

    expect(result.current.callbacks[2]).toMatchObject({
      id: 3,
      element: "Broken Watch",
      firstAppearance: "Chapter 3",
      callback: "Chapter 9",
    });
  });

  it("returns the same callbacks reference when rerendered", () => {
    const { result, rerender } = renderHook(() => useCallbackDetector());

    const firstCallbacks = result.current.callbacks;

    rerender();

    expect(result.current.callbacks).toBe(firstCallbacks);
  });

  it("calls alert when rerunAnalysis is invoked", () => {
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useCallbackDetector());

    act(() => {
      result.current.rerunAnalysis();
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      "Callback analysis completed.",
    );

    alertSpy.mockRestore();
  });
});