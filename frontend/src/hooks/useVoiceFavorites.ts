import { useCallback, useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "storysparkAI_favoriteVoices";

export interface UseVoiceFavoritesResult {
  /** Set of favorite voice IDs */
  favoriteVoiceIds: Set<string>;
  /** Check if a voice is favorited */
  isFavorite: (voiceId: string) => boolean;
  /** Toggle favorite status for a voice */
  toggleFavorite: (voiceId: string) => void;
  /** Clear all favorites */
  clearFavorites: () => void;
}

/**
 * Hook to manage voice favorites with persistent localStorage storage.
 * Allows users to mark and save their preferred voices.
 */
export const useVoiceFavorites = (): UseVoiceFavoritesResult => {
  const [favoriteVoiceIds, setFavoriteVoiceIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setFavoriteVoiceIds(new Set(parsed));
      }
    } catch (error) {
      console.error("Failed to load favorite voices from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const toStore = Array.from(favoriteVoiceIds);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error("Failed to save favorite voices to localStorage:", error);
    }
  }, [favoriteVoiceIds, isLoaded]);

  const isFavorite = useCallback(
    (voiceId: string) => {
      return favoriteVoiceIds.has(voiceId);
    },
    [favoriteVoiceIds],
  );

  const toggleFavorite = useCallback((voiceId: string) => {
    setFavoriteVoiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(voiceId)) {
        next.delete(voiceId);
      } else {
        next.add(voiceId);
      }
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteVoiceIds(new Set());
  }, []);

  return {
    favoriteVoiceIds,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};

export default useVoiceFavorites;
