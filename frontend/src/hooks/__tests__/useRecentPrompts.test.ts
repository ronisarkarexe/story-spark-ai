/* eslint-disable */
/**
 * useRecentPrompts.test.ts
 * Unit tests for the useRecentPrompts React hook.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useRecentPrompts from "../useRecentPrompts";

const STORAGE_KEY = "story_spark_recent_prompts";

beforeEach(() => {
  localStorage.clear();
});

describe("useRecentPrompts", () => {
  it("returns empty array when localStorage is empty", () => {
    const { result } = renderHook(() => useRecentPrompts());
    expect(result.current.recentPrompts).toEqual([]);
  });

  it("loads existing prompts from localStorage on mount", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
      { id: "p2", prompt: "Continue the tale", timestamp: 2000, useCount: 2, isFavorite: true },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    expect(result.current.recentPrompts).toHaveLength(2);
    expect(result.current.recentPrompts[0].prompt).toBe("Write a story");
  });

  it("addPrompt appends a new prompt to the list", () => {
    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.addPrompt("A dragon appears");
    });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].prompt).toBe("A dragon appears");
    expect(result.current.recentPrompts[0].useCount).toBe(1);
  });

  it("addPrompt with duplicate prompt moves it to top and increments useCount", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.addPrompt("Write a story");
    });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].prompt).toBe("Write a story");
    expect(result.current.recentPrompts[0].useCount).toBe(2);
  });

  it("addPrompt trims whitespace before storing", () => {
    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.addPrompt("  A dragon appears  ");
    });

    expect(result.current.recentPrompts[0].prompt).toBe("A dragon appears");
  });

  it("addPrompt ignores empty or whitespace-only prompts", () => {
    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.addPrompt("");
      result.current.addPrompt("   ");
    });

    expect(result.current.recentPrompts).toHaveLength(0);
  });

  it("recordPromptUse increments useCount for the matching prompt", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.recordPromptUse("p1");
    });

    expect(result.current.recentPrompts[0].useCount).toBe(2);
    expect(result.current.recentPrompts[0].lastUsedAt).toBeGreaterThan(1000);
  });

  it("toggleFavorite toggles isFavorite for the matching prompt", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.toggleFavorite("p1");
    });

    expect(result.current.recentPrompts[0].isFavorite).toBe(true);

    act(() => {
      result.current.toggleFavorite("p1");
    });

    expect(result.current.recentPrompts[0].isFavorite).toBe(false);
  });

  it("removePrompt removes the specific prompt", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
      { id: "p2", prompt: "Continue the tale", timestamp: 2000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.removePrompt("p1");
    });

    expect(result.current.recentPrompts).toHaveLength(1);
    expect(result.current.recentPrompts[0].id).toBe("p2");
  });

  it("clearAll removes all prompts from state and localStorage", () => {
    const stored = [
      { id: "p1", prompt: "Write a story", timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useRecentPrompts());

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.recentPrompts).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("capped at MAX_PROMPTS (20) after adding many prompts", () => {
    const { result } = renderHook(() => useRecentPrompts());

    // Add 25 prompts
    for (let i = 0; i < 25; i++) {
      act(() => {
        result.current.addPrompt(`Prompt ${i}`);
      });
    }

    expect(result.current.recentPrompts).toHaveLength(20);
    expect(result.current.recentPrompts[0].prompt).toBe("Prompt 24");
  });
});
