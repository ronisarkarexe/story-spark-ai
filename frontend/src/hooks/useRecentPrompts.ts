import { useState, useEffect, useCallback } from "react";

export interface IRecentPrompt {
  id: string;
  prompt: string;
  timestamp: number;
  lastUsedAt?: number;
  useCount?: number;
  isFavorite?: boolean;
}

const STORAGE_KEY = "story_spark_recent_prompts";
const MAX_PROMPTS = 20;

const normalizePromptEntry = (entry: IRecentPrompt): IRecentPrompt => ({
  id: entry.id || `${Date.now()}-${Math.random()}`,
  prompt: entry.prompt,
  timestamp: entry.timestamp || Date.now(),
  lastUsedAt: entry.lastUsedAt || entry.timestamp || Date.now(),
  useCount: entry.useCount || 1,
  isFavorite: Boolean(entry.isFavorite),
});

const persistPrompts = (prompts: IRecentPrompt[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      // Prune oldest non-favorite entries and retry once
      const pruned = prompts
        .filter((p) => p.isFavorite)
        .concat(prompts.filter((p) => !p.isFavorite).slice(0, 5));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      } catch {
        // Storage critically full — skip persistence silently
      }
    }
  }
};

export const useRecentPrompts = () => {
  const [recentPrompts, setRecentPrompts] = useState<IRecentPrompt[]>([]);

  // Load prompts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as IRecentPrompt[];
        const normalized = parsed
          .filter((entry) => entry?.prompt?.trim())
          .map(normalizePromptEntry)
          .slice(0, MAX_PROMPTS);
        setRecentPrompts(normalized);
        persistPrompts(normalized);
      } catch {
        // If parsing fails, start fresh
        setRecentPrompts([]);
      }
    }
  }, []);

  // Add a new prompt to history
  const addPrompt = useCallback((prompt: string) => {
    if (!prompt.trim()) return;

    setRecentPrompts((prev) => {
      // Remove duplicates - if this prompt already exists, move it to top
      const existingPrompt = prev.find((p) => p.prompt === prompt.trim());
      const filtered = prev.filter((p) => p.prompt !== prompt.trim());

      // Create new prompt entry
      const newPrompt: IRecentPrompt = {
        id: existingPrompt?.id || `${Date.now()}-${Math.random()}`,
        prompt: prompt.trim(),
        timestamp: existingPrompt?.timestamp || Date.now(),
        lastUsedAt: Date.now(),
        useCount: (existingPrompt?.useCount || 0) + 1,
        isFavorite: Boolean(existingPrompt?.isFavorite),
      };

      // Add to the beginning and cap at MAX_PROMPTS
      const updated = [newPrompt, ...filtered].slice(0, MAX_PROMPTS);

      // Persist to localStorage
      persistPrompts(updated);

      return updated;
    });
  }, []);

  const recordPromptUse = useCallback((id: string) => {
    setRecentPrompts((prev) => {
      const updated = prev.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              lastUsedAt: Date.now(),
              useCount: (prompt.useCount || 0) + 1,
            }
          : prompt
      );
      persistPrompts(updated);
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setRecentPrompts((prev) => {
      const updated = prev.map((prompt) =>
        prompt.id === id
          ? { ...prompt, isFavorite: !prompt.isFavorite }
          : prompt
      );
      persistPrompts(updated);
      return updated;
    });
  }, []);

  // Remove a specific prompt
  const removePrompt = useCallback((id: string) => {
    setRecentPrompts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persistPrompts(updated);
      return updated;
    });
  }, []);

  // Clear all prompts
  const clearAll = useCallback(() => {
    setRecentPrompts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentPrompts,
    addPrompt,
    recordPromptUse,
    toggleFavorite,
    removePrompt,
    clearAll,
  };
};
