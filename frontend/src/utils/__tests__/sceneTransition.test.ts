import { describe, it, expect } from "vitest";
import { analyzeSceneTransitions } from "../sceneTransition";

describe("analyzeSceneTransitions", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeSceneTransitions("")).toEqual([]);
    expect(analyzeSceneTransitions("   ")).toEqual([]);
  });

  it("splits scenes by double newline", () => {
    const result = analyzeSceneTransitions("Scene one.\n\nScene two.\n\nScene three.");
    expect(result).toHaveLength(3);
  });

  it("assigns sequential scene numbers", () => {
    const result = analyzeSceneTransitions("First.\n\nSecond.");
    expect(result[0].scene).toBe(1);
    expect(result[1].scene).toBe(2);
  });

  it("flags scenes containing 'Suddenly' as abrupt", () => {
    const result = analyzeSceneTransitions("First scene.\n\nSuddenly the hero appeared.");
    expect(result[1].status).toBe("Abrupt");
  });

  it("flags short scenes as abrupt", () => {
    const result = analyzeSceneTransitions("A long enough first scene that flows nicely.\n\nHi.");
    expect(result[1].status).toBe("Abrupt");
  });

  it("marks longer scenes without transition keywords as good", () => {
    const result = analyzeSceneTransitions("This is a comfortably long scene with more than enough text spread across the sentences to avoid the abrupt classification entirely.");
    expect(result[0].status).toBe("Good");
  });

  it("provides a suggestion for each scene", () => {
    const result = analyzeSceneTransitions("A normal length scene.\n\nSuddenly everything changed.");
    for (const scene of result) {
      expect(scene.suggestion.length).toBeGreaterThan(0);
    }
  });
});
