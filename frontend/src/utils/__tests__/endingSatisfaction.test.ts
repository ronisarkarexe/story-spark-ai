import { describe, it, expect } from "vitest";
import { getEndingMetrics } from "../endingSatisfaction";

describe("getEndingMetrics", () => {
  it("returns a non-empty list of ending metrics", () => {
    const r = getEndingMetrics();
    expect(r.length).toBeGreaterThan(0);
  });

  it("each metric has the required fields with correct types", () => {
    const r = getEndingMetrics();
    for (const m of r) {
      expect(typeof m.title).toBe("string");
      expect(m.title.length).toBeGreaterThan(0);
      expect(typeof m.score).toBe("number");
      expect(typeof m.description).toBe("string");
      expect(m.description.length).toBeGreaterThan(0);
      expect(typeof m.suggestion).toBe("string");
      expect(m.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("all scores are finite and within 0-100", () => {
    const r = getEndingMetrics();
    for (const m of r) {
      expect(Number.isFinite(m.score)).toBe(true);
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(100);
    }
  });

  it("titles are unique", () => {
    const r = getEndingMetrics();
    const titles = r.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("returns deterministic output across calls", () => {
    expect(getEndingMetrics()).toEqual(getEndingMetrics());
  });
});
