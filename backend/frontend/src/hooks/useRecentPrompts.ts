import { useState, useEffect, useCallback } from "react";

export interface IRecentPrompt {
  id: string;
  prompt: string;
  timestamp: number;
}

const STORAGE_KEY = "story_spark_recent_prompts";
const MAX_PROMPTS = 5;

export const useRecentPrompts = () => {
  const [recentPrompts, setRecentPrompts] = useState<IRecentPrompt[]>([]);

  // Load prompts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentPrompts(JSON.parse(stored));
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
      const filtered = prev.filter((p) => p.prompt !== prompt);

      // Create new prompt entry
      const newPrompt: IRecentPrompt = {
        id: `${Date.now()}-${Math.random()}`,
        prompt: prompt.trim(),
        timestamp: Date.now(),
      };

      // Add to the beginning and cap at MAX_PROMPTS
      const updated = [newPrompt, ...filtered].slice(0, MAX_PROMPTS);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  }, []);

  // Remove a specific prompt
  const removePrompt = useCallback((id: string) => {
    setRecentPrompts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    removePrompt,
    clearAll,
  };
};
