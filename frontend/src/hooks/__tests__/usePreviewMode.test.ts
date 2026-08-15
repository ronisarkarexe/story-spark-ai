import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import usePreviewMode from "../usePreviewMode";

describe("usePreviewMode", () => {
  it("returns initial preview state as false", () => {
    const { result } = renderHook(() => usePreviewMode());
    expect(result.current.preview).toBe(false);
  });

  it("returns togglePreview as a function", () => {
    const { result } = renderHook(() => usePreviewMode());
    expect(typeof result.current.togglePreview).toBe("function");
  });

  it("toggles preview to true when togglePreview is called", () => {
    const { result } = renderHook(() => usePreviewMode());
    expect(result.current.preview).toBe(false);

    act(() => {
      result.current.togglePreview();
    });

    expect(result.current.preview).toBe(true);
  });

  it("toggles preview back to false when togglePreview is called again", () => {
    const { result } = renderHook(() => usePreviewMode());

    act(() => {
      result.current.togglePreview();
    });
    expect(result.current.preview).toBe(true);

    act(() => {
      result.current.togglePreview();
    });

    expect(result.current.preview).toBe(false);
  });

  it("returns the correct shape with preview and togglePreview", () => {
    const { result } = renderHook(() => usePreviewMode());
    expect(result.current).toHaveProperty("preview");
    expect(result.current).toHaveProperty("togglePreview");
    expect(Object.keys(result.current)).toHaveLength(2);
  });

  it("multiple toggle calls alternate between true and false", () => {
    const { result } = renderHook(() => usePreviewMode());

    act(() => {
      result.current.togglePreview();
    });
    expect(result.current.preview).toBe(true);

    act(() => {
      result.current.togglePreview();
    });
    expect(result.current.preview).toBe(false);

    act(() => {
      result.current.togglePreview();
    });
    expect(result.current.preview).toBe(true);
  });
});
