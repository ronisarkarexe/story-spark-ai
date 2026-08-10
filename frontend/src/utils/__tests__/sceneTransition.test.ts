import { describe, it, expect } from "vitest";
import { analyzeSceneTransitions } from "../sceneTransition";

describe("analyzeSceneTransitions", () => {
  it("returns an empty array for an empty story", () => {
    expect(analyzeSceneTransitions("")).toEqual([]);
  });

  it("returns an empty array for a whitespace-only story", () => {
    expect(analyzeSceneTransitions("   \n\n   \n   ")).toEqual([]);
  });

  it("returns one entry per scene with sequential scene numbers", () => {
    const r = analyzeSceneTransitions("Scene one.\n\nScene two.\n\nScene three.");
    expect(r.map((t) => t.scene)).toEqual([1, 2, 3]);
  });

  it("status is one of the valid values", () => {
    const r = analyzeSceneTransitions("A scene.");
    for (const t of r) {
      expect(["Good", "Abrupt"]).toContain(t.status);
    }
  });

  it("flags short scenes as Abrupt", () => {
    const r = analyzeSceneTransitions("tiny");
    expect(r[0].status).toBe("Abrupt");
  });

  it("flags 'Suddenly' as Abrupt", () => {
    const long = "Suddenly, " + "x ".repeat(100).trim();
    const r = analyzeSceneTransitions(long);
    expect(r[0].status).toBe("Abrupt");
  });

  it("flags 'Immediately' as Abrupt", () => {
    const long = "Immediately, " + "x ".repeat(100).trim();
    const r = analyzeSceneTransitions(long);
    expect(r[0].status).toBe("Abrupt");
  });

  it("marks a long, smooth scene as Good", () => {
    const good = "word ".repeat(80).trim();
    const r = analyzeSceneTransitions(good);
    expect(r[0].status).toBe("Good");
  });

  it("suggestion is a non-empty string for each scene", () => {
    const r = analyzeSceneTransitions("tiny\n\n" + "word ".repeat(80).trim());
    for (const t of r) {
      expect(typeof t.suggestion).toBe("string");
      expect(t.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same input", () => {
    const story = "Scene one.\n\nScene two.";
    expect(analyzeSceneTransitions(story)).toEqual(analyzeSceneTransitions(story));
  });
});
