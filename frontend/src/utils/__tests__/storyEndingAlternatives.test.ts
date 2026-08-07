import { describe, it, expect } from "vitest";
import {
  generateEndingAlternatives,
  regenerateEndingAlternatives,
} from "../storyEndingAlternatives";

describe("generateEndingAlternatives", () => {
  it("returns an empty array for empty text", () => {
    expect(generateEndingAlternatives("")).toEqual([]);
    expect(generateEndingAlternatives("   ")).toEqual([]);
  });

  it("returns alternatives for a non-empty story", () => {
    const result = generateEndingAlternatives("The heroes approached the final gate.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns alternatives with the expected shape", () => {
    const result = generateEndingAlternatives("The final battle begins.");
    const alt = result[0];
    expect(alt).toHaveProperty("id");
    expect(alt).toHaveProperty("title");
    expect(alt).toHaveProperty("style");
    expect(alt).toHaveProperty("emotionalImpact");
    expect(alt).toHaveProperty("content");
  });

  it("assigns sequential ids", () => {
    const result = generateEndingAlternatives("The journey is ending.");
    result.forEach((alt, index) => {
      expect(alt.id).toBe(index + 1);
    });
  });

  it("provides non-empty content for every alternative", () => {
    const result = generateEndingAlternatives("The quest has concluded.");
    for (const alt of result) {
      expect(alt.content.length).toBeGreaterThan(0);
    }
  });

  it("regenerateEndingAlternatives returns the same result", () => {
    const story = "The heroes won the day.";
    expect(regenerateEndingAlternatives(story)).toEqual(generateEndingAlternatives(story));
  });
});
