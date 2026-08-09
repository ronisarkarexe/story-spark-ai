export interface StoryStyle {
  id: string;
  name:
    | "Classic Novel"
    | "Modern Fiction"
    | "Cinematic"
    | "Fairy Tale"
    | "Thriller"
    | "Young Adult"
    | "Poetic";

  description: string;
}

export const storyStyles: StoryStyle[] = [
  {
    id: "classic",
    name: "Classic Novel",
    description: "Traditional storytelling style",
  },
  {
    id: "modern",
    name: "Modern Fiction",
    description: "Contemporary narration",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like storytelling",
  },
  {
    id: "fairy",
    name: "Fairy Tale",
    description: "Magical and whimsical",
  },
  {
    id: "thriller",
    name: "Thriller",
    description: "Fast-paced suspense",
  },
  {
    id: "youngadult",
    name: "Young Adult",
    description: "Relatable coming-of-age style",
  },
  {
    id: "poetic",
    name: "Poetic",
    description: "Expressive and lyrical",
  },
];

export const getStylePrompt = (
  style: StoryStyle
) => {
  return `Generate the story in ${style.name} style.`;
};

export const regenerateWithStyle = (
  style: StoryStyle
) => {
  return getStylePrompt(style);
};