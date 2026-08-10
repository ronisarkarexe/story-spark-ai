import { describe, it, expect } from "vitest";
import { getDialogueDistribution } from "../dialogueDistribution";

describe("getDialogueDistribution", () => {
  it("returns a non-empty list of characters", () => {
    const r = getDialogueDistribution();
    expect(r.length).toBeGreaterThan(0);
  });

  it("each entry has name, lines, and percentage fields", () => {
    const r = getDialogueDistribution();
    for (const c of r) {
      expect(typeof c.name).toBe("string");
      expect(c.name.length).toBeGreaterThan(0);
      expect(typeof c.lines).toBe("number");
      expect(c.lines).toBeGreaterThanOrEqual(0);
      expect(typeof c.percentage).toBe("number");
    }
  });

  it("percentages sum to ~100 (within rounding tolerance)", () => {
    const r = getDialogueDistribution();
    const total = r.reduce((sum, c) => sum + c.percentage, 0);
    // Rounding each percentage independently can leave the sum off by 1.
    expect(total).toBeGreaterThanOrEqual(99);
    expect(total).toBeLessThanOrEqual(101);
  });

  it("percentages are within 0-100 and finite", () => {
    const r = getDialogueDistribution();
    for (const c of r) {
      expect(Number.isFinite(c.percentage)).toBe(true);
      expect(c.percentage).toBeGreaterThanOrEqual(0);
      expect(c.percentage).toBeLessThanOrEqual(100);
    }
  });

  it("percentage is proportional to line count relative to total", () => {
    const r = getDialogueDistribution();
    const totalLines = r.reduce((sum, c) => sum + c.lines, 0);
    for (const c of r) {
      const expected = Math.round((c.lines / totalLines) * 100);
      expect(c.percentage).toBe(expected);
    }
  });

  it("the character with the most lines has the highest percentage", () => {
    const r = getDialogueDistribution();
    const maxLines = Math.max(...r.map((c) => c.lines));
    const top = r.find((c) => c.lines === maxLines);
    expect(top).toBeDefined();
    for (const c of r) {
      expect(top!.percentage).toBeGreaterThanOrEqual(c.percentage);
    }
  });
});
