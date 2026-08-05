import { describe, it, expect } from "vitest";
import {
  hasSameGenre,
  countMatchingTags,
  countMatchingKeywords,
  calculateSimilarity,
  getSimilarStories,
  Story,
} from "../similarStories";

const makeStory = (overrides: Partial<Story> = {}): Story => ({
  id: "1",
  title: "Test Story",
  genre: "fantasy",
  tags: [],
  keywords: [],
  ...overrides,
});

describe("similarStories", () => {
  describe("hasSameGenre", () => {
    it("returns true when genres match", () => {
      const a = makeStory({ genre: "fantasy" });
      const b = makeStory({ genre: "fantasy" });
      expect(hasSameGenre(a, b)).toBe(true);
    });

    it("returns false when genres differ", () => {
      const a = makeStory({ genre: "fantasy" });
      const b = makeStory({ genre: "sci-fi" });
      expect(hasSameGenre(a, b)).toBe(false);
    });
  });

  describe("countMatchingTags", () => {
    it("returns 0 when neither story has tags", () => {
      const a = makeStory({ tags: [] });
      const b = makeStory({ tags: [] });
      expect(countMatchingTags(a, b)).toBe(0);
    });

    it("returns 0 when there are no matching tags", () => {
      const a = makeStory({ tags: ["magic", "dragons"] });
      const b = makeStory({ tags: ["robots", "space"] });
      expect(countMatchingTags(a, b)).toBe(0);
    });

    it("returns correct count for partial tag matches", () => {
      const a = makeStory({ tags: ["magic", "dragons", "warriors"] });
      const b = makeStory({ tags: ["magic", "space", "dragons"] });
      expect(countMatchingTags(a, b)).toBe(2);
    });

    it("returns full tag count when all tags match", () => {
      const a = makeStory({ tags: ["magic", "dragons"] });
      const b = makeStory({ tags: ["magic", "dragons"] });
      expect(countMatchingTags(a, b)).toBe(2);
    });
  });

  describe("countMatchingKeywords", () => {
    it("returns 0 when neither story has keywords", () => {
      const a = makeStory({ keywords: [] });
      const b = makeStory({ keywords: [] });
      expect(countMatchingKeywords(a, b)).toBe(0);
    });

    it("returns 0 when there are no matching keywords", () => {
      const a = makeStory({ keywords: ["quest", "castle"] });
      const b = makeStory({ keywords: ["robot", "future"] });
      expect(countMatchingKeywords(a, b)).toBe(0);
    });

    it("returns correct count for partial keyword matches", () => {
      const a = makeStory({ keywords: ["quest", "castle", "hero"] });
      const b = makeStory({ keywords: ["quest", "robot", "hero"] });
      expect(countMatchingKeywords(a, b)).toBe(2);
    });
  });

  describe("calculateSimilarity", () => {
    it("adds 5 points for genre match", () => {
      const a = makeStory({ genre: "fantasy", tags: [], keywords: [] });
      const b = makeStory({ genre: "fantasy", tags: [], keywords: [] });
      expect(calculateSimilarity(a, b)).toBe(5);
    });

    it("adds 2 points per matching tag", () => {
      const a = makeStory({ genre: "fantasy", tags: ["magic", "dragons"], keywords: [] });
      const b = makeStory({ genre: "sci-fi", tags: ["magic", "dragons"], keywords: [] });
      expect(calculateSimilarity(a, b)).toBe(4);
    });

    it("adds 1 point per matching keyword", () => {
      const a = makeStory({ genre: "sci-fi", tags: [], keywords: ["space", "future"] });
      const b = makeStory({ genre: "fantasy", tags: [], keywords: ["space", "future"] });
      expect(calculateSimilarity(a, b)).toBe(2);
    });

    it("combines genre, tags, and keywords score correctly", () => {
      const a = makeStory({ genre: "fantasy", tags: ["magic"], keywords: ["quest"] });
      const b = makeStory({ genre: "fantasy", tags: ["magic"], keywords: ["quest"] });
      expect(calculateSimilarity(a, b)).toBe(8); // 5 + 2 + 1
    });

    it("returns 0 when nothing matches", () => {
      const a = makeStory({ genre: "fantasy", tags: ["magic"], keywords: ["quest"] });
      const b = makeStory({ genre: "sci-fi", tags: ["robots"], keywords: ["future"] });
      expect(calculateSimilarity(a, b)).toBe(0);
    });
  });

  describe("getSimilarStories", () => {
    const current = makeStory({ id: "current", genre: "fantasy", tags: ["magic"], keywords: ["quest"] });

    it("excludes the current story by id", () => {
      const stories = [
        current,
        makeStory({ id: "other1", genre: "fantasy", tags: [], keywords: [] }),
      ];
      const result = getSimilarStories(current, stories, 4);
      expect(result.find((s) => s.id === "current")).toBeUndefined();
    });

    it("sorts stories by similarity descending", () => {
      const stories = [
        makeStory({ id: "no-match", genre: "sci-fi", tags: [], keywords: [] }),
        makeStory({ id: "genre-match", genre: "fantasy", tags: [], keywords: [] }),
        makeStory({ id: "full-match", genre: "fantasy", tags: ["magic"], keywords: ["quest"] }),
      ];
      const result = getSimilarStories(current, stories, 4);
      expect(result[0].id).toBe("full-match");
      expect(result[1].id).toBe("genre-match");
      expect(result[2].id).toBe("no-match");
    });

    it("respects the limit parameter", () => {
      const stories = [
        makeStory({ id: "s1", genre: "fantasy", tags: ["magic"], keywords: ["quest"] }),
        makeStory({ id: "s2", genre: "fantasy", tags: ["dragons"], keywords: ["quest"] }),
        makeStory({ id: "s3", genre: "fantasy", tags: ["magic"], keywords: ["castle"] }),
        makeStory({ id: "s4", genre: "fantasy", tags: ["warriors"], keywords: ["quest"] }),
        makeStory({ id: "s5", genre: "fantasy", tags: ["magic"], keywords: ["hero"] }),
      ];
      const result = getSimilarStories(current, stories, 2);
      expect(result).toHaveLength(2);
    });

    it("returns empty array when no stories provided", () => {
      const result = getSimilarStories(current, [], 4);
      expect(result).toHaveLength(0);
    });

    it("returns empty array when only the current story is in the list", () => {
      const result = getSimilarStories(current, [current], 4);
      expect(result).toHaveLength(0);
    });

    it("attaches a similarity score to each returned story", () => {
      const stories = [makeStory({ id: "s1", genre: "fantasy", tags: ["magic"], keywords: ["quest"] })];
      const result = getSimilarStories(current, stories, 4);
      expect(result[0].similarity).toBe(8);
    });
  });
});
