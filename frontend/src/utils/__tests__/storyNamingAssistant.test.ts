import { describe, it, expect } from "vitest";
import { generateNames } from "../storyNamingAssistant";

describe("generateNames", () => {
  it("returns fantasy character names", () => {
    const names = generateNames("Fantasy", "Character");
    expect(names.length).toBeGreaterThan(0);
    expect(names[0].name.length).toBeGreaterThan(0);
  });

  it("returns sci-fi city names", () => {
    const names = generateNames("SciFi", "City");
    expect(names.length).toBeGreaterThan(0);
  });

  it("assigns sequential ids", () => {
    const names = generateNames("Fantasy", "Artifact");
    names.forEach((name, index) => {
      expect(name.id).toBe(index + 1);
    });
  });

  it("sets the entity type on every suggestion", () => {
    const names = generateNames("Fantasy", "Kingdom");
    for (const name of names) {
      expect(name.entityType).toBe("Kingdom");
    }
  });

  it("returns an empty array for an unknown genre", () => {
    const names = generateNames("Horror", "Character");
    expect(names).toEqual([]);
  });

  it("returns an empty array for an unknown entity type", () => {
    const names = generateNames("Fantasy", "Spaceship");
    expect(names).toEqual([]);
  });
});
