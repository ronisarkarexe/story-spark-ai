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

export const PREFERRED_LENGTH_OPTIONS = [
  {
    value: "short" as const,
    label: "Short",
    description: "Under 5 minutes",
  },
  {
    value: "medium" as const,
    label: "Medium",
    description: "5–15 minutes",
  },
  {
    value: "long" as const,
    label: "Long",
    description: "15+ minutes",
  },
];

export type PreferredLength = (typeof PREFERRED_LENGTH_OPTIONS)[number]["value"];

export type ReadingPreferencesPayload = {
  genres: string[];
  preferredLength: PreferredLength;
  moods: string[];
};
