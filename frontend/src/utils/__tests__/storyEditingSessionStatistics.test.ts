import { describe, it, expect } from "vitest";
import { calculateEditingSession } from "../storyEditingSessionStatistics";

describe("calculateEditingSession", () => {
  it("computes words added when the story grows", () => {
    const result = calculateEditingSession("one two", "one two three", Date.now());
    expect(result.wordsAdded).toBe(1);
    expect(result.wordsRemoved).toBe(0);
  });

  it("computes words removed when the story shrinks", () => {
    const result = calculateEditingSession("one two three", "one two", Date.now());
    expect(result.wordsRemoved).toBe(1);
    expect(result.wordsAdded).toBe(0);
  });

  it("returns zero deltas for unchanged text", () => {
    const result = calculateEditingSession("one two", "one two", Date.now());
    expect(result.wordsAdded).toBe(0);
    expect(result.wordsRemoved).toBe(0);
  });

  it("computes the absolute paragraph difference", () => {
    const result = calculateEditingSession("one\n\ntwo", "one\n\ntwo\n\nthree", Date.now());
    expect(result.paragraphsModified).toBe(1);
  });

  it("returns the expected stats shape", () => {
    const result = calculateEditingSession("a", "a b", Date.now());
    expect(result).toHaveProperty("wordsAdded");
    expect(result).toHaveProperty("wordsRemoved");
    expect(result).toHaveProperty("paragraphsModified");
    expect(result).toHaveProperty("editingDuration");
    expect(result).toHaveProperty("totalRevisions");
  });

  it("returns a non-negative editing duration", () => {
    const result = calculateEditingSession("a", "a b", Date.now());
    expect(result.editingDuration).toBeGreaterThanOrEqual(0);
  });
});
