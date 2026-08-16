import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";

// Mock analyzeStory so the hook's behavior can be observed in isolation.
vi.mock("../../utils/storyAssistant", () => ({
  analyzeStory: vi.fn(() => []),
}));

// Mock lodash.debounce with a controllable, cancel-aware implementation so the
// 500ms debounce and the cleanup cancel() can be exercised with fake timers.
// The hook uses a default import (`import debounce from "lodash.debounce"`),
// so the factory must expose the function under the `default` key.
vi.mock("lodash.debounce", () => {
  const implementation = (fn: (...args: any[]) => void, wait: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const debounced = ((...args: any[]) => {
      timer = setTimeout(() => fn(...args), wait);
    }) as any;
    debounced.cancel = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    return debounced;
  };
  return { default: vi.fn(implementation) };
});

import { analyzeStory } from "../../utils/storyAssistant";
import debounce from "lodash.debounce";
import { useStoryAnalysis } from "../useStoryAnalysis";

describe("useStoryAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return an empty suggestions array initially", () => {
    (analyzeStory as any).mockReturnValue([]);
    const { result } = renderHook(() => useStoryAnalysis("anything"));
    expect(result.current).toEqual([]);
  });

  it("should call analyzeStory via the debounce after the 500ms delay", () => {
    (analyzeStory as any).mockReturnValue([{ id: 1 } as any]);
    renderHook(() => useStoryAnalysis("very very suddenly"));

    // debounce wrapper is invoked synchronously, scheduling the real call
    expect(debounce).toHaveBeenCalledTimes(1);
    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 500);
    // but analyzeStory must NOT have run yet
    expect(analyzeStory).not.toHaveBeenCalled();

    // advancing near the debounce window must not fire it yet
    vi.advanceTimersByTime(499);
    expect(analyzeStory).not.toHaveBeenCalled();

    // crossing the 500ms threshold fires the debounced function
    vi.advanceTimersByTime(1);
    expect(analyzeStory).toHaveBeenCalledTimes(1);
    expect(analyzeStory).toHaveBeenCalledWith("very very suddenly");
  });

  it("should cancel pending debounced calls on cleanup", () => {
    const { unmount } = renderHook(() => useStoryAnalysis("a story"));
    // while pending, analyzeStory has not run
    expect(analyzeStory).not.toHaveBeenCalled();

    // unmount triggers the useEffect cleanup -> debounced.cancel()
    unmount();

    // after waiting well past the debounce window, the deferred call must NOT
    // fire because cleanup cancelled the pending timer.
    vi.advanceTimersByTime(1000);
    expect(analyzeStory).not.toHaveBeenCalled();
  });
});
