import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSceneImportance } from "../useSceneImportance";
import type { SceneScore } from "../../types/scene";

const mockSceneScore: SceneScore = {
  id: 1,
  title: "Scene 1",
  importance: 85,
  reasons: ["Advances the main conflict."],
  recommendation: "Scene contributes well to the narrative.",
  needsRevision: false,
};

vi.mock("../../utils/sceneImportanceAnalyzer", () => ({
  analyzeScenes: vi.fn(),
}));

import { analyzeScenes } from "../../utils/sceneImportanceAnalyzer";

const mockedAnalyzeScenes = analyzeScenes as ReturnType<typeof vi.fn>;

describe("useSceneImportance hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty scores array initially", () => {
    mockedAnalyzeScenes.mockReturnValue([]);
    const { result } = renderHook(() => useSceneImportance("test story"));
    expect(result.current).toEqual([]);
  });

  it("calls analyzeScenes with the story prop", () => {
    mockedAnalyzeScenes.mockReturnValue([]);
    const story = "## Scene 1\nSome content.\n## Scene 2\nMore content.";
    renderHook(() => useSceneImportance(story));
    expect(mockedAnalyzeScenes).toHaveBeenCalledWith(story);
  });

  it("calls analyzeScenes only once on mount", () => {
    mockedAnalyzeScenes.mockReturnValue([]);
    renderHook(() => useSceneImportance("any story"));
    expect(mockedAnalyzeScenes).toHaveBeenCalledTimes(1);
  });

  it("returns scene scores from analyzeScenes", () => {
    mockedAnalyzeScenes.mockReturnValue([mockSceneScore]);
    const { result } = renderHook(() =>
      useSceneImportance("## Scene 1\nSome content.")
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(1);
    expect(result.current[0].importance).toBe(85);
    expect(result.current[0].needsRevision).toBe(false);
  });

  it("updates scores when story prop changes", () => {
    mockedAnalyzeScenes
      .mockReturnValueOnce([mockSceneScore])
      .mockReturnValueOnce([]);
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useSceneImportance(story),
      { initialProps: { story: "story 1" } }
    );
    expect(result.current).toHaveLength(1);
    rerender({ story: "story 2" });
    expect(result.current).toHaveLength(0);
  });

  it("handles multiple scene scores", () => {
    const scene2: SceneScore = {
      id: 2,
      title: "Scene 2",
      importance: 45,
      reasons: ["Scene contains limited narrative content."],
      recommendation: "Consider strengthening this scene.",
      needsRevision: true,
    };
    mockedAnalyzeScenes.mockReturnValue([mockSceneScore, scene2]);
    const { result } = renderHook(() =>
      useSceneImportance("## Scene 1\nContent.\n## Scene 2\nShort.")
    );
    expect(result.current).toHaveLength(2);
    expect(result.current[1].needsRevision).toBe(true);
  });
});
