import { describe, it, expect } from "vitest";
import { generateFactSheet, copyFactSheet } from "../storyFactSheet";

describe("generateFactSheet", () => {
  it("extracts capitalized words as characters", () => {
    const sheet = generateFactSheet("Emma traveled with Liam through the forest.");
    expect(sheet.characters).toContain("Emma");
    expect(sheet.characters).toContain("Liam");
  });

  it("deduplicates repeated character names", () => {
    const sheet = generateFactSheet("Emma called Emma again.");
    const emmaCount = sheet.characters.filter((c) => c === "Emma").length;
    expect(emmaCount).toBe(1);
  });

  it("caps characters at five entries", () => {
    const sheet = generateFactSheet("A B C D E F G H I J");
    expect(sheet.characters.length).toBeLessThanOrEqual(5);
  });

  it("returns the expected static sheet fields", () => {
    const sheet = generateFactSheet("A story about a hero.");
    expect(sheet.locations).toEqual(["Unknown Location"]);
    expect(sheet.timeline).toBe("Chronological");
    expect(sheet.genre).toBe("Adventure");
    expect(sheet.themes).toEqual(["Friendship", "Courage"]);
  });

  it("handles empty input without throwing", () => {
    const sheet = generateFactSheet("");
    expect(Array.isArray(sheet.characters)).toBe(true);
    expect(sheet.characters).toEqual([]);
  });

  it("ignores words that are not capitalized", () => {
    const sheet = generateFactSheet("the quick brown fox jumped over the lazy dog");
    expect(sheet.characters).toEqual([]);
  });
});

describe("copyFactSheet", () => {
  it("formats every field into the copy text", () => {
    const sheet = generateFactSheet("Emma and Liam saved the kingdom.");
    const text = copyFactSheet(sheet);
    expect(text).toContain("Characters:");
    expect(text).toContain("Locations:");
    expect(text).toContain("Timeline:");
    expect(text).toContain("Genre:");
    expect(text).toContain("Themes:");
    expect(text).toContain("Conflict:");
    expect(text).toContain("Resolution:");
  });

  it("includes the character names in the copy text", () => {
    const sheet = generateFactSheet("Emma and Liam saved the kingdom.");
    const text = copyFactSheet(sheet);
    expect(text).toContain("Emma");
    expect(text).toContain("Liam");
  });
});
