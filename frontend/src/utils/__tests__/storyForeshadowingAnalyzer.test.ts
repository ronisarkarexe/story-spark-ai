import { describe, it, expect } from "vitest";
import {
  analyzeStoryForeshadowing,
  refreshForeshadowingAnalysis,
} from "../storyForeshadowingAnalyzer";

const VALID_STATUSES = ["Strong", "Weak", "Unresolved"] as const;

describe("analyzeStoryForeshadowing", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeStoryForeshadowing("")).toEqual([]);
    expect(analyzeStoryForeshadowing("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of items for non-empty input", () => {
    const r = analyzeStoryForeshadowing("A story with foreshadowing.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each item has the required fields with a valid status", () => {
    const r = analyzeStoryForeshadowing("A story.");
    for (const f of r) {
      expect(typeof f.id).toBe("number");
      expect(typeof f.hint).toBe("string");
      expect(f.hint.length).toBeGreaterThan(0);
      expect(typeof f.relatedEvent).toBe("string");
      expect(f.relatedEvent.length).toBeGreaterThan(0);
      expect(VALID_STATUSES).toContain(f.status);
      expect(typeof f.suggestion).toBe("string");
      expect(f.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("item ids are unique and sequential", () => {
    const r = analyzeStoryForeshadowing("A story.");
    const ids = r.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("includes at least one Unresolved item (for the 'strange necklace')", () => {
    const r = analyzeStoryForeshadowing("A story.");
    expect(r.some((f) => f.status === "Unresolved")).toBe(true);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story.";
    expect(analyzeStoryForeshadowing(story)).toEqual(analyzeStoryForeshadowing(story));
  });
});

describe("refreshForeshadowingAnalysis", () => {
  it("delegates to analyzeStoryForeshadowing", () => {
    const story = "A story to refresh.";
    expect(refreshForeshadowingAnalysis(story)).toEqual(analyzeStoryForeshadowing(story));
  });

  it("returns [] for empty input", () => {
    expect(refreshForeshadowingAnalysis("")).toEqual([]);
  });
});
