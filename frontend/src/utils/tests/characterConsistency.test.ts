import { describe, it, expect } from "vitest";
import { checkCharacterConsistency } from "../characterConsistency";

describe("checkCharacterConsistency", () => {
  it("returns empty array for empty chapters array", () => {
    const result = checkCharacterConsistency([]);
    expect(result).toEqual([]);
  });

  it("returns empty array when no characters match the hair color pattern", () => {
    const chapters = [
      { content: "Once upon a time there lived a hero in the forest." },
      { content: "The warrior ventured into the dark cave." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("returns empty array when character has consistent hair color across chapters", () => {
    const chapters = [
      { content: "Arthur had black hair and wielded a sword." },
      { content: "Arthur walked through the forest with his black hair shining." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("detects hair color conflict when character changes from black to blonde", () => {
    const chapters = [
      { content: "Morgan had black hair and rode a horse." },
      { content: "Morgan emerged from the shadows with blonde hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      character: "Morgan",
      attribute: "hair color",
      previous: "black",
      current: "blonde",
    });
  });

  it("detects hair color conflict from blonde to red", () => {
    const chapters = [
      { content: "Elara had blonde hair in the ancient kingdom." },
      { content: "Elara was seen with striking red hair in the marketplace." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(1);
    expect(result[0].character).toBe("Elara");
    expect(result[0].previous).toBe("blonde");
    expect(result[0].current).toBe("red");
  });

  it("detects multiple independent character conflicts", () => {
    const chapters = [
      { content: "Aria had brown hair. Brio had silver hair." },
      { content: "Aria appeared with blonde hair. Brio showed red hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.character).sort()).toEqual(["Aria", "Brio"]);
  });

  it("is case-insensitive for hair color keywords", () => {
    const chapters = [
      { content: "Leo had BLACK hair in the beginning." },
      { content: "Leo appeared with BLACK hair again later." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("only matches capitalized character names followed by hair color", () => {
    const chapters = [
      { content: "the hero had black hair in the village." },
      { content: "the hero had blonde hair in the castle." },
    ];
    const result = checkCharacterConsistency(chapters);
    // "the" is not a capitalized name; no match expected
    expect(result).toEqual([]);
  });
});
