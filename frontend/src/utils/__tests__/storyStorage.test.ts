import { clearStorySession } from "../storyStorage";

describe("storyStorage", () => {
  describe("clearStorySession", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("calls localStorage.removeItem with 'storySession' in browser", async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

      clearStorySession();

      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy).toHaveBeenCalledWith("storySession");
    });

    it("does not throw in SSR environment", async () => {
      // Simulate SSR: window is undefined
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;

      expect(() => clearStorySession()).not.toThrow();

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = originalWindow;
    });

    it("is callable multiple times without error", () => {
      expect(() => clearStorySession()).not.toThrow();
      expect(() => clearStorySession()).not.toThrow();
      expect(() => clearStorySession()).not.toThrow();
    });

    it("always calls removeItem for 'storySession' key", async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

      clearStorySession();

      const calls = removeItemSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[calls.length - 1][0]).toBe("storySession");
    });
  });
});
