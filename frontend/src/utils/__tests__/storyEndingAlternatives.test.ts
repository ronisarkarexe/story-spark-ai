import { describe, it, expect } from "vitest";
import {
  generateEndingAlternatives,
  regenerateEndingAlternatives,
} from "../storyEndingAlternatives";

describe("generateEndingAlternatives", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(generateEndingAlternatives("")).toEqual([]);
    expect(generateEndingAlternatives("   \n  ")).toEqual([]);
  });

  it("returns ending alternatives for non-empty input", () => {
    const r = generateEndingAlternatives("A story with a beginning and middle.");
    expect(r.length).toBeGreaterThan(0);
  });

  it("each alternative has the required fields with correct types", () => {
    const r = generateEndingAlternatives("Some story.");
    for (const alt of r) {
      expect(typeof alt.id).toBe("number");
      expect(typeof alt.title).toBe("string");
      expect(alt.title.length).toBeGreaterThan(0);
      expect(typeof alt.style).toBe("string");
      expect(typeof alt.emotionalImpact).toBe("string");
      expect(typeof alt.content).toBe("string");
      expect(alt.content.length).toBeGreaterThan(0);
    }
  });

  it("alternative ids are unique and sequential", () => {
    const r = generateEndingAlternatives("Story text.");
    const ids = r.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("returns the same alternatives for the same input (deterministic)", () => {
    const story = "A consistent story.";
    const a = generateEndingAlternatives(story);
    const b = generateEndingAlternatives(story);
    expect(a).toEqual(b);
  });
});

describe("regenerateEndingAlternatives", () => {
  it("delegates to generateEndingAlternatives", () => {
    const story = "A story to regenerate endings for.";
    expect(regenerateEndingAlternatives(story)).toEqual(
      generateEndingAlternatives(story)
    );
  });

  it("returns [] for empty input", () => {
    expect(regenerateEndingAlternatives("")).toEqual([]);
  });
});
