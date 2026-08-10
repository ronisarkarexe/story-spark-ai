import { describe, it, expect } from "vitest";
import { analyzeEmotionJourney } from "../emotionAnalyzer";

describe("analyzeEmotionJourney", () => {
  it("returns an empty array for an empty story", () => {
    expect(analyzeEmotionJourney("")).toEqual([]);
  });

  it("returns an empty array for a whitespace-only story", () => {
    expect(analyzeEmotionJourney("   \n\n   \n   ")).toEqual([]);
  });

  it("splits a single-scene story into one emotion point", () => {
    const r = analyzeEmotionJourney("A happy scene with hope.");
    expect(r).toHaveLength(1);
    expect(r[0].scene).toBe(1);
  });

  it("splits by blank lines into sequential scenes", () => {
    const r = analyzeEmotionJourney("Scene one.\n\nScene two.\n\nScene three.");
    expect(r.map((p) => p.scene)).toEqual([1, 2, 3]);
  });

  it("counts joy-related keywords case-insensitively", () => {
    const r = analyzeEmotionJourney("They were HAPPY and laughed and smiled.");
    expect(r[0].joy).toBeGreaterThanOrEqual(2);
  });

  it("counts each emotion category independently", () => {
    const r = analyzeEmotionJourney("She was happy but felt fear in the dark.");
    expect(r[0].joy).toBeGreaterThanOrEqual(1);
    expect(r[0].fear).toBeGreaterThanOrEqual(2);
  });

  it("returns 0 for categories with no matching keywords", () => {
    const r = analyzeEmotionJourney("A perfectly calm and ordinary scene.");
    for (const key of ["joy", "fear", "sadness", "anger", "hope", "suspense"] as const) {
      expect(r[0][key]).toBe(0);
    }
  });

  it("all emotion values are non-negative finite integers", () => {
    const r = analyzeEmotionJourney("A scene with joy and fear and anger.");
    for (const p of r) {
      for (const key of ["joy", "fear", "sadness", "anger", "hope", "suspense"] as const) {
        expect(Number.isInteger(p[key])).toBe(true);
        expect(p[key]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("ignores blank/whitespace-only scenes", () => {
    const r = analyzeEmotionJourney("real scene\n\n   \n\nanother scene");
    expect(r).toHaveLength(2);
  });

  it("is deterministic for the same input", () => {
    const story = "A happy scene.\n\nA sad scene with fear.";
    expect(analyzeEmotionJourney(story)).toEqual(analyzeEmotionJourney(story));
  });
});
