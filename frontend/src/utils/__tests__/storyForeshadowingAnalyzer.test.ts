import { describe, it, expect } from "vitest";
import {
  analyzeStoryForeshadowing,
  refreshForeshadowingAnalysis,
} from "../storyForeshadowingAnalyzer";

describe("analyzeStoryForeshadowing", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeStoryForeshadowing("")).toEqual([]);
    expect(analyzeStoryForeshadowing("   ")).toEqual([]);
  });

  it("returns foreshadowing items for a non-empty story", () => {
    const result = analyzeStoryForeshadowing("The old key appeared early in the story.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns items with the expected shape", () => {
    const result = analyzeStoryForeshadowing("A dark cloud gathered above the village.");
    const item = result[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("hint");
    expect(item).toHaveProperty("relatedEvent");
    expect(item).toHaveProperty("suggestion");
  });

  it("classifies status as Strong, Weak, or Unresolved", () => {
    const result = analyzeStoryForeshadowing("The necklace glinted in the moonlight.");
    const valid = ["Strong", "Weak", "Unresolved"];
    for (const item of result) {
      expect(valid).toContain(item.status);
    }
  });

  it("assigns sequential ids", () => {
    const result = analyzeStoryForeshadowing("The storm brewed over the horizon.");
    result.forEach((item, index) => {
      expect(item.id).toBe(index + 1);
    });
  });

  it("refreshForeshadowingAnalysis returns the same result", () => {
    const story = "The strange necklace was introduced early.";
    expect(refreshForeshadowingAnalysis(story)).toEqual(analyzeStoryForeshadowing(story));
  });
});
