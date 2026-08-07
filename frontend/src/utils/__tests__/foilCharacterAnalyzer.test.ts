import { describe, it, expect } from "vitest";
import { analyzeFoilCharacters } from "../foilCharacterAnalyzer";

describe("analyzeFoilCharacters", () => {
  it("returns a non-empty list of foil pairs", () => {
    const pairs = analyzeFoilCharacters();
    expect(pairs.length).toBeGreaterThan(0);
  });

  it("returns pairs with the expected shape", () => {
    const pairs = analyzeFoilCharacters();
    const pair = pairs[0];
    expect(pair).toHaveProperty("protagonist");
    expect(pair).toHaveProperty("foil");
    expect(pair).toHaveProperty("contrast");
    expect(pair).toHaveProperty("suggestion");
  });

  it("includes distinct protagonist and foil names", () => {
    const pairs = analyzeFoilCharacters();
    for (const pair of pairs) {
      expect(pair.protagonist).not.toBe(pair.foil);
    }
  });

  it("provides a non-empty contrast for every pair", () => {
    const pairs = analyzeFoilCharacters();
    for (const pair of pairs) {
      expect(pair.contrast.length).toBeGreaterThan(0);
    }
  });

  it("provides a non-empty suggestion for every pair", () => {
    const pairs = analyzeFoilCharacters();
    for (const pair of pairs) {
      expect(pair.suggestion.length).toBeGreaterThan(0);
    }
  });
});
