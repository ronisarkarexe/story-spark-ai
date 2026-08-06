export const saveReadingPosition = (
  storyId: string,
  position: number
) => {
  if (typeof window === "undefined" || !storyId) return;
  const safePosition = Math.max(0, isNaN(position) ? 0 : position);
  try {
    localStorage.setItem(`reading-${storyId}`, safePosition.toString());
  } catch {
    // Ignore storage errors in private browsing
  }
};

export const getReadingPosition = (
  storyId: string
): number => {
  if (typeof window === "undefined" || !storyId) return 0;
  try {
    const value = localStorage.getItem(`reading-${storyId}`);
    return value ? Math.max(0, Number(value) || 0) : 0;
  } catch {
    return 0;
  }
};

export const resetReadingPosition = (
  storyId: string
) => {
  if (typeof window === "undefined" || !storyId) return;
  try {
    localStorage.removeItem(`reading-${storyId}`);
  } catch {
    // Ignore storage errors
  }
};