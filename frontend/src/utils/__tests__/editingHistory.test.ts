import { describe, it, expect } from "vitest";
import { getSuggestionHistory } from "../editingHistory";

describe("getSuggestionHistory", () => {
  it("returns a non-empty history", () => {
    const history = getSuggestionHistory();
    expect(history.length).toBeGreaterThan(0);
  });

  it("returns entries with the expected shape", () => {
    const history = getSuggestionHistory();
    const entry = history[0];
    expect(entry).toHaveProperty("id");
    expect(entry).toHaveProperty("suggestion");
    expect(entry).toHaveProperty("status");
    expect(entry).toHaveProperty("timestamp");
  });

  it("classifies status as Accepted or Rejected", () => {
    const history = getSuggestionHistory();
    const valid = ["Accepted", "Rejected"];
    for (const entry of history) {
      expect(valid).toContain(entry.status);
    }
  });

  it("assigns sequential ids", () => {
    const history = getSuggestionHistory();
    history.forEach((entry, index) => {
      expect(entry.id).toBe(index + 1);
    });
  });

  it("provides a non-empty suggestion for every entry", () => {
    const history = getSuggestionHistory();
    for (const entry of history) {
      expect(entry.suggestion.length).toBeGreaterThan(0);
    }
  });
});
