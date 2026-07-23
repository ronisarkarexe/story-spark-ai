/* eslint-disable */
import { describe, it, expect } from "vitest";
import { checkCharacterConsistency } from "../characterConsistency";

describe("characterConsistency", () => {
  describe("checkCharacterConsistency", () => {
    it("detects hair color from COLOR hair pattern", () => {
      const chapters = [
        { content: "Elena had silver hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(0); // First mention - no conflict
    });

    it("detects hair color conflict with COLOR hair pattern", () => {
      const chapters = [
        { content: "Elena had silver hair." },
        { content: "Elena had black hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(1);
      expect(result[0].character).toBe("Elena");
      expect(result[0].attribute).toBe("hair color");
      expect(result[0].previous).toBe("silver");
      expect(result[0].current).toBe("black");
    });

    it("detects hair color with possessive pronoun", () => {
      const chapters = [
        { content: "Merlin brushed his silver hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(0); // First mention - no conflict
    });

    it("detects conflict with possessive pronoun", () => {
      const chapters = [
        { content: "Merlin brushed his silver hair." },
        { content: "Merlin brushed his black hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(1);
      expect(result[0].character).toBe("Merlin");
    });

    it("detects hair color with was/copula pattern", () => {
      const chapters = [
        { content: "Eleanor's hair was silver." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(0); // First mention
    });

    it("detects conflict with was/copula pattern", () => {
      const chapters = [
        { content: "Eleanor's hair was silver." },
        { content: "Eleanor's hair was brown." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(1);
      expect(result[0].character).toBe("Eleanor");
    });

    it("detects colors like grey, ginger, auburn", () => {
      const chapters = [
        { content: "Draco had grey hair." },
        { content: "Draco had ginger hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(1);
    });

    it("handles multiple characters", () => {
      const chapters = [
        { content: "Arthur had blonde hair." },
        { content: "Morgana had black hair." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result.length).toBe(0); // Different characters
    });

    it("returns empty array when no characters with hair found", () => {
      const chapters = [
        { content: "The castle was old." }
      ];
      const result = checkCharacterConsistency(chapters);
      expect(result).toEqual([]);
    });

    it("handles empty chapters array", () => {
      const result = checkCharacterConsistency([]);
      expect(result).toEqual([]);
    });
  });
});
