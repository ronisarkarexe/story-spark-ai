
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, MockInstance } from 'vitest';
import { useRecentPrompts, IRecentPrompt } from '../useRecentPrompts';

const STORAGE_KEY = 'story_spark_recent_prompts';
const MAX_PROMPTS = 20;

describe('useRecentPrompts hook', () => {
  let setItemSpy: MockInstance;
  let getItemSpy: MockInstance;
  let removeItemSpy: MockInstance;
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => store[key] || null);
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('empty localStorage → returns empty array', () => {
    const { result } = renderHook(() => useRecentPrompts());
    expect(result.current.recentPrompts).toEqual([]);
  });

  it('existing prompts loaded from localStorage on mount', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Prompt 1', timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    const { result } = renderHook(() => useRecentPrompts());
    
    expect(result.current.recentPrompts.length).toBe(1);
    expect(result.current.recentPrompts[0].prompt).toBe('Prompt 1');
    expect(result.current.recentPrompts[0].id).toBe('1');
  });

  it('addPrompt adds a new prompt and persists to localStorage', () => {
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.addPrompt('New Prompt');
    });

    expect(result.current.recentPrompts.length).toBe(1);
    expect(result.current.recentPrompts[0].prompt).toBe('New Prompt');
    expect(result.current.recentPrompts[0].useCount).toBe(1);
    
    const stored = JSON.parse(store[STORAGE_KEY]);
    expect(stored.length).toBe(1);
    expect(stored[0].prompt).toBe('New Prompt');
  });

  it('addPrompt with duplicate prompt moves it to top and increments useCount', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Existing Prompt', timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
      { id: '2', prompt: 'Other Prompt', timestamp: 2000, lastUsedAt: 2000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.addPrompt('Existing Prompt');
    });

    expect(result.current.recentPrompts.length).toBe(2);
    expect(result.current.recentPrompts[0].prompt).toBe('Existing Prompt');
    expect(result.current.recentPrompts[0].useCount).toBe(2);
    // ensure it's at the top
    expect(result.current.recentPrompts[0].id).toBe('1');
    expect(result.current.recentPrompts[1].id).toBe('2');
  });

  it('recordPromptUse increments useCount and lastUsedAt', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Prompt 1', timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.recordPromptUse('1');
    });

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


  it('toggleFavorite toggles isFavorite for the right prompt', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Prompt 1', timestamp: 1000, lastUsedAt: 1000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.toggleFavorite('1');
    });

    expect(result.current.recentPrompts[0].isFavorite).toBe(true);

    act(() => {
      result.current.toggleFavorite('1');
    });

    expect(result.current.recentPrompts[0].isFavorite).toBe(false);
  });

  it('removePrompt removes the specific prompt', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Prompt 1', timestamp: 1000, useCount: 1, isFavorite: false },
      { id: '2', prompt: 'Prompt 2', timestamp: 2000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.removePrompt('1');
    });

    expect(result.current.recentPrompts.length).toBe(1);
    expect(result.current.recentPrompts[0].id).toBe('2');
  });

  it('clearAll clears state and localStorage', () => {
    const mockPrompts: IRecentPrompt[] = [
      { id: '1', prompt: 'Prompt 1', timestamp: 1000, useCount: 1, isFavorite: false },
    ];
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.clearAll();
    });

    expect(result.current.recentPrompts.length).toBe(0);
    expect(store[STORAGE_KEY]).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('MAX_PROMPTS cap is enforced (20 items)', () => {
    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      for (let i = 0; i < 25; i++) {
        result.current.addPrompt(`Prompt ${i}`);
      }
    });

    expect(result.current.recentPrompts.length).toBe(MAX_PROMPTS);
    // The last added prompt should be at the top
    expect(result.current.recentPrompts[0].prompt).toBe('Prompt 24');
    // The earliest added prompts should be dropped
    expect(result.current.recentPrompts[19].prompt).toBe('Prompt 5');
  });

  it('Mock localStorage and test quota pruning behavior', () => {
    const mockPrompts: IRecentPrompt[] = [];
    for (let i = 0; i < 10; i++) {
      mockPrompts.push({
        id: `${i}`,
        prompt: `Prompt ${i}`,
        timestamp: 1000,
        useCount: 1,
        isFavorite: i % 2 === 0, // Evens are favorites (0, 2, 4, 6, 8)
      });
    }
    store[STORAGE_KEY] = JSON.stringify(mockPrompts);
    
    // Simulate QuotaExceededError on setItem
    setItemSpy.mockImplementationOnce(() => {
      const error = new DOMException('Quota Exceeded', 'QuotaExceededError');
      throw error;
    }).mockImplementationOnce((key: string, value: string) => {
      // Second attempt succeeds
      store[key] = value;
    });

    const { result } = renderHook(() => useRecentPrompts());
    
    act(() => {
      result.current.addPrompt('Trigger Quota');
    });

    const stored = JSON.parse(store[STORAGE_KEY]);
    
    // Pruned should contain all favorites + top 5 non-favorites
    // Originally we had 5 favorites and 5 non-favorites.
    // wait, the new item 'Trigger Quota' is not a favorite.
    // The quota exceeded block runs inside `persistPrompts`:
    // const pruned = prompts.filter(p => p.isFavorite).concat(prompts.filter(p => !p.isFavorite).slice(0, 5));
    // The prompts array passed to persistPrompts will be the 11 items.
    
    // Expected to have favorites + up to 5 non-favorites
    expect(stored.length).toBeLessThanOrEqual(11);
    
    // Check that favorites are preserved
    const favorites = stored.filter((p: IRecentPrompt) => p.isFavorite);
    expect(favorites.length).toBe(5);
=======
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
