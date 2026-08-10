// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateEditingSession,
  getSessionHistory,
  saveSessionHistory,
} from "../storyEditingSessionStatistics";

describe("storyEditingSessionStatistics - SSR guards", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveSessionHistory then getSessionHistory round-trips", () => {
    const history = [
      { id: 1, date: "2026-01-01", duration: 10, revisions: 3 },
    ];
    saveSessionHistory(history);
    expect(getSessionHistory()).toEqual(history);
  });

  it("getSessionHistory returns [] when nothing stored or malformed", () => {
    expect(getSessionHistory()).toEqual([]);
    localStorage.setItem("editing-session-history", "{bad json");
    expect(getSessionHistory()).toEqual([]);
  });

  it("calculateEditingSession computes added/removed/paragraphs", () => {
    const r = calculateEditingSession(
      "one two three\n\nfour",
      "one two\n\nthree four five",
      Date.now() - 120000
    );
    expect(r.wordsRemoved).toBeGreaterThanOrEqual(0);
    expect(r.wordsAdded).toBeGreaterThanOrEqual(0);
    expect(r.totalRevisions).toBe(1);
    expect(r.editingDuration).toBe(2);
  });

  it("does not throw during SSR (no window/localStorage)", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error - intentionally removing window for SSR simulation
    delete globalThis.window;
    try {
      expect(getSessionHistory()).toEqual([]);
      expect(() =>
        saveSessionHistory([{ id: 1, date: "x", duration: 1, revisions: 1 }])
      ).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
