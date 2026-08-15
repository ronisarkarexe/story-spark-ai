import { describe, it, expect } from "vitest";
import { analyzeTitle, replaceTitle } from "../storyTitleRating";

describe("analyzeTitle", () => {
  it("returns an object with all required fields", () => {
    const r = analyzeTitle("The Great Adventure");
    expect(r).toHaveProperty("score");
    expect(r).toHaveProperty("creativity");
    expect(r).toHaveProperty("relevance");
    expect(r).toHaveProperty("clarity");
    expect(r).toHaveProperty("appeal");
    expect(r).toHaveProperty("strengths");
    expect(r).toHaveProperty("weaknesses");
    expect(r).toHaveProperty("suggestions");
  });

  it("scores are finite and within 0-100", () => {
    const r = analyzeTitle("A Nice Title");
    for (const s of [r.score, r.creativity, r.relevance, r.clarity, r.appeal]) {
      expect(Number.isFinite(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });

  it("score is higher for an optimal-length title than a too-short one", () => {
    const short = analyzeTitle("ab").score; // length 2
    const optimal = analyzeTitle("The Great Adventure Begins").score; // length 25
    expect(optimal).toBeGreaterThan(short);
  });

  it("strengths and weaknesses are arrays of non-empty strings", () => {
    const r = analyzeTitle("Some Title");
    expect(Array.isArray(r.strengths)).toBe(true);
    expect(Array.isArray(r.weaknesses)).toBe(true);
    for (const s of r.strengths) {
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    }
    for (const w of r.weaknesses) {
      expect(typeof w).toBe("string");
      expect(w.length).toBeGreaterThan(0);
    }
  });

  it("suggestions include the title in variations", () => {
    const title = "Echoes";
    const r = analyzeTitle(title);
    expect(Array.isArray(r.suggestions)).toBe(true);
    expect(r.suggestions.length).toBeGreaterThan(0);
    for (const s of r.suggestions) {
      expect(typeof s).toBe("string");
      expect(s).toContain(title);
    }
  });

  it("is deterministic for the same input", () => {
    const title = "A Deterministic Title";
    expect(analyzeTitle(title)).toEqual(analyzeTitle(title));
  });
});

describe("replaceTitle", () => {
  it("returns the title unchanged", () => {
    expect(replaceTitle("My Title")).toBe("My Title");
    expect(replaceTitle("Another One")).toBe("Another One");
  });
});
