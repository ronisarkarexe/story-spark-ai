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

  it("returns an empty suggestions array initially before debounce fires", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    const { result } = renderHook(() => useStoryAnalysis("test story"));
    // Before debounce fires, suggestions should be empty
    expect(result.current).toEqual([]);
  });

  it("calls analyzeStory after the debounce delay", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    renderHook(() => useStoryAnalysis("very very bad story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).toHaveBeenCalledWith("very very bad story");
  });

  it("calls analyzeStory only once when debounce delay passes", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    renderHook(() => useStoryAnalysis("story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(mockedAnalyzeStory).toHaveBeenCalledTimes(1);
  });

  it("returns suggestions from analyzeStory after debounce fires", () => {
    mockedAnalyzeStory.mockReturnValue([mockSuggestion]);
    const { result } = renderHook(() => useStoryAnalysis("very very bad story"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(1);
    expect(result.current[0].category).toBe("Style");
  });

  it("cancels pending debounced call when story changes before delay", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    const { rerender } = renderHook(
      ({ story }: { story: string }) => useStoryAnalysis(story),
      { initialProps: { story: "story 1" } }
    );
    // Advance time partially (300ms out of 500ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Change the story before debounce fires
    mockedAnalyzeStory.mockClear();
    rerender({ story: "story 2" });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // Should only call with the latest story
    expect(mockedAnalyzeStory).toHaveBeenCalledTimes(1);
    expect(mockedAnalyzeStory).toHaveBeenCalledWith("story 2");
  });

  it("cancels pending debounced call on cleanup (unmount)", () => {
    mockedAnalyzeStory.mockReturnValue([]);
    const { unmount } = renderHook(() => useStoryAnalysis("story"));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Unmount before debounce fires
    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // analyzeStory should not have been called at all
    expect(mockedAnalyzeStory).not.toHaveBeenCalled();
  });

  it("returns multiple suggestions from analyzeStory", () => {
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
