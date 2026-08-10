// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  saveDraft,
  getRecoveredDraft,
  discardRecoveredDraft,
} from "../storySessionRecovery";

describe("storySessionRecovery - SSR guards", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveDraft persists and getRecoveredDraft reads it back", () => {
    const draft = saveDraft("hello world");
    expect(draft).not.toBeNull();
    const recovered = getRecoveredDraft();
    expect(recovered?.content).toBe("hello world");
    expect(typeof recovered?.savedAt).toBe("string");
  });

  it("discardRecoveredDraft clears the stored draft", () => {
    saveDraft("to be discarded");
    discardRecoveredDraft();
    expect(getRecoveredDraft()).toBeNull();
  });

  it("getRecoveredDraft returns null when nothing is stored", () => {
    expect(getRecoveredDraft()).toBeNull();
  });

  it("returns null when malformed JSON is stored", () => {
    localStorage.setItem("story-session-recovery", "{not json");
    expect(getRecoveredDraft()).toBeNull();
  });

  it("does not throw during SSR (no window/localStorage)", () => {
    const originalWindow = globalThis.window;
    // Simulate SSR: window undefined.
    // @ts-expect-error - intentionally removing window for SSR simulation
    delete globalThis.window;
    try {
      const draft = saveDraft("ssr content");
      expect(draft).not.toBeNull();
      expect(draft?.content).toBe("ssr content");
      expect(getRecoveredDraft()).toBeNull();
      expect(() => discardRecoveredDraft()).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
