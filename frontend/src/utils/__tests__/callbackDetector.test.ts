import { describe, it, expect } from "vitest";
import { getCallbacks } from "../callbackDetector";

describe("getCallbacks", () => {
  it("returns a non-empty list of callbacks", () => {
    const callbacks = getCallbacks();
    expect(callbacks.length).toBeGreaterThan(0);
  });

  it("returns callbacks with the expected shape", () => {
    const callbacks = getCallbacks();
    const item = callbacks[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("element");
    expect(item).toHaveProperty("firstAppearance");
    expect(item).toHaveProperty("callback");
    expect(item).toHaveProperty("suggestion");
  });

  it("assigns sequential ids", () => {
    const callbacks = getCallbacks();
    callbacks.forEach((item, index) => {
      expect(item.id).toBe(index + 1);
    });
  });

  it("provides a non-empty element for every callback", () => {
    const callbacks = getCallbacks();
    for (const item of callbacks) {
      expect(item.element.length).toBeGreaterThan(0);
    }
  });

  it("provides a non-empty suggestion for every callback", () => {
    const callbacks = getCallbacks();
    for (const item of callbacks) {
      expect(item.suggestion.length).toBeGreaterThan(0);
    }
  });
});
