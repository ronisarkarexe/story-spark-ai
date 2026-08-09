import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecentPrompts } from "../useRecentPrompts";

const STORAGE_KEY = "story_spark_recent_prompts";

describe("useRecentPrompts hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderUseRecentPrompts = () => {
    return renderHook(() => useRecentPrompts());
  };

  it("returns empty recentPrompts on initial render", () => {
    const { result } = renderUseRecentPrompts();
    expect(result.current.recentPrompts).toEqual([]);
  });

  it("loads prompts from localStorage on mount", () => {
    const stored = [
      { id: "1", prompt: "test prompt", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].prompt).toBe("test prompt");
  });

  it("addPrompt does nothing for empty string", () => {
    const { result } = renderUseRecentPrompts();
    act(() => { result.current.addPrompt(""); });
    expect(result.current.recentPrompts).toEqual([]);
  });

  it("addPrompt adds a new prompt to the beginning of the list", () => {
    const { result } = renderUseRecentPrompts();
    act(() => { result.current.addPrompt("hello world"); });
    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].prompt).toBe("hello world");
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("addPrompt deduplicates existing prompts by moving to top", () => {
    const stored = [
      { id: "1", prompt: "existing prompt", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    act(() => { result.current.addPrompt("existing prompt"); });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].useCount).toBe(2);
    expect(result.current.recentPrompts[0].lastUsedAt).toBeGreaterThan(1000);
  });

  it("addPrompt caps the list at MAX_PROMPTS (20)", () => {
    const { result } = renderUseRecentPrompts();

    for (let i = 0; i < 25; i++) {
      act(() => { result.current.addPrompt(`prompt ${i}`); });
    }

    expect(result.current.recentPrompts).toHaveLength(20);
    expect(result.current.recentPrompts[0].prompt).toBe("prompt 24");
    expect(result.current.recentPrompts[19].prompt).toBe("prompt 5");
  });

  it("recordPromptUse increments useCount and updates lastUsedAt", () => {
    const stored = [
      { id: "id-1", prompt: "test", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    act(() => { result.current.recordPromptUse("id-1"); });

    expect(result.current.recentPrompts[0].useCount).toBe(2);
    expect(result.current.recentPrompts[0].lastUsedAt).toBeGreaterThan(1000);
  });

  it("toggleFavorite toggles the isFavorite flag", () => {
    const stored = [
      { id: "id-1", prompt: "test", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    act(() => { result.current.toggleFavorite("id-1"); });
    expect(result.current.recentPrompts[0].isFavorite).toBe(true);

    act(() => { result.current.toggleFavorite("id-1"); });
    expect(result.current.recentPrompts[0].isFavorite).toBe(false);
  });

  it("removePrompt removes a specific prompt by id", () => {
    const stored = [
      { id: "id-1", prompt: "test 1", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
      { id: "id-2", prompt: "test 2", timestamp: 2000, lastUsedAt: 2000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    act(() => { result.current.removePrompt("id-1"); });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].id).toBe("id-2");
  });

  it("clearAll removes all prompts and clears localStorage", () => {
    const stored = [
      { id: "id-1", prompt: "test", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    act(() => { result.current.clearAll(); });

    expect(result.current.recentPrompts).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("normalizes malformed stored entries gracefully", () => {
    const stored = [
      null,
      { prompt: "valid prompt" },
      undefined,
      { id: "id-1", timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderUseRecentPrompts();
    act(() => { vi.runAllTimers(); });

    expect(result.current.recentPrompts).toHaveLength(1);
  });

  it("trims whitespace from added prompts", () => {
    const { result } = renderUseRecentPrompts();
    act(() => { result.current.addPrompt("  hello world  "); });
    expect(result.current.recentPrompts[0].prompt).toBe("hello world");
  });

  it("addPrompt persists to localStorage", () => {
    const { result } = renderUseRecentPrompts();
    act(() => { result.current.addPrompt("persisted prompt"); });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].prompt).toBe("persisted prompt");
  });
});
