import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSceneImportance } from "../useSceneImportance";

describe("useSceneImportance", () => {
  it("returns an array", () => {
    const { result } = renderHook(() => useSceneImportance("Some story"));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("returns empty array for empty story", () => {
    const { result } = renderHook(() => useSceneImportance(""));
    expect(result.current).toEqual([]);
  });

  it("returns scene scores with correct shape", () => {
    const story = "## Scene One\nSome content here.";
    const { result } = renderHook(() => useSceneImportance(story));

    result.current.forEach((score) => {
      expect(score).toHaveProperty("id");
      expect(score).toHaveProperty("title");
      expect(score).toHaveProperty("importance");
      expect(score).toHaveProperty("reasons");
      expect(score).toHaveProperty("recommendation");
      expect(score).toHaveProperty("needsRevision");
      expect(typeof score.id).toBe("number");
      expect(typeof score.importance).toBe("number");
      expect(Array.isArray(score.reasons)).toBe(true);
      expect(typeof score.recommendation).toBe("string");
      expect(typeof score.needsRevision).toBe("boolean");
    });
  });

  it("assigns sequential ids to scenes", () => {
    const story = "## First\n## Second\n## Third";
    const { result } = renderHook(() => useSceneImportance(story));

    expect(result.current[0].id).toBe(1);
    expect(result.current[1].id).toBe(2);
    expect(result.current[2].id).toBe(3);
  });

  it("assigns correct title to each scene", () => {
    const story = "## First Scene\nContent.\n## Second Scene\nMore content.";
    const { result } = renderHook(() => useSceneImportance(story));

    expect(result.current[0].title).toBe("Scene 1");
    expect(result.current[1].title).toBe("Scene 2");
  });

  it("increases importance score for battle keyword", () => {
    const story = "## Battle\nA fierce battle broke out across the kingdom.";
    const { result } = renderHook(() => useSceneImportance(story));

    const scene = result.current[0];
    expect(scene.importance).toBeGreaterThanOrEqual(70);
  });

  it("increases importance score for character keyword", () => {
    const story = "## Character Scene\nThe character growth was remarkable.";
    const { result } = renderHook(() => useSceneImportance(story));

    const scene = result.current[0];
    expect(scene.importance).toBeGreaterThanOrEqual(65);
  });

  it("decreases importance score for short scenes", () => {
    const story = "## Short\nToo short.";
    const { result } = renderHook(() => useSceneImportance(story));

    const scene = result.current[0];
    expect(scene.importance).toBeLessThan(50);
  });

  it("marks low-importance scenes as needing revision", () => {
    const { result } = renderHook(() => useSceneImportance("## Bad\nA."));
    const scene = result.current[0];
    expect(scene.needsRevision).toBe(true);
  });

  it("does not mark high-importance scenes as needing revision", () => {
    const story =
      "## Epic\nA fierce battle erupted across the kingdom as the character prepared for the final showdown against the enemy forces.";
    const { result } = renderHook(() => useSceneImportance(story));

    const scene = result.current[0];
    expect(scene.needsRevision).toBe(false);
  });

  it("updates scores when story prop changes", () => {
    const { result, rerender } = renderHook(
      ({ story }) => useSceneImportance(story),
      { initialProps: { story: "## Short\nA." } }
    );

    const firstScore = result.current[0].importance;

    rerender({ story: "## Battle\nA fierce battle broke out across the kingdom as characters fought." });
    const secondScore = result.current[0].importance;

    expect(secondScore).not.toBe(firstScore);
  });

  it("importance score is clamped between 0 and 100", () => {
    const story = "## Combined\nA battle character kingdom " + "word ".repeat(50);
    const { result } = renderHook(() => useSceneImportance(story));

    result.current.forEach((scene) => {
      expect(scene.importance).toBeGreaterThanOrEqual(0);
      expect(scene.importance).toBeLessThanOrEqual(100);
    });
  });
});
