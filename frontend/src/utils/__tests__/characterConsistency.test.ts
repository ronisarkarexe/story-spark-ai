import { describe, it, expect } from "vitest";
import { checkCharacterConsistency } from "../characterConsistency";

describe("characterConsistency", () => {
  describe("checkCharacterConsistency", () => {
    it("should return empty array for chapters with no character mentions", () => {
      const chapters = [{ content: "The forest was dark and quiet." }];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });

    it("should return empty array for single chapter with character mention", () => {
      const chapters = [{ content: "Alice has silver hair." }];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });

    it("should return empty array when same character has same hair color in multiple chapters", () => {
      const chapters = [
        { content: "Alice has silver hair." },
        { content: "Alice woke up. Her silver hair glistened in the sun." },
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });

    it("should detect conflict when same character has different hair colors", () => {
      const chapters = [
        { content: "Alice has silver hair." },
        { content: "Alice woke up. Her brown hair was messy." },
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(1);
      expect(result[0].character).toBe("Alice");
      expect(result[0].attribute).toBe("hair color");
      expect(result[0].previous).toBe("silver");
      expect(result[0].current).toBe("brown");
    });

    it("should detect multiple conflicts for different characters", () => {
      const chapters = [
        { content: "Alice has silver hair." },
        { content: "Bob has blonde hair." },
        { content: "Alice woke up. Her brown hair was messy." },
        { content: "Bob appeared. His black hair was dark." },
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(2);
      const characters = result.map((c) => c.character).sort();
      expect(characters).toEqual(["Alice", "Bob"]);
    });

    it("should be case-insensitive for hair color matching", () => {
      const chapters = [
        { content: "Alice has silver hair." },
        { content: "Alice woke up. Her SILVER hair glistened." },
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });

    it("should return empty array for empty chapters array", () => {
      const result = checkCharacterConsistency([]);
      expect(result).toEqual([]);
    });

    it("should return empty array when chapters have no hair color mentions", () => {
      const chapters = [
        { content: "The hero walked into the castle." },
        { content: "The hero fought the dragon." },
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });
  });
});
