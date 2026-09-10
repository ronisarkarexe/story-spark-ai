import { describe, it, expect } from "vitest";
import {
  checkCharacterConsistency,
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

  it("detects multiple conflicts for different characters", () => {
    const result = checkCharacterConsistency([
      chapter("Alice had silver hair. Bob had blonde hair."),
      chapter("Alice had brown hair. Bob had black hair."),
    ]);
    expect(result).toHaveLength(2);
    const characters = result.map((c) => c.character).sort();
    expect(characters).toEqual(["Alice", "Bob"]);
  });

  it("is case-insensitive for hair color matching", () => {
    const result = checkCharacterConsistency([
      chapter("Mira had SILVER hair."),
      chapter("Mira had silver hair."),
    ]);
    expect(result).toEqual([]);
  });
});
