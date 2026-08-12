import { describe, it, expect } from "vitest";
import { generatePrompt, generateCoverOptions } from "../coverGenerator";

describe("coverGenerator", () => {
  describe("generatePrompt", () => {
    it("returns a string containing title, genre, theme, and characters", () => {
      const storyInfo = {
        title: "The Dragon's Quest",
        genre: "Fantasy",
        theme: "Heroism",
        characters: ["Aragorn", "Elena"],
      };
      const result = generatePrompt(storyInfo);
      expect(typeof result).toBe("string");
      expect(result).toContain("The Dragon's Quest");
      expect(result).toContain("Fantasy");
      expect(result).toContain("Heroism");
      expect(result).toContain("Aragorn");
    });

    it("handles empty characters array", () => {
      const storyInfo = {
        title: "Lonely Road",
        genre: "Drama",
        theme: "Isolation",
        characters: [],
      };
      const result = generatePrompt(storyInfo);
      expect(result).toContain("Lonely Road");
      expect(result).toContain("Drama");
    });

    it("handles single character", () => {
      const storyInfo = {
        title: "Solo",
        genre: "Thriller",
        theme: "Survival",
        characters: ["John"],
      };
      const result = generatePrompt(storyInfo);
      expect(result).toContain("John");
    });
  });

  describe("generateCoverOptions", () => {
    it("returns an array of CoverImage objects", () => {
      const storyInfo = {
        title: "Test Story",
        genre: "Fiction",
        theme: "Adventure",
        characters: ["Hero"],
      };
      const result = generateCoverOptions(storyInfo);
      expect(Array.isArray(result)).toBe(true);
    });

    it("returns exactly 4 cover options", () => {
      const storyInfo = {
        title: "Test Story",
        genre: "Fiction",
        theme: "Adventure",
        characters: ["Hero"],
      };
      const result = generateCoverOptions(storyInfo);
      expect(result).toHaveLength(4);
    });

    it("each cover has id and image fields", () => {
      const storyInfo = {
        title: "Test Story",
        genre: "Fiction",
        theme: "Adventure",
        characters: ["Hero"],
      };
      const result = generateCoverOptions(storyInfo);
      result.forEach((cover) => {
        expect(typeof cover.id).toBe("number");
        expect(typeof cover.image).toBe("string");
        expect(cover.image).toMatch(/^\/covers\/cover[1-4]\.png$/);
      });
    });

    it("cover ids are sequential starting from 1", () => {
      const storyInfo = {
        title: "Test Story",
        genre: "Fiction",
        theme: "Adventure",
        characters: ["Hero"],
      };
      const result = generateCoverOptions(storyInfo);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
      expect(result[3].id).toBe(4);
    });
  });
});
