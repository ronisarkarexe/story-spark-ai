import { describe, it, expect } from "vitest";
import { getCallbacks } from "../callbackDetector";

describe("getCallbacks", () => {
  it("returns a non-empty list of callback items", () => {
    const r = getCallbacks();
    expect(r.length).toBeGreaterThan(0);
  });

  it("each item has the required fields with correct types", () => {
    const r = getCallbacks();
    for (const c of r) {
      expect(typeof c.id).toBe("number");
      expect(typeof c.element).toBe("string");
      expect(c.element.length).toBeGreaterThan(0);
      expect(typeof c.firstAppearance).toBe("string");
      expect(typeof c.callback).toBe("string");
      expect(typeof c.suggestion).toBe("string");
      expect(c.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("ids are unique and sequential", () => {
    const r = getCallbacks();
    const ids = r.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("returns deterministic output across calls", () => {
    const a = getCallbacks();
    const b = getCallbacks();
    expect(a).toEqual(b);
  });

  it("elements are unique", () => {
    const r = getCallbacks();
    const elements = r.map((c) => c.element);
    expect(new Set(elements).size).toBe(elements.length);
  });
});
