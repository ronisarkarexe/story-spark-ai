import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useSceneTransition from "../useSceneTransition";

describe("useSceneTransition", () => {
  it("returns an array", () => {
    const { result } = renderHook(() => useSceneTransition("Some story text"));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("returns empty array for empty story", () => {
    const { result } = renderHook(() => useSceneTransition(""));
    expect(result.current).toEqual([]);
  });

  it("returns scene transitions with correct shape", () => {
    const story = "Scene one.\n\nScene two.\n\nScene three.";
    const { result } = renderHook(() => useSceneTransition(story));

    result.current.forEach((transition) => {
      expect(transition).toHaveProperty("scene");
      expect(transition).toHaveProperty("status");
      expect(transition).toHaveProperty("suggestion");
      expect(typeof transition.scene).toBe("number");
      expect(["Good", "Abrupt"]).toContain(transition.status);
      expect(typeof transition.suggestion).toBe("string");
    });
  });

  it("assigns scene numbers sequentially starting from 1", () => {
    const story = "First scene.\n\nSecond scene.\n\nThird scene.";
    const { result } = renderHook(() => useSceneTransition(story));

    expect(result.current[0].scene).toBe(1);
    expect(result.current[1].scene).toBe(2);
    expect(result.current[2].scene).toBe(3);
  });

  it("marks scenes with short content or sudden words as Abrupt", () => {
    const story = "Short\n\nSuddenly it changed\n\nAnother short";
    const { result } = renderHook(() => useSceneTransition(story));

    const abruptScenes = result.current.filter((t) => t.status === "Abrupt");
    expect(abruptScenes.length).toBeGreaterThan(0);
  });

  it("marks well-developed scenes as Good", () => {
    const story =
      "This is a very detailed scene that describes the character's journey through the forest, capturing the atmosphere and the emotional weight of the moment. The sun was setting behind the mountains, casting long shadows across the valley as the characters made their way home.";
    const { result } = renderHook(() => useSceneTransition(story));

    const goodScenes = result.current.filter((t) => t.status === "Good");
    expect(goodScenes.length).toBeGreaterThan(0);
  });

  it("provides appropriate suggestions for Abrupt scenes", () => {
    const story = "ABR";
    const { result } = renderHook(() => useSceneTransition(story));

    result.current.forEach((transition) => {
      if (transition.status === "Abrupt") {
        expect(transition.suggestion).toContain("transition");
      }
    });
  });

  it("is memoized and returns same reference on same story", () => {
    const { result, rerender } = renderHook(
      ({ story }) => useSceneTransition(story),
      { initialProps: { story: "A long story scene that is over 120 characters long." } }
    );

    const firstResult = result.current;

    rerender({ story: "A long story scene that is over 120 characters long." });
    expect(result.current).toBe(firstResult);
  });

  it("updates when story prop changes", () => {
    const { result, rerender } = renderHook(
      ({ story }) => useSceneTransition(story),
      { initialProps: { story: "Short." } }
    );

    const firstResult = result.current;

    rerender({ story: "A completely different scene with much more content to analyze." });
    expect(result.current).not.toBe(firstResult);
  });
});
