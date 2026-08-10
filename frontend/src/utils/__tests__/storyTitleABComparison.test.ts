import { describe, it, expect } from "vitest";
import {
  generateStoryTitleOptions,
  regenerateStoryTitles,
} from "../storyTitleABComparison";

describe("generateStoryTitleOptions", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(generateStoryTitleOptions("")).toEqual([]);
    expect(generateStoryTitleOptions("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of title options for non-empty input", () => {
    const r = generateStoryTitleOptions("A story about adventure.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each option has the required fields with correct types", () => {
    const r = generateStoryTitleOptions("A story.");
    for (const o of r) {
      expect(typeof o.id).toBe("number");
      expect(typeof o.title).toBe("string");
      expect(o.title.length).toBeGreaterThan(0);
      for (const s of [o.creativity, o.relevance, o.memorability, o.emotionalAppeal]) {
        expect(typeof s).toBe("number");
      }
      expect(typeof o.feedback).toBe("string");
      expect(o.feedback.length).toBeGreaterThan(0);
    }
  });

  it("all scores are finite and within 0-100", () => {
    const r = generateStoryTitleOptions("A story.");
    for (const o of r) {
      for (const s of [o.creativity, o.relevance, o.memorability, o.emotionalAppeal]) {
        expect(Number.isFinite(s)).toBe(true);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(100);
      }
    }
  });

  it("option ids are unique and sequential", () => {
    const r = generateStoryTitleOptions("A story.");
    const ids = r.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("titles are unique", () => {
    const r = generateStoryTitleOptions("A story.");
    const titles = r.map((o) => o.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story.";
    expect(generateStoryTitleOptions(story)).toEqual(
      generateStoryTitleOptions(story)
    );
  });
});

describe("regenerateStoryTitles", () => {
  it("delegates to generateStoryTitleOptions", () => {
    const story = "A story to regenerate titles for.";
    expect(regenerateStoryTitles(story)).toEqual(generateStoryTitleOptions(story));
  });

  it("returns [] for empty input", () => {
    expect(regenerateStoryTitles("")).toEqual([]);
  });
});
