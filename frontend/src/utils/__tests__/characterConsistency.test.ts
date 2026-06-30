import { describe, it, expect } from "vitest";
import { checkCharacterConsistency } from "../characterConsistency";

describe("checkCharacterConsistency", () => {
  it("returns empty conflicts when no hair color change", () => {
    const chapters = [
      { content: "Elena had silver hair. She walked into the room." },
      { content: "Elena brushed her silver hair." },
    ];
    expect(checkCharacterConsistency(chapters)).toEqual([]);
  });

  it("detects hair color change for the same character", () => {
    const chapters = [
      { content: "Elena had silver hair." },
      { content: "Elena had black hair." },
    ];
    const conflicts = checkCharacterConsistency(chapters);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      character: "Elena",
      attribute: "hair color",
      previous: "silver",
      current: "black",
    });
  });

  it("handles single-letter character names", () => {
    const chapters = [
      { content: "K wore black hair." },
    ];
    expect(checkCharacterConsistency(chapters)).toEqual([]);
  });

  it("recognizes all hair color variants", () => {
    const colors = ["white", "grey", "gray", "auburn", "chestnut", "platinum", "ginger", "golden"];
    for (const color of colors) {
      const chapters = [{ content: `Test character had ${color} hair.` }];
      expect(checkCharacterConsistency(chapters)).toEqual([]);
    }
  });

  it("is case insensitive", () => {
    const chapters = [
      { content: "Elena had Silver hair." },
      { content: "Elena had Black hair." },
    ];
    const conflicts = checkCharacterConsistency(chapters);
    expect(conflicts).toHaveLength(1);
  });
});
