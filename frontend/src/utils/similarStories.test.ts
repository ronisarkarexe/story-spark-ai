// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import {
  hasSameGenre,
  countMatchingTags,
  countMatchingKeywords,
  calculateSimilarity,
  getSimilarStories,
  type Story,
} from "./similarStories";

const makeStory = (overrides: Partial<Story> = {}): Story => ({
  id: "s1",
  title: "Test Story",
  genre: "fantasy",
  tags: ["magic", "adventure"],
  keywords: ["wizard", "dragon"],
  ...overrides,
});

describe("similarStories", () => {
  describe("hasSameGenre", () => {
    it("returns true for matching genre", () => {
      const a = makeStory({ genre: "fantasy" });
      const b = makeStory({ genre: "fantasy" });
      expect(hasSameGenre(a, b)).toBe(true);
    });

    it("returns false for different genre", () => {
      const a = makeStory({ genre: "fantasy" });
      const b = makeStory({ genre: "horror" });
      expect(hasSameGenre(a, b)).toBe(false);
    });
  });

  describe("countMatchingTags", () => {
    it("returns 0 when no tags match", () => {
      const a = makeStory({ tags: ["magic"] });
      const b = makeStory({ tags: ["horror"] });
      expect(countMatchingTags(a, b)).toBe(0);
    });

    it("counts partial tag matches", () => {
      const a = makeStory({ tags: ["magic", "adventure"] });
      const b = makeStory({ tags: ["magic", "horror"] });
      expect(countMatchingTags(a, b)).toBe(1);
    });

    it("counts all tag matches", () => {
      const a = makeStory({ tags: ["magic", "adventure"] });
      const b = makeStory({ tags: ["magic", "adventure"] });
      expect(countMatchingTags(a, b)).toBe(2);
    });
  });

  describe("countMatchingKeywords", () => {
    it("returns 0 when no keywords match", () => {
      const a = makeStory({ keywords: ["wizard"] });
      const b = makeStory({ keywords: ["zombie"] });
      expect(countMatchingKeywords(a, b)).toBe(0);
    });

    it("counts matching keywords", () => {
      const a = makeStory({ keywords: ["wizard", "dragon"] });
      const b = makeStory({ keywords: ["wizard", "castle"] });
      expect(countMatchingKeywords(a, b)).toBe(1);
    });
  });

  describe("calculateSimilarity", () => {
    it("awards 5 points for same genre", () => {
      const a = makeStory({ id: "a", genre: "fantasy" });
      const b = makeStory({ id: "b", genre: "fantasy", tags: [], keywords: [] });
      expect(calculateSimilarity(a, b)).toBe(5);
    });

    it("awards 0 points for different genre with no shared tags/keywords", () => {
      const a = makeStory({ id: "a", genre: "fantasy", tags: [], keywords: [] });
      const b = makeStory({ id: "b", genre: "horror", tags: [], keywords: [] });
      expect(calculateSimilarity(a, b)).toBe(0);
    });

    it("adds tag and keyword scores", () => {
      const a = makeStory({ id: "a", genre: "fantasy", tags: ["magic"], keywords: ["wizard"] });
      const b = makeStory({ id: "b", genre: "fantasy", tags: ["magic"], keywords: ["wizard"] });
      // genre: 5 + 1 tag * 2 = 2 + 1 keyword * 1 = 1
      expect(calculateSimilarity(a, b)).toBe(8);
    });
  });

  describe("getSimilarStories", () => {
    it("filters out the current story by id", () => {
      const current = makeStory({ id: "current" });
      const stories = [current, makeStory({ id: "s2" })];
      const result = getSimilarStories(current, stories);
      expect(result.some(s => s.id === "current")).toBe(false);
    });

    it("sorts by similarity descending", () => {
      const current = makeStory({ id: "current", genre: "fantasy", tags: ["magic"], keywords: ["wizard"] });
      const exact = makeStory({ id: "exact", genre: "fantasy", tags: ["magic"], keywords: ["wizard"] });
      const different = makeStory({ id: "diff", genre: "horror", tags: [], keywords: [] });
      const stories = [different, exact, current];
      const result = getSimilarStories(current, stories);
      expect(result[0].id).toBe("exact");
    });

    it("respects the limit parameter", () => {
      const current = makeStory({ id: "current" });
      const stories = Array.from({ length: 6 }, (_, i) =>
        makeStory({ id: `s${i}`, genre: "fantasy" })
      );
      const result = getSimilarStories(current, stories, 3);
      expect(result).toHaveLength(3);
    });

    it("returns empty array when only current story exists", () => {
      const current = makeStory({ id: "current" });
      expect(getSimilarStories(current, [current])).toEqual([]);
    });

    it("adds similarity score to each result", () => {
      const current = makeStory({ id: "current", genre: "fantasy", tags: [], keywords: [] });
      const other = makeStory({ id: "other", genre: "fantasy", tags: [], keywords: [] });
      const result = getSimilarStories(current, [current, other]);
      expect(result[0].similarity).toBe(5);
    });
  });
});
