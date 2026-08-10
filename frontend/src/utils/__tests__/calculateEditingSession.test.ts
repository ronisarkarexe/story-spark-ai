import { describe, it, expect, vi, afterEach } from "vitest";
import { calculateEditingSession } from "../storyEditingSessionStatistics";

afterEach(() => vi.useRealTimers());

describe("calculateEditingSession", () => {
  it("reports wordsAdded when current is longer than previous", () => {
    const r = calculateEditingSession(
      "one two three",
      "one two three four five",
      Date.now()
    );
    expect(r.wordsAdded).toBe(2);
    expect(r.wordsRemoved).toBe(0);
    expect(r.totalRevisions).toBe(1);
  });

  it("reports wordsRemoved when current is shorter than previous", () => {
    const r = calculateEditingSession(
      "one two three four five",
      "one two",
      Date.now()
    );
    expect(r.wordsAdded).toBe(0);
    expect(r.wordsRemoved).toBe(3);
  });

  it("reports zero added/removed when word counts are equal", () => {
    const r = calculateEditingSession("one two three", "four five six", Date.now());
    expect(r.wordsAdded).toBe(0);
    expect(r.wordsRemoved).toBe(0);
  });

  it("paragraphsModified reflects paragraph count difference", () => {
    const prev = "para1\n\npara2\n\npara3"; // 3 paragraphs
    const curr = "para1\n\npara2"; // 2 paragraphs
    const r = calculateEditingSession(prev, curr, Date.now());
    expect(r.paragraphsModified).toBe(1);
  });

  it("editingDuration is minutes since startTime", () => {
    // 5 minutes ago → duration 5.
    const r = calculateEditingSession("a", "a b", Date.now() - 5 * 60 * 1000);
    expect(r.editingDuration).toBe(5);
  });

  it("editingDuration is 0 for a brand-new session", () => {
    const r = calculateEditingSession("a", "a b", Date.now());
    expect(r.editingDuration).toBe(0);
  });

  it("handles empty previous story (all words added)", () => {
    const r = calculateEditingSession("", "one two three", Date.now());
    expect(r.wordsAdded).toBe(3);
    expect(r.wordsRemoved).toBe(0);
  });

  it("handles whitespace-only stories without NaN", () => {
    const r = calculateEditingSession("   \n  ", "   \n  ", Date.now());
    expect(Number.isFinite(r.wordsAdded)).toBe(true);
    expect(Number.isFinite(r.wordsRemoved)).toBe(true);
    expect(Number.isFinite(r.paragraphsModified)).toBe(true);
    expect(r.wordsAdded).toBe(0);
    expect(r.wordsRemoved).toBe(0);
  });

  it("returns EditingSessionStats with all required numeric fields", () => {
    const r = calculateEditingSession("a b", "a b c", Date.now());
    expect(r).toHaveProperty("wordsAdded");
    expect(r).toHaveProperty("wordsRemoved");
    expect(r).toHaveProperty("paragraphsModified");
    expect(r).toHaveProperty("editingDuration");
    expect(r).toHaveProperty("totalRevisions");
  });
});
