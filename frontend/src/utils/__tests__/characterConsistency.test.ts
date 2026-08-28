/* eslint-disable */
import { describe, it, expect } from "vitest";
import {
  checkCharacterConsistency,
  analyzeCharacterConsistency,
  getConsistencyScore,
  CharacterConflict,
} from "../characterConsistency";

const chapter = (content: string) => ({ content });

describe("characterConsistency utility", () => {
  it("returns empty array for chapters with no hair descriptions", () => {
    const result = checkCharacterConsistency([
      chapter("The sky was clear and the wind blew gently."),
    ]);
    expect(result).toEqual([]);
  });

  it("returns empty array for empty chapters array", () => {
    expect(checkCharacterConsistency([])).toEqual([]);
  });

  it("does not report conflict when hair color remains consistent across chapters", () => {
    const result = checkCharacterConsistency([
      chapter("Elena had silver hair that shimmered."),
      chapter("Elena combed her silver hair."),
    ]);
    expect(result).toEqual([]);
  });

  it("detects conflict when same character hair color changes across chapters", () => {
    const result = checkCharacterConsistency([
      chapter("Elena had silver hair."),
      chapter("Elena had black hair."),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject<CharacterConflict>({
      character: "Elena",
      attribute: "hair color",
      previous: "silver",
      current: "black",
    });
  });

  it("detects hair color with was/copula pattern", () => {
    const result = checkCharacterConsistency([
      chapter("Eleanor's hair was silver."),
      chapter("Eleanor's hair was brown."),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].character).toBe("Eleanor");
  });

  it("is case-insensitive for hair color matching", () => {
    const result = checkCharacterConsistency([
      chapter("Mira had SILVER hair."),
      chapter("Mira had silver hair."),
    ]);
    expect(result).toEqual([]);
  });

  it("analyzes character consistency and produces issue list", () => {
    const story = "Elena had silver hair.\n\nElena had black hair.";
    const issues = analyzeCharacterConsistency(story);
    expect(issues).toHaveLength(1);
    expect(issues[0].character).toBe("Elena");
  });

  it("calculates consistency score correctly", () => {
    expect(getConsistencyScore([])).toBe(100);
    const story = "Elena had silver hair.\n\nElena had black hair.";
    const issues = analyzeCharacterConsistency(story);
    expect(getConsistencyScore(issues)).toBe(85);
  });
});
