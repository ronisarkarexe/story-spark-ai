import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStoryAnalysis } from "../useStoryAnalysis";
import type { Suggestion } from "../../utils/storyAssistant";

const mockSuggestion: Suggestion = {
  id: 1,
  category: "Style",
  message: "Repeated intensifiers detected.",
  recommendation: "Replace repetitive words with stronger vocabulary.",
};

vi.mock("lodash.debounce", () => ({
  default: vi.fn((fn: (...args: unknown[]) => unknown) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const cancel = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    const flush = () => {
      cancel();
    };
    const debounced = (...args: unknown[]) => {
      cancel();
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, 500);
    };
    (debounced as unknown as { cancel: () => void; flush: () => void }).cancel = cancel;
    (debounced as unknown as { cancel: () => void; flush: () => void }).flush = flush;
    return debounced;
  }),
}));

vi.mock("../../utils/storyAssistant", () => ({
  analyzeStory: vi.fn(),
}));

import { analyzeStory } from "../../utils/storyAssistant";

const mockedAnalyzeStory = analyzeStory as ReturnType<typeof vi.fn>;

describe("useStoryAnalysis hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call analyzeStory before the debounce delay passes", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    renderHook(() => useStoryAnalysis("test story"));
    expect(mockedAnalyzeStory).not.toHaveBeenCalled();
  });

  it("calls analyzeStory after the debounce delay", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    renderHook(() => useStoryAnalysis("very very bad story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).toHaveBeenCalledWith("very very bad story");
  });

  it("updates suggestions after debounce fires", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    const { result } = renderHook(() => useStoryAnalysis("very very bad story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(1);
    expect(result.current[0].category).toBe("Style");
  });

  it("calls analyzeStory only once per story value", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    renderHook(() => useStoryAnalysis("story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).toHaveBeenCalledTimes(1);
  });

  it("cancels pending call when story changes before delay", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    const { rerender } = renderHook(
      ({ story }: { story: string }) => useStoryAnalysis(story),
      { initialProps: { story: "story 1" } }
    );
    act(() => {
      vi.advanceTimersByTime(300);
    });
    mockedAnalyzeStory.mockClear();
    rerender({ story: "story 2" });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).toHaveBeenCalledTimes(1);
    expect(mockedAnalyzeStory).toHaveBeenCalledWith("story 2");
  });

  it("cancels pending debounced call on cleanup (unmount)", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    const { unmount } = renderHook(() => useStoryAnalysis("story"));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).not.toHaveBeenCalled();
  });

  it("returns multiple suggestions after debounce fires", () => {
    const suggestion2: Suggestion = {
      id: 2,
      category: "Plot",
      message: "Abrupt transition detected.",
      recommendation: "Add a smoother transition.",
    };
    mockedAnalyzeStory.mockReturnValue([mockSuggestion, suggestion2]);
    const { result } = renderHook(() => useStoryAnalysis("very very bad story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toHaveLength(2);
  });
});
