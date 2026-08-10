import { describe, it, expect } from "vitest";
import { analyzeFoilCharacters } from "../foilCharacterAnalyzer";

describe("analyzeFoilCharacters", () => {
  it("returns a non-empty list of foil pairs", () => {
    const r = analyzeFoilCharacters();
    expect(r.length).toBeGreaterThan(0);
  });

  it("each pair has the required FoilPair fields with non-empty strings", () => {
    const r = analyzeFoilCharacters();
    for (const p of r) {
      expect(typeof p.protagonist).toBe("string");
      expect(p.protagonist.length).toBeGreaterThan(0);
      expect(typeof p.foil).toBe("string");
      expect(p.foil.length).toBeGreaterThan(0);
      expect(typeof p.contrast).toBe("string");
      expect(p.contrast.length).toBeGreaterThan(0);
      expect(typeof p.suggestion).toBe("string");
      expect(p.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("protagonist and foil are distinct within each pair", () => {
    const r = analyzeFoilCharacters();
    for (const p of r) {
      expect(p.protagonist).not.toBe(p.foil);
    }
  });

  it("returns deterministic output across calls", () => {
    expect(analyzeFoilCharacters()).toEqual(analyzeFoilCharacters());
  });

  it("protagonists are unique across pairs", () => {
    const r = analyzeFoilCharacters();
    const names = r.map((p) => p.protagonist);
    expect(new Set(names).size).toBe(names.length);
  });
});
