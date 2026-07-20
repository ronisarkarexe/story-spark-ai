/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRetry } from "../useRetry";

let setIntervalSpy: ReturnType<typeof vi.spyOn>;
let clearIntervalSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  setIntervalSpy = vi.spyOn(global, "setInterval");
  clearIntervalSpy = vi.spyOn(global, "clearInterval");
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useRetry", () => {
  it("initializes with retryCount=0, isRetrying=false, isTimeout=false, countdown=0", () => {
    const { result } = renderHook(() => useRetry());
    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.isTimeout).toBe(false);
    expect(result.current.countdown).toBe(0);
  });

  it("respects custom maxRetries option", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 5 }));
    expect(result.current.MAX_RETRIES).toBe(5);
  });

  it("handleRetry increments retryCount", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 0 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    expect(result.current.retryCount).toBe(1);
    expect(result.current.isTimeout).toBe(false);
  });

  it("handleRetry increments retryCount and resets isTimeout", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 0 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });
    expect(result.current.retryCount).toBe(1);
    expect(result.current.isTimeout).toBe(false);
  });

  it("handleRetry with baseDelay=0 executes trigger immediately without countdown", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 0 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    // No setInterval should be called for baseDelay=0
    expect(setIntervalSpy).not.toHaveBeenCalled();
    // triggerFn should be called synchronously
    expect(triggerFn).toHaveBeenCalled();
  });

  it("handleRetry with baseDelay>0 starts countdown and executes after delay", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 2 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    // Countdown should be set
    expect(result.current.countdown).toBeGreaterThan(0);
    expect(setIntervalSpy).toHaveBeenCalled();

    // triggerFn not called yet (countdown in progress)
    expect(triggerFn).not.toHaveBeenCalled();

    // Advance timers past the countdown
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // triggerFn should now be called
    expect(triggerFn).toHaveBeenCalled();
  });

  it("handleRetry does not trigger while countdown is active", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 5 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    // Attempt to retry during countdown
    act(() => {
      result.current.handleRetry(triggerFn);
    });

    // retryCount should still be 1
    expect(result.current.retryCount).toBe(1);
  });

  it("resetRetry clears all state", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 2 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Now reset
    act(() => {
      result.current.resetRetry();
    });

    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.isTimeout).toBe(false);
    expect(result.current.countdown).toBe(0);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("setIsTimeout is exposed and functional", () => {
    const { result } = renderHook(() => useRetry());

    act(() => {
      result.current.setIsTimeout(true);
    });
    expect(result.current.isTimeout).toBe(true);

    act(() => {
      result.current.setIsTimeout(false);
    });
    expect(result.current.isTimeout).toBe(false);
  });

  it("countdown decrements via setInterval", () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 3, baseDelay: 3 }));
    const triggerFn = vi.fn();

    act(() => {
      result.current.handleRetry(triggerFn);
    });

    const initialCountdown = result.current.countdown;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.countdown).toBe(initialCountdown - 1);
  });
});
