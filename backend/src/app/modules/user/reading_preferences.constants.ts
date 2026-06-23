export const READING_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Thriller",
  "Mystery",
  "Horror",
  "Adventure",
  "Drama",
  "Historical Fiction",
  "Young Adult",
  "Comedy",
  "Action",
  "Crime",
  "Biography",
  "Poetry",
] as const;

export const READING_MOODS = [
  "Funny",
  "Dark",
  "Inspiring",
  "Romantic",
  "Wholesome",
  "Emotional",
  "Suspenseful",
  "Thought Provoking",
  "Educational",
  "Heartwarming",
  "Adventurous",
  "Action Packed",
  "Relaxing",
] as const;

export const PREFERRED_LENGTHS = ["short", "medium", "long"] as const;

export type ReadingGenre = (typeof READING_GENRES)[number];
export type ReadingMood = (typeof READING_MOODS)[number];
export type PreferredLength = (typeof PREFERRED_LENGTHS)[number];
