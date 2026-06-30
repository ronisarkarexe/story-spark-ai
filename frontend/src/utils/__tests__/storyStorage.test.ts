import { describe, it, expect, vi, beforeEach } from "vitest";
import { clearStorySession } from "../storyStorage";

describe("storyStorage", () => {
  describe("clearStorySession", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.restoreAllMocks();
    });

    it("calls localStorage.removeItem with 'storySession' when in browser", () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
      clearStorySession();
      expect(removeItemSpy).toHaveBeenCalledWith("storySession");
    });

    it("does not throw when called in SSR (typeof window === 'undefined')", () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - simulating SSR environment
      delete globalThis.window;
      expect(() => clearStorySession()).not.toThrow();
      globalThis.window = originalWindow;
    });

    it("is callable multiple times without error", () => {
      expect(() => {
        clearStorySession();
        clearStorySession();
        clearStorySession();
      }).not.toThrow();
    });

    it("integration with localStorage mock: verify removeItem is called with correct key", () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
      clearStorySession();
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy).toHaveBeenCalledWith("storySession");
    });
  });
});
