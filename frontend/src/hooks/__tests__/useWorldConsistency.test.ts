import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWorldConsistency } from "../useWorldConsistency";
import type { WorldRule } from "../../types/world";

const mockRule: WorldRule = {
  id: 1,
  category: "Location",
  title: "Kingdom Naming Conflict",
  description: "The same location appears with different names.",
  status: "Conflict",
  suggestion: "Use one consistent name throughout the story.",
};

vi.mock("../../utils/worldConsistencyAnalyzer", () => ({
  analyzeWorldConsistency: vi.fn(),
}));

import { analyzeWorldConsistency } from "../../utils/worldConsistencyAnalyzer";

const mockedAnalyzeWorldConsistency = analyzeWorldConsistency as ReturnType<typeof vi.fn>;

describe("useWorldConsistency hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty rules array initially", () => {
    mockedAnalyzeWorldConsistency.mockReturnValue([]);
    const { result } = renderHook(() => useWorldConsistency("test story"));
    expect(result.current.rules).toEqual([]);
  });

  it("calls analyzeWorldConsistency with the story prop", () => {
    mockedAnalyzeWorldConsistency.mockReturnValue([]);
    const story = "The Dragon Kingdom is at war with the Dragon Empire.";
    renderHook(() => useWorldConsistency(story));
    expect(mockedAnalyzeWorldConsistency).toHaveBeenCalledWith(story);
  });

  it("calls analyzeWorldConsistency only once on mount", () => {
    mockedAnalyzeWorldConsistency.mockReturnValue([]);
    renderHook(() => useWorldConsistency("any story"));
    expect(mockedAnalyzeWorldConsistency).toHaveBeenCalledTimes(1);
  });

  it("returns rules from analyzeWorldConsistency", () => {
    mockedAnalyzeWorldConsistency.mockReturnValue([mockRule]);
    const { result } = renderHook(() => useWorldConsistency("Dragon Kingdom vs Empire"));
    expect(result.current.rules).toHaveLength(1);
    expect(result.current.rules[0].id).toBe(1);
    expect(result.current.rules[0].title).toBe("Kingdom Naming Conflict");
  });

  it("updates rules when story prop changes", () => {
    mockedAnalyzeWorldConsistency
      .mockReturnValueOnce([mockRule])
      .mockReturnValueOnce([]);
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useWorldConsistency(story),
      { initialProps: { story: "story 1" } }
    );
    expect(result.current.rules).toHaveLength(1);
    rerender({ story: "story 2" });
    expect(result.current.rules).toHaveLength(0);
  });

  it("allows setRules to directly update rules state", () => {
    mockedAnalyzeWorldConsistency.mockReturnValue([]);
    const newRule: WorldRule = {
      id: 2,
      category: "Magic",
      title: "Magic System Conflict",
      description: "Magic rules contradict each other.",
      status: "Conflict",
      suggestion: "Standardize the magic system.",
    };
    const { result } = renderHook(() => useWorldConsistency("story"));
    act(() => {
      result.current.setRules([newRule]);
    });
    expect(result.current.rules).toHaveLength(1);
    expect(result.current.rules[0].id).toBe(2);
  });
});
