import { describe, it, expect } from "vitest";
import { getDialogueDistribution } from "../dialogueDistribution";

describe("getDialogueDistribution - zero-total guard", () => {
  it("returns percentages summing to ~100 for normal data", () => {
    const result = getDialogueDistribution();
    const sum = result.reduce((acc, c) => acc + c.percentage, 0);
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
    // Each percentage is finite and non-negative.
    for (const c of result) {
      expect(Number.isFinite(c.percentage)).toBe(true);
      expect(c.percentage).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns four character entries", () => {
    const result = getDialogueDistribution();
    expect(result).toHaveLength(4);
    expect(result.map((c) => c.name).sort()).toEqual(
      ["Alice", "David", "Emma", "John"]
    );
  });
});
