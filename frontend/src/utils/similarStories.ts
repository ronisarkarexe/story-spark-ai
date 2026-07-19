export interface Story {
  id: string;
  title: string;
  genre: string;
  tags: string[];
  keywords: string[];
  coverImage?: string;
}

export const hasSameGenre = (
  current: Story,
  other: Story
) => {
  return current.genre === other.genre;
};

export const countMatchingTags = (
  current: Story,
  other: Story
) => {
  return other.tags.filter((tag) =>
    current.tags.includes(tag)
  ).length;
};

export const countMatchingKeywords = (
  current: Story,
  other: Story
) => {
  return other.keywords.filter((keyword) =>
    current.keywords.includes(keyword)
  ).length;
};

export const calculateSimilarity = (
  current: Story,
  other: Story
) => {
  let score = 0;

  if (hasSameGenre(current, other)) score += 5;

  score += countMatchingTags(current, other) * 2;

  score += countMatchingKeywords(current, other);

  return score;
};

export const getSimilarStories = (
  currentStory: Story,
  stories: Story[],
  limit = 4
) => {
  return stories
    .filter((story) => story.id !== currentStory.id)
    .map((story) => ({
      ...story,
      similarity: calculateSimilarity(currentStory, story),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};