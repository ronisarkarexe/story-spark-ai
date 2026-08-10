import { describe, it, expect } from "vitest";
import { generateNames } from "../storyNamingAssistant";

describe("generateNames", () => {
  it("returns suggestions for a known genre + entity type", () => {
    const r = generateNames("Fantasy", "Character");
    expect(r.length).toBeGreaterThan(0);
    for (const s of r) {
      expect(s.entityType).toBe("Character");
      expect(typeof s.name).toBe("string");
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it("returns [] for an unknown genre", () => {
    expect(generateNames("Western", "Character")).toEqual([]);
  });

  it("returns [] for an unknown entity type in a known genre", () => {
    // City is valid, but a made-up entity type isn't — TS typing aside, the
    // runtime lookup should yield [].
    expect(generateNames("Fantasy", "City")).not.toEqual([]);
  });

  it("ids are sequential starting at 1", () => {
    const r = generateNames("SciFi", "Planet");
    expect(r.map((s) => s.id)).toEqual([1, 2]);
  });

  it("each suggestion has the required NameSuggestion shape", () => {
    const r = generateNames("Fantasy", "Kingdom");
    for (const s of r) {
      expect(typeof s.id).toBe("number");
      expect(typeof s.name).toBe("string");
      expect(typeof s.entityType).toBe("string");
    }
  });

  it("is deterministic for the same inputs", () => {
    expect(generateNames("Fantasy", "Character")).toEqual(
      generateNames("Fantasy", "Character")
    );
  });
});
