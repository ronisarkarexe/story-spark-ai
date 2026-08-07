import { describe, it, expect } from "vitest";
import { getCallbacks } from "../callbackDetector";

describe("getCallbacks", () => {
  it("returns an array", () => {
    const result = getCallbacks();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns exactly 3 callback items", () => {
    const result = getCallbacks();
    expect(result).toHaveLength(3);
  });

  it("each item has a positive integer id", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      expect(typeof item.id).toBe("number");
      expect(item.id).toBeGreaterThan(0);
      expect(Number.isInteger(item.id)).toBe(true);
    });
  });

  it("each item has a non-empty string element field", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      expect(typeof item.element).toBe("string");
      expect(item.element.trim().length).toBeGreaterThan(0);
    });
  });

  it("each item has a non-empty string firstAppearance field", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      expect(typeof item.firstAppearance).toBe("string");
      expect(item.firstAppearance.trim().length).toBeGreaterThan(0);
    });
  });

  it("each item has a non-empty string callback field", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      expect(typeof item.callback).toBe("string");
      expect(item.callback.trim().length).toBeGreaterThan(0);
    });
  });

  it("each item has a non-empty string suggestion field", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      expect(typeof item.suggestion).toBe("string");
      expect(item.suggestion.trim().length).toBeGreaterThan(0);
    });
  });

  it("callback chapter references come after firstAppearance", () => {
    const result = getCallbacks();
    result.forEach((item) => {
      const firstChapter = parseInt(item.firstAppearance.replace(/\D/g, ""), 10);
      const callbackChapter = parseInt(item.callback.replace(/\D/g, ""), 10);
      expect(callbackChapter).toBeGreaterThan(firstChapter);
    });
  });

  it("all ids are unique", () => {
    const result = getCallbacks();
    const ids = result.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
