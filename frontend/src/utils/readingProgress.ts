export const saveReadingPosition = (
  storyId: string,
  position: number
) => {
  if (!storyId || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`reading-${storyId}`, position.toString());
  } catch {
    // Ignore storage quota error or restriction
  }
};

export const getReadingPosition = (
  storyId: string
): number => {
  if (!storyId || typeof window === 'undefined') return 0;
  try {
    const value = localStorage.getItem(`reading-${storyId}`);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
};

export const resetReadingPosition = (
  storyId: string
) => {
  if (!storyId || typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`reading-${storyId}`);
  } catch {
    // Ignore storage restriction
  }
};