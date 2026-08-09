// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadFocusModeSettings, saveFocusModeSettings, toggleFocusMode, defaultSettings } from "../storyFocusMode";
import type { FocusModeSettings } from "../storyFocusMode";

const STORAGE_KEY = "story-focus-mode-settings";

describe("storyFocusMode", () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  describe("loadFocusModeSettings", () => {
    it("returns default settings when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = loadFocusModeSettings();

      expect(result).toEqual(defaultSettings);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it("returns parsed settings when localStorage has valid data", () => {
      const stored: FocusModeSettings = {
        enabled: true,
        fontSize: 24,
        lineSpacing: 2.0,
        contentWidth: 900,
        theme: "light",
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(stored));

      const result = loadFocusModeSettings();

      expect(result).toEqual(stored);
    });

    it("returns default settings when localStorage data is invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("not valid json {{{");

      const result = loadFocusModeSettings();

      expect(result).toEqual(defaultSettings);
    });
  });

  describe("saveFocusModeSettings", () => {
    it("stores settings correctly in localStorage", () => {
      const settings: FocusModeSettings = {
        enabled: true,
        fontSize: 20,
        lineSpacing: 1.6,
        contentWidth: 800,
        theme: "dark",
      };

      saveFocusModeSettings(settings);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    });
  });

  describe("toggleFocusMode", () => {
    it("toggles enabled from false to true", () => {
      const settings: FocusModeSettings = { ...defaultSettings, enabled: false };

      const result = toggleFocusMode(settings);

      expect(result.enabled).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("toggles enabled from true to false", () => {
      const settings: FocusModeSettings = { ...defaultSettings, enabled: true };

      const result = toggleFocusMode(settings);

      expect(result.enabled).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("preserves other settings when toggling", () => {
      const settings: FocusModeSettings = {
        enabled: false,
        fontSize: 22,
        lineSpacing: 2.0,
        contentWidth: 850,
        theme: "light",
      };

      const result = toggleFocusMode(settings);

      expect(result.fontSize).toBe(22);
      expect(result.lineSpacing).toBe(2.0);
      expect(result.contentWidth).toBe(850);
      expect(result.theme).toBe("light");
      expect(result.enabled).toBe(true);
    });
  });
});
