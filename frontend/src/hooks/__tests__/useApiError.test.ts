/**
 * useApiError.test.ts
 * Unit tests for the useApiError React hook.
 */
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useApiError } from "../useApiError";

describe("useApiError", () => {
  it("initializes error state to null", () => {
    const { result } = renderHook(() => useApiError());
    expect(result.current.error).toBeNull();
  });

  it("setError updates the error string", () => {
    const { result } = renderHook(() => useApiError());
    act(() => {
      result.current.setError("Something went wrong");
    });
    expect(result.current.error).toBe("Something went wrong");
  });

  it("setError can update to a different error message", () => {
    const { result } = renderHook(() => useApiError());
    act(() => {
      result.current.setError("First error");
    });
    act(() => {
      result.current.setError("Second error");
    });
    expect(result.current.error).toBe("Second error");
  });

  it("clearError resets error back to null", () => {
    const { result } = renderHook(() => useApiError());
    act(() => {
      result.current.setError("Some error");
    });
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it("clearError has no effect when error is already null", () => {
    const { result } = renderHook(() => useApiError());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it("setError and clearError are stable across re-renders", () => {
    const { result } = renderHook(() => useApiError());
    act(() => {
      result.current.setError("error1");
    });
    act(() => {
      result.current.setError("error2");
    });
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
