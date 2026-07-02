import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useWritingMetrics } from "../useWritingMetrics";

describe("useWritingMetrics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize correct callbacks", () => {
    const onSessionReady = vi.fn();
    const { result } = renderHook(() => useWritingMetrics({ onSessionReady }));
    
    expect(result.current.onPromptChange).toBeDefined();
    expect(result.current.onKeyDown).toBeDefined();
    expect(result.current.onRegenerate).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it("should track prompt change, keys, and trigger session ready after enough snapshots", () => {
    const onSessionReady = vi.fn();
    const { result } = renderHook(() => useWritingMetrics({ onSessionReady }));

    // Start session by pressing a key
    act(() => {
      result.current.onPromptChange("stuck ugh writing");
      result.current.onKeyDown({ key: "a" } as any);
    });

    // Press more keys, including backspaces
    act(() => {
      result.current.onKeyDown({ key: "b" } as any);
      result.current.onKeyDown({ key: "Backspace" } as any);
      result.current.onRegenerate();
    });

    // Fast-forward 10 windows (30 seconds each, total 300 seconds) to fill the buffer (SEQ_LEN = 10)
    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(30 * 1000);
      });
    }

    expect(onSessionReady).toHaveBeenCalledTimes(1);
    const sessionData = onSessionReady.mock.calls[0][0];
    expect(sessionData.length).toBe(10);
    
    // First snapshot checks
    const firstSnapshot = sessionData[0];
    expect(firstSnapshot.prompt_length).toBe(3); // "stuck", "ugh", "writing"
    expect(firstSnapshot.blocked_word_count).toBe(2); // "stuck", "ugh"
    expect(firstSnapshot.backspace_ratio).toBe(33); // 1 backspace out of 3 keys ("a", "b", "Backspace")
    expect(firstSnapshot.regeneration_count).toBe(1);
    expect(firstSnapshot.confidence_score).toBe(10); // deriveConfidence(1) -> 10
  });

  it("should reset correctly", () => {
    const onSessionReady = vi.fn();
    const { result } = renderHook(() => useWritingMetrics({ onSessionReady }));

    act(() => {
      result.current.onPromptChange("test");
      result.current.onKeyDown({ key: "a" } as any);
      result.current.reset();
    });

    // Advance time and check that no snapshots are taken because timer is cleared
    act(() => {
      vi.advanceTimersByTime(300 * 1000);
    });

    expect(onSessionReady).not.toHaveBeenCalled();
  });
});
