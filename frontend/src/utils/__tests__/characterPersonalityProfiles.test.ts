import { describe, it, expect } from "vitest";
import {
  analyzeCharacterProfiles,
  refreshCharacterProfiles,
} from "../characterPersonalityProfiles";

describe("analyzeCharacterProfiles", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeCharacterProfiles("")).toEqual([]);
    expect(analyzeCharacterProfiles("   ")).toEqual([]);
  });

  it("returns profiles for a non-empty story", () => {
    const result = analyzeCharacterProfiles("The brave hero set out on a quest.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns profiles with the expected shape", () => {
    const result = analyzeCharacterProfiles("A story about a loyal companion.");
    const profile = result[0];
    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("traits");
    expect(profile).toHaveProperty("strengths");
    expect(profile).toHaveProperty("weaknesses");
    expect(profile).toHaveProperty("motivation");
    expect(profile).toHaveProperty("development");
  });

  it("includes non-empty trait and strength lists", () => {
    const result = analyzeCharacterProfiles("The curious explorer traveled far.");
    for (const profile of result) {
      expect(profile.traits.length).toBeGreaterThan(0);
      expect(profile.strengths.length).toBeGreaterThan(0);
      expect(profile.weaknesses.length).toBeGreaterThan(0);
    }
  });

  it("assigns sequential ids", () => {
    const result = analyzeCharacterProfiles("The loyal warrior stood guard.");
    result.forEach((profile, index) => {
      expect(profile.id).toBe(index + 1);
    });
  });

  it("refreshCharacterProfiles returns the same result", () => {
    const story = "The wise mentor guided the young hero.";
    expect(refreshCharacterProfiles(story)).toEqual(analyzeCharacterProfiles(story));
  });
});
