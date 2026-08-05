import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNarrativeFlow } from "../useNarrativeFlow";
import type { NarrativeIssue } from "../../types/narrative";

const mockIssue: NarrativeIssue = {
  id: 1,
  type: "Abrupt Transition",
  severity: "High",
  scene: "Scene Transition",
  explanation: "The transition appears too sudden.",
  suggestion: "Add connecting details explaining the change.",
};

vi.mock("../../utils/narrativeFlowAnalyzer", () => ({
  analyzeNarrativeFlow: vi.fn(),
}));

import { analyzeNarrativeFlow } from "../../utils/narrativeFlowAnalyzer";

const mockedAnalyzeNarrativeFlow = analyzeNarrativeFlow as ReturnType<typeof vi.fn>;

describe("useNarrativeFlow hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty issues array initially", () => {
    mockedAnalyzeNarrativeFlow.mockReturnValue([]);
    const { result } = renderHook(() => useNarrativeFlow("test story"));
    expect(result.current.issues).toEqual([]);
  });

  it("calls analyzeNarrativeFlow with the story prop", () => {
    mockedAnalyzeNarrativeFlow.mockReturnValue([]);
    const story = "The hero walked in. Suddenly, the dragon appeared.";
    renderHook(() => useNarrativeFlow(story));
    expect(mockedAnalyzeNarrativeFlow).toHaveBeenCalledWith(story);
  });

  it("calls analyzeNarrativeFlow only once on mount", () => {
    mockedAnalyzeNarrativeFlow.mockReturnValue([]);
    renderHook(() => useNarrativeFlow("any story"));
    expect(mockedAnalyzeNarrativeFlow).toHaveBeenCalledTimes(1);
  });

  it("returns issues from analyzeNarrativeFlow", () => {
    mockedAnalyzeNarrativeFlow.mockReturnValue([mockIssue]);
    const { result } = renderHook(() => useNarrativeFlow("Suddenly, the dragon appeared."));
    expect(result.current.issues).toHaveLength(1);
    expect(result.current.issues[0].id).toBe(1);
    expect(result.current.issues[0].type).toBe("Abrupt Transition");
    expect(result.current.issues[0].severity).toBe("High");
  });

  it("updates issues when story prop changes", () => {
    mockedAnalyzeNarrativeFlow
      .mockReturnValueOnce([mockIssue])
      .mockReturnValueOnce([]);
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useNarrativeFlow(story),
      { initialProps: { story: "story 1" } }
    );
    expect(result.current.issues).toHaveLength(1);
    rerender({ story: "story 2" });
    expect(result.current.issues).toHaveLength(0);
  });

  it("allows setIssues to directly update issues state", () => {
    mockedAnalyzeNarrativeFlow.mockReturnValue([]);
    const newIssue: NarrativeIssue = {
      id: 2,
      type: "Repetition",
      severity: "Medium",
      scene: "Multiple Scenes",
      explanation: "Repeated transition wording affects flow.",
      suggestion: "Use more varied narrative transitions.",
    };
    const { result } = renderHook(() => useNarrativeFlow("story"));
    act(() => {
      result.current.setIssues([newIssue]);
    });
    expect(result.current.issues).toHaveLength(1);
    expect(result.current.issues[0].id).toBe(2);
  });

  it("handles multiple narrative issues", () => {
    const issue2: NarrativeIssue = {
      id: 2,
      type: "Repetition",
      severity: "Medium",
      scene: "Multiple Scenes",
      explanation: "Repeated transition wording affects flow.",
      suggestion: "Use more varied narrative transitions.",
    };
    mockedAnalyzeNarrativeFlow.mockReturnValue([mockIssue, issue2]);
    const { result } = renderHook(() =>
      useNarrativeFlow("Suddenly the hero appeared. Suddenly the villain appeared.")
    );
    expect(result.current.issues).toHaveLength(2);
  });
});
