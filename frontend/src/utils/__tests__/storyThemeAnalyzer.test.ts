import { describe, it, expect } from "vitest";
import {
  analyzeStoryThemes,
  reanalyzeStoryThemes,
} from "../storyThemeAnalyzer";

describe("analyzeStoryThemes", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeStoryThemes("")).toEqual([]);
    expect(analyzeStoryThemes("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of themes for non-empty input", () => {
    const r = analyzeStoryThemes("A story with themes.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each theme has the required fields with correct types", () => {
    const r = analyzeStoryThemes("A story.");
    for (const t of r) {
      expect(typeof t.id).toBe("number");
      expect(typeof t.name).toBe("string");
      expect(t.name.length).toBeGreaterThan(0);
      expect(typeof t.description).toBe("string");
      expect(t.description.length).toBeGreaterThan(0);
      expect(typeof t.highlightedSection).toBe("string");
      expect(t.highlightedSection.length).toBeGreaterThan(0);
      expect(typeof t.confidence).toBe("number");
    }
  });

  it("confidence values are finite and within 0-100", () => {
    const r = analyzeStoryThemes("A story.");
    for (const t of r) {
      expect(Number.isFinite(t.confidence)).toBe(true);
      expect(t.confidence).toBeGreaterThanOrEqual(0);
      expect(t.confidence).toBeLessThanOrEqual(100);
    }
  });

  it("theme ids are unique and sequential", () => {
    const r = analyzeStoryThemes("A story.");
    const ids = r.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("theme names are unique", () => {
    const r = analyzeStoryThemes("A story.");
    const names = r.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic themed story.";
    expect(analyzeStoryThemes(story)).toEqual(analyzeStoryThemes(story));
  });
});

describe("reanalyzeStoryThemes", () => {
  it("delegates to analyzeStoryThemes", () => {
    const story = "A story to reanalyze themes for.";
    expect(reanalyzeStoryThemes(story)).toEqual(analyzeStoryThemes(story));
  });

  it("returns [] for empty input", () => {
    expect(reanalyzeStoryThemes("")).toEqual([]);
  });
});
