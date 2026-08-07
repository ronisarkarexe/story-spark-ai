import { describe, it, expect } from "vitest";
import { getDialogueDistribution } from "../dialogueDistribution";

describe("getDialogueDistribution", () => {
  it("returns a non-empty list of characters", () => {
    const distribution = getDialogueDistribution();
    expect(distribution.length).toBeGreaterThan(0);
  });

  it("returns entries with the expected shape", () => {
    const distribution = getDialogueDistribution();
    const entry = distribution[0];
    expect(entry).toHaveProperty("name");
    expect(entry).toHaveProperty("lines");
    expect(entry).toHaveProperty("percentage");
  });

  it("keeps percentages within 0-100", () => {
    const distribution = getDialogueDistribution();
    for (const entry of distribution) {
      expect(entry.percentage).toBeGreaterThanOrEqual(0);
      expect(entry.percentage).toBeLessThanOrEqual(100);
    }
  });

  it("keeps line counts non-negative", () => {
    const distribution = getDialogueDistribution();
    for (const entry of distribution) {
      expect(entry.lines).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns a non-empty name for every entry", () => {
    const distribution = getDialogueDistribution();
    for (const entry of distribution) {
      expect(entry.name.length).toBeGreaterThan(0);
    }
  });
});
