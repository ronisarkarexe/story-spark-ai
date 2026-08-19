import { describe, expect, it } from "vitest";
import {
  analyzeCharacterArcs,
  refreshCharacterArcAnalysis,
  type CharacterArcAnalysis,
} from "../characterArcTracker";

describe("characterArcTracker", () => {
  describe("analyzeCharacterArcs", () => {
    it("returns the empty analysis structure for blank input", () => {
      const result = analyzeCharacterArcs("   \n\t  ");

      expect(result).toEqual({
        overallScore: 0,
        characters: [],
      });
    });

    it("returns the empty analysis structure for an empty string", () => {
      const result = analyzeCharacterArcs("");

      expect(result).toEqual({
        overallScore: 0,
        characters: [],
      });
    });

    it("returns populated arc analysis for a non-empty story", () => {
      const story =
        "Emma was afraid to lead, but she eventually became a confident leader after confronting the town's crisis.";

      const result = analyzeCharacterArcs(story);

      expect(result).toMatchObject<CharacterArcAnalysis>({
        overallScore: 88,
        characters: [
          {
            id: 1,
            name: "Emma",
            growth: "Strong",
            beginning: "Timid and uncertain",
            ending: "Confident leader",
            summary:
              "Emma evolves from avoiding responsibility to confidently leading others.",
            suggestion:
              "Expand the emotional turning point before the climax.",
          },
          {
            id: 2,
            name: "Liam",
            growth: "Moderate",
            beginning: "Impulsive",
            ending: "More thoughtful",
            summary:
              "Shows gradual maturity but lacks a defining transformation.",
            suggestion:
              "Add one major decision that demonstrates personal growth.",
          },
          {
            id: 3,
            name: "Sophia",
            growth: "Weak",
            beginning: "Supportive friend",
            ending: "Supportive friend",
            summary:
              "Little noticeable development throughout the story.",
            suggestion:
              "Introduce internal conflict or a personal challenge.",
          },
        ],
      });

      expect(result.characters).toHaveLength(3);
      expect(
        result.characters.every((character) => typeof character.id === "number")
      ).toBe(true);
      expect(
        result.characters.every((character) => typeof character.name === "string")
      ).toBe(true);
      expect(
        result.characters.every((character) =>
          ["Strong", "Moderate", "Weak"].includes(character.growth)
        )
      ).toBe(true);
    });

    it("throws a TypeError for malformed or missing runtime input", () => {
      expect(() => analyzeCharacterArcs(undefined as any)).toThrow(TypeError);
      expect(() => analyzeCharacterArcs(null as any)).toThrow(TypeError);
      expect(() => analyzeCharacterArcs({} as any)).toThrow(TypeError);
      expect(() => analyzeCharacterArcs(123 as any)).toThrow(TypeError);
    });
  });

  describe("refreshCharacterArcAnalysis", () => {
    it("returns the same output as analyzeCharacterArcs for identical non-empty input", () => {
      const story =
        "A young thief must decide whether revenge or mercy will define the future.";

      const expected = analyzeCharacterArcs(story);
      const result = refreshCharacterArcAnalysis(story);

      expect(result).toEqual(expected);
      expect(result).toStrictEqual(expected);
      expect(result.overallScore).toBe(88);
      expect(result.characters).toHaveLength(3);
    });

    it("returns the same empty result as analyzeCharacterArcs for empty input", () => {
      const story = " \n\t ";

      expect(refreshCharacterArcAnalysis(story)).toEqual(analyzeCharacterArcs(story));
      expect(refreshCharacterArcAnalysis(story)).toEqual({
        overallScore: 0,
        characters: [],
      });
    });

    it("throws the same TypeError for invalid runtime input", () => {
      expect(() => refreshCharacterArcAnalysis(undefined as any)).toThrow(TypeError);
      expect(() => refreshCharacterArcAnalysis(null as any)).toThrow(TypeError);
      expect(() => refreshCharacterArcAnalysis({} as any)).toThrow(TypeError);
      expect(() => refreshCharacterArcAnalysis(123 as any)).toThrow(TypeError);
    });
  });
});
