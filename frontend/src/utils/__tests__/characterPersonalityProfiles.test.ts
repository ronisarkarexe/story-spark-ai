import { describe, it, expect } from "vitest";
import {
  analyzeCharacterProfiles,
  refreshCharacterProfiles,
} from "../characterPersonalityProfiles";

describe("analyzeCharacterProfiles", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeCharacterProfiles("")).toEqual([]);
    expect(analyzeCharacterProfiles("   \n  ")).toEqual([]);
  });

  it("returns a non-empty list of profiles for non-empty input", () => {
    const r = analyzeCharacterProfiles("A story about Emma and Liam.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each profile has the required fields with correct types", () => {
    const r = analyzeCharacterProfiles("A story.");
    for (const p of r) {
      expect(typeof p.id).toBe("number");
      expect(typeof p.name).toBe("string");
      expect(p.name.length).toBeGreaterThan(0);
      expect(Array.isArray(p.traits)).toBe(true);
      expect(Array.isArray(p.strengths)).toBe(true);
      expect(Array.isArray(p.weaknesses)).toBe(true);
      expect(typeof p.motivation).toBe("string");
      expect(p.motivation.length).toBeGreaterThan(0);
      expect(typeof p.development).toBe("string");
      expect(p.development.length).toBeGreaterThan(0);
    }
  });

  it("traits/strengths/weaknesses are arrays of non-empty strings", () => {
    const r = analyzeCharacterProfiles("A story.");
    for (const p of r) {
      for (const arr of [p.traits, p.strengths, p.weaknesses]) {
        for (const s of arr) {
          expect(typeof s).toBe("string");
          expect(s.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("profile ids are unique and sequential", () => {
    const r = analyzeCharacterProfiles("A story.");
    const ids = r.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("character names are unique", () => {
    const r = analyzeCharacterProfiles("A story.");
    const names = r.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story about characters.";
    expect(analyzeCharacterProfiles(story)).toEqual(
      analyzeCharacterProfiles(story)
    );
  });
});

describe("refreshCharacterProfiles", () => {
  it("delegates to analyzeCharacterProfiles", () => {
    const story = "A story to refresh character profiles for.";
    expect(refreshCharacterProfiles(story)).toEqual(analyzeCharacterProfiles(story));
  });

  it("returns [] for empty input", () => {
    expect(refreshCharacterProfiles("")).toEqual([]);
  });
});
