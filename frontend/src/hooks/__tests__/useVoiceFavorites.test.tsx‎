/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVoiceFavorites } from "../useVoiceFavorites";

const FAVORITES_STORAGE_KEY = "storysparkAI_favoriteVoices";

// Mock localStorage
const storage: Record<string, string> = {};

global.localStorage = {
  getItem: vi.fn((key: string) => storage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  }),
  key: vi.fn(),
  get length() {
    return Object.keys(storage).length;
  },
  configurable: true,
} as unknown as Storage;

describe("useVoiceFavorites", () => {
  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty Set and isLoaded true", () => {
    const { result } = renderHook(() => useVoiceFavorites());
    expect(result.current.favoriteVoiceIds).toBeInstanceOf(Set);
    expect(result.current.favoriteVoiceIds.size).toBe(0);
  });

  it("loads favorites from localStorage on mount", () => {
    storage[FAVORITES_STORAGE_KEY] = JSON.stringify(["voice-1", "voice-2"]);

    const { result } = renderHook(() => useVoiceFavorites());

    expect(result.current.favoriteVoiceIds.size).toBe(2);
    expect(result.current.favoriteVoiceIds.has("voice-1")).toBe(true);
    expect(result.current.favoriteVoiceIds.has("voice-2")).toBe(true);
  });

  it("handles invalid localStorage JSON gracefully", () => {
    storage[FAVORITES_STORAGE_KEY] = "not valid json";

    const { result } = renderHook(() => useVoiceFavorites());

    expect(result.current.favoriteVoiceIds.size).toBe(0);
  });

  it("isFavorite returns true for a favorited voice", () => {
    storage[FAVORITES_STORAGE_KEY] = JSON.stringify(["voice-1"]);

    const { result } = renderHook(() => useVoiceFavorites());

    expect(result.current.isFavorite("voice-1")).toBe(true);
    expect(result.current.isFavorite("voice-2")).toBe(false);
  });

  it("toggleFavorite adds a voice that is not favorited", () => {
    const { result } = renderHook(() => useVoiceFavorites());

    act(() => {
      result.current.toggleFavorite("voice-3");
    });

    expect(result.current.favoriteVoiceIds.has("voice-3")).toBe(true);
    expect(result.current.isFavorite("voice-3")).toBe(true);
  });

  it("toggleFavorite removes a voice that is already favorited", () => {
    storage[FAVORITES_STORAGE_KEY] = JSON.stringify(["voice-1"]);

    const { result } = renderHook(() => useVoiceFavorites());

    act(() => {
      result.current.toggleFavorite("voice-1");
    });

    expect(result.current.favoriteVoiceIds.has("voice-1")).toBe(false);
    expect(result.current.isFavorite("voice-1")).toBe(false);
  });

  it("clearFavorites removes all favorites", () => {
    storage[FAVORITES_STORAGE_KEY] = JSON.stringify(["voice-1", "voice-2"]);

    const { result } = renderHook(() => useVoiceFavorites());

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favoriteVoiceIds.size).toBe(0);
    expect(result.current.isFavorite("voice-1")).toBe(false);
    expect(result.current.isFavorite("voice-2")).toBe(false);
  });

  it("favorites persist to localStorage via setItem", () => {
    const { result } = renderHook(() => useVoiceFavorites());

    act(() => {
      result.current.toggleFavorite("voice-x");
    });

    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      FAVORITES_STORAGE_KEY,
      expect.any(String)
    );
  });

  it("toggleFavorite twice returns to original state", () => {
    const { result } = renderHook(() => useVoiceFavorites());

    act(() => {
      result.current.toggleFavorite("voice-y");
    });
    expect(result.current.isFavorite("voice-y")).toBe(true);

    act(() => {
      result.current.toggleFavorite("voice-y");
    });
    expect(result.current.isFavorite("voice-y")).toBe(false);
  });
});
