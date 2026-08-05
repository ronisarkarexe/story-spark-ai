import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRetry } from "../useRetry";

describe("useRetry hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns initial state with default options", () => {
    const { result } = renderHook(() => useRetry());
    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.isTimeout).toBe(false);
    expect(result.current.countdown).toBe(0);
    expect(result.current.MAX_RETRIES).toBe(3);
  });

  it("returns custom MAX_RETRIES from options", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 5 }));
    expect(result.current.MAX_RETRIES).toBe(5);
  });

  it("handleRetry increments retryCount", () => {
    const { result } = renderHook(() => useRetry());
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    expect(result.current.retryCount).toBe(1);
    expect(triggerFn).toHaveBeenCalled();
  });

  it("handleRetry does not call triggerFn when at max retries", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 1 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });
    expect(result.current.retryCount).toBe(1);

    act(() => {
      result.current.handleRetry(triggerFn);
    });
    // Count should remain at 1 since maxRetries=1 is already reached
    expect(result.current.retryCount).toBe(1);
  });

  it("resetRetry resets all state to initial values", () => {
    const { result } = renderHook(() => useRetry());

    act(() => {
      result.current.handleRetry(vi.fn());
    });
    expect(result.current.retryCount).toBe(1);

    act(() => {
      result.current.resetRetry();
    });

    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.isTimeout).toBe(false);
    expect(result.current.countdown).toBe(0);
  });

  it("setIsTimeout updates the isTimeout state", () => {
    const { result } = renderHook(() => useRetry());

    expect(result.current.isTimeout).toBe(false);

    act(() => {
      result.current.setIsTimeout(true);
    });

    expect(result.current.isTimeout).toBe(true);
  });

  it("handleRetry respects countdown guard to prevent concurrent retries", () => {
    const { result } = renderHook(() => useRetry({ baseDelay: 500 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    // countdown is now 500 (baseDelay * nextCount)
    expect(result.current.countdown).toBeGreaterThan(0);

    // Calling handleRetry while countdown > 0 should be blocked
    const callCount = triggerFn.mock.calls.length;
    act(() => {
      result.current.handleRetry(triggerFn);
    });
    // triggerFn should not be called again since countdown is active
    expect(triggerFn.mock.calls.length).toBe(callCount);
  });
});
