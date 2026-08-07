import { describe, it, expect } from "vitest";
import {
  generateStoryTitleOptions,
  regenerateStoryTitles,
} from "../storyTitleABComparison";

describe("generateStoryTitleOptions", () => {
  it("returns an empty array for empty text", () => {
    expect(generateStoryTitleOptions("")).toEqual([]);
    expect(generateStoryTitleOptions("   ")).toEqual([]);
  });

  it("returns title options for a non-empty story", () => {
    const result = generateStoryTitleOptions("A hero travels across the land.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns options with the expected shape", () => {
    const result = generateStoryTitleOptions("A tale of adventure.");
    const option = result[0];
    expect(option).toHaveProperty("id");
    expect(option).toHaveProperty("title");
    expect(option).toHaveProperty("creativity");
    expect(option).toHaveProperty("relevance");
    expect(option).toHaveProperty("memorability");
    expect(option).toHaveProperty("emotionalAppeal");
    expect(option).toHaveProperty("feedback");
  });

  it("keeps score fields within 0-100", () => {
    const result = generateStoryTitleOptions("A tale of mystery.");
    for (const option of result) {
      expect(option.creativity).toBeGreaterThanOrEqual(0);
      expect(option.creativity).toBeLessThanOrEqual(100);
      expect(option.relevance).toBeGreaterThanOrEqual(0);
      expect(option.relevance).toBeLessThanOrEqual(100);
    }
  });

  it("assigns sequential ids", () => {
    const result = generateStoryTitleOptions("A tale of romance.");
    result.forEach((option, index) => {
      expect(option.id).toBe(index + 1);
    });
  });

  it("regenerateStoryTitles returns the same result", () => {
    const story = "A tale of suspense.";
    expect(regenerateStoryTitles(story)).toEqual(generateStoryTitleOptions(story));
  });
});
