const READING_POSITION_PREFIX = "reading-";

const positionKey = (storyId: string): string =>
  `${READING_POSITION_PREFIX}${storyId}`;

export const saveReadingPosition = (
  storyId: string,
  position: number
) => {
  localStorage.setItem(
    positionKey(storyId),
    position.toString()
  );
};

export const getReadingPosition = (
  storyId: string
): number => {
  const value = localStorage.getItem(positionKey(storyId));
  return value ? Number(value) : 0;
};

export const resetReadingPosition = (
  storyId: string
) => {
  localStorage.removeItem(positionKey(storyId));
};