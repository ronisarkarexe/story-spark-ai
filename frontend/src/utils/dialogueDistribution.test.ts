// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { getDialogueDistribution } from "./dialogueDistribution";

describe("dialogueDistribution", () => {
  describe("getDialogueDistribution", () => {
    it("returns an array of character dialogue objects", () => {
      const result = getDialogueDistribution("dummy story");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("each entry has name, lines, and percentage fields", () => {
      const result = getDialogueDistribution("dummy story");
      result.forEach((entry) => {
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("lines");
        expect(entry).toHaveProperty("percentage");
        expect(typeof entry.name).toBe("string");
        expect(typeof entry.lines).toBe("number");
        expect(typeof entry.percentage).toBe("number");
      });
    });

    it("percentage values are between 0 and 100", () => {
      const result = getDialogueDistribution("dummy story");
      result.forEach((entry) => {
        expect(entry.percentage).toBeGreaterThanOrEqual(0);
        expect(entry.percentage).toBeLessThanOrEqual(100);
      });
    });

    it("all characters have positive line counts", () => {
      const result = getDialogueDistribution("dummy story");
      result.forEach((entry) => {
        expect(entry.lines).toBeGreaterThan(0);
      });
    });

    it("returned names are non-empty strings", () => {
      const result = getDialogueDistribution("dummy story");
      result.forEach((entry) => {
        expect(entry.name.length).toBeGreaterThan(0);
      });
    });
  });
});
