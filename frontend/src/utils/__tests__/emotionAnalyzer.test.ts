import { describe, it, expect } from "vitest";
import { analyzeEmotionJourney } from "../emotionAnalyzer";

describe("analyzeEmotionJourney", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeEmotionJourney("")).toEqual([]);
  });

  it("splits the story into scenes by double newline", () => {
    const result = analyzeEmotionJourney("First scene.\n\nSecond scene.");
    expect(result).toHaveLength(2);
  });

  it("assigns sequential scene numbers", () => {
    const result = analyzeEmotionJourney("One.\n\nTwo.\n\nThree.");
    expect(result.map((p) => p.scene)).toEqual([1, 2, 3]);
  });

  it("counts joy keywords per scene", () => {
    const result = analyzeEmotionJourney("She smiled and laughed with joy.");
    expect(result[0].joy).toBeGreaterThan(0);
  });

  it("counts fear keywords per scene", () => {
    const result = analyzeEmotionJourney("A monster appeared in the dark.");
    expect(result[0].fear).toBeGreaterThan(0);
  });

  it("returns zero for emotions not present", () => {
    const result = analyzeEmotionJourney("Plain neutral text.");
    expect(result[0].anger).toBe(0);
    expect(result[0].hope).toBe(0);
  });

  it("returns all expected emotion fields", () => {
    const result = analyzeEmotionJourney("A short scene.");
    const point = result[0];
    expect(point).toHaveProperty("joy");
    expect(point).toHaveProperty("fear");
    expect(point).toHaveProperty("sadness");
    expect(point).toHaveProperty("anger");
    expect(point).toHaveProperty("hope");
    expect(point).toHaveProperty("suspense");
  });
});
