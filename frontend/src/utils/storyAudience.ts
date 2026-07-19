export type StoryAudience =
  | "Children"
  | "Teenagers"
  | "Young Adults"
  | "Adults"
  | "General Audience";

export interface AudienceOption {
  id: string;
  name: StoryAudience;
  description: string;
}

export const audienceOptions: AudienceOption[] = [
  {
    id: "children",
    name: "Children",
    description: "Simple vocabulary and family-friendly stories.",
  },
  {
    id: "teenagers",
    name: "Teenagers",
    description: "Adventures, friendships, and relatable themes.",
  },
  {
    id: "young-adults",
    name: "Young Adults",
    description: "Modern storytelling with emotional depth.",
  },
  {
    id: "adults",
    name: "Adults",
    description: "Complex plots and mature themes.",
  },
  {
    id: "general",
    name: "General Audience",
    description: "Suitable for readers of all ages.",
  },
];

export const buildAudiencePrompt = (
  audience: StoryAudience,
  prompt: string
) => {
  return `
Generate a story for ${audience}.

Requirements:
- Adapt vocabulary.
- Adjust complexity.
- Keep the original idea.

Prompt:
${prompt}
`;
};

export const generateAudienceStory = (
  audience: StoryAudience,
  prompt: string
) => buildAudiencePrompt(audience, prompt);