export type StoryTone =
  | "Humorous"
  | "Dark"
  | "Inspirational"
  | "Suspenseful"
  | "Emotional"
  | "Dramatic";

export interface TonePreset {
  id: string;
  name: StoryTone;
  description: string;
}

export const tonePresets: TonePreset[] = [
  {
    id: "humorous",
    name: "Humorous",
    description: "Light-hearted and funny storytelling.",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Serious, mysterious, and intense.",
  },
  {
    id: "inspirational",
    name: "Inspirational",
    description: "Motivating and uplifting.",
  },
  {
    id: "suspenseful",
    name: "Suspenseful",
    description: "Creates tension and excitement.",
  },
  {
    id: "emotional",
    name: "Emotional",
    description: "Focuses on feelings and relationships.",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    description: "Powerful conflicts and emotions.",
  },
];

export const buildTonePrompt = (
  tone: StoryTone,
  story: string
) => {
  return `Rewrite the following story using a ${tone} tone:\n\n${story}`;
};

export const regenerateWithTone = (
  tone: StoryTone,
  story: string
) => {
  return buildTonePrompt(tone, story);
};