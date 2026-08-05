export const saveReadingPosition = (
  storyId: string,
  position: number
) => {
  localStorage.setItem(
    `reading-${storyId}`,
    position.toString()
  );
};

export const getReadingPosition = (
  storyId: string
): number => {
  const value = localStorage.getItem(`reading-${storyId}`);
  return value ? Number(value) : 0;
};

export const resetReadingPosition = (
  storyId: string
) => {
  localStorage.removeItem(`reading-${storyId}`);
};