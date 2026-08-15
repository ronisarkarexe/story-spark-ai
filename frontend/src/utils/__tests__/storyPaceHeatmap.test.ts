import { describe, it, expect } from "vitest";
import { analyzeStoryPace, refreshPaceAnalysis } from "../storyPaceHeatmap";

const VALID_PACES = ["Fast", "Balanced", "Slow"] as const;

describe("analyzeStoryPace", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeStoryPace("")).toEqual([]);
    expect(analyzeStoryPace("   \n  ")).toEqual([]);
  });

  it("returns one section per blank-line-separated paragraph", () => {
    const r = analyzeStoryPace("Section one.\n\nSection two.\n\nSection three.");
    expect(r.map((s) => s.id)).toEqual([1, 2, 3]);
  });

  it("each section has the required fields and a valid pace", () => {
    const r = analyzeStoryPace("a\n\nb\n\nc");
    for (const s of r) {
      expect(typeof s.id).toBe("number");
      expect(typeof s.title).toBe("string");
      expect(s.title.length).toBeGreaterThan(0);
      expect(VALID_PACES).toContain(s.pace);
      expect(typeof s.score).toBe("number");
      expect(typeof s.suggestion).toBe("string");
      expect(s.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("paces cycle through Fast/Balanced/Slow by index", () => {
    const r = analyzeStoryPace("a\n\nb\n\nc");
    expect(r[0].pace).toBe("Fast");
    expect(r[1].pace).toBe("Balanced");
    expect(r[2].pace).toBe("Slow");
  });

  it("scores match the pace (Fast=90, Balanced=65, Slow=35)", () => {
    const r = analyzeStoryPace("a\n\nb\n\nc");
    expect(r[0].score).toBe(90);
    expect(r[1].score).toBe(65);
    expect(r[2].score).toBe(35);
  });

  it("section ids are unique and sequential", () => {
    const r = analyzeStoryPace("a\n\nb\n\nc\n\nd");
    const ids = r.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it("scores are finite and within 0-100", () => {
    const r = analyzeStoryPace("a\n\nb\n\nc");
    for (const s of r) {
      expect(Number.isFinite(s.score)).toBe(true);
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it("is deterministic for the same input", () => {
    const story = "a\n\nb\n\nc";
    expect(analyzeStoryPace(story)).toEqual(analyzeStoryPace(story));
  });
});

describe("refreshPaceAnalysis", () => {
  it("delegates to analyzeStoryPace", () => {
    const story = "a\n\nb";
    expect(refreshPaceAnalysis(story)).toEqual(analyzeStoryPace(story));
  });

  it("returns [] for empty input", () => {
    expect(refreshPaceAnalysis("")).toEqual([]);
  });
});
