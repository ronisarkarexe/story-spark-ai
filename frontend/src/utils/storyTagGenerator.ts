export interface StoryTag {
  id: number;
  name: string;
  category: "Genre" | "Theme" | "Emotion" | "Character";
}

const tagDatabase = {
  Fantasy: [
    "Magic",
    "Kingdom",
    "Adventure",
    "Dragons",
    "Hero",
  ],
  Mystery: [
    "Crime",
    "Detective",
    "Suspense",
    "Investigation",
  ],
  Romance: [
    "Love",
    "Friendship",
    "Heartbreak",
    "Soulmate",
  ],
};

export function generateTags(
  story: string
): StoryTag[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      name: "Adventure",
      category: "Genre",
    },
    {
      id: 2,
      name: "Magic",
      category: "Theme",
    },
    {
      id: 3,
      name: "Hope",
      category: "Emotion",
    },
    {
      id: 4,
      name: "Hero",
      category: "Character",
    },
  ];
}

export function addTag(
  tags: StoryTag[],
  tag: StoryTag
) {
  return [...tags, tag];
}

export function removeTag(
  tags: StoryTag[],
  id: number
) {
  return tags.filter(tag => tag.id !== id);
}