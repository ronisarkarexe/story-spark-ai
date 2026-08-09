export type SettingCategory =
  | "Location"
  | "Time Period"
  | "Environment"
  | "World Building";

export interface StorySetting {
  id: number;
  title: string;
  category: SettingCategory;
  description: string;
  reference: string;
}

export function analyzeStorySettings(
  story: string
): StorySetting[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Ancient Kingdom",
      category: "Location",
      description:
        "The primary kingdom where most events unfold.",
      reference: "Chapter 1",
    },
    {
      id: 2,
      title: "Medieval Era",
      category: "Time Period",
      description:
        "The story takes place in a medieval-inspired age.",
      reference: "Chapter 2",
    },
    {
      id: 3,
      title: "Dark Forest",
      category: "Environment",
      description:
        "A mysterious forest filled with magical creatures.",
      reference: "Chapter 4",
    },
    {
      id: 4,
      title: "Magic System",
      category: "World Building",
      description:
        "Magic is powered through ancient elemental crystals.",
      reference: "Chapter 5",
    },
  ];
}

export function refreshStorySettings(
  story: string
) {
  return analyzeStorySettings(story);
}