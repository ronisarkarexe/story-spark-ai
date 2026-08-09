export type StoryPerspective =
  | "First Person"
  | "Second Person"
  | "Third Person Limited"
  | "Third Person Omniscient";

export interface PerspectiveOption {
  id: string;
  label: StoryPerspective;
  description: string;
}

export const perspectiveOptions: PerspectiveOption[] = [
  {
    id: "first",
    label: "First Person",
    description: "Narrated using 'I' and 'me'.",
  },
  {
    id: "second",
    label: "Second Person",
    description: "Narrated using 'you'.",
  },
  {
    id: "third-limited",
    label: "Third Person Limited",
    description: "Limited to one character's thoughts.",
  },
  {
    id: "third-omniscient",
    label: "Third Person Omniscient",
    description: "Knows every character's thoughts.",
  },
];

export const buildPerspectivePrompt = (
  perspective: StoryPerspective,
  story: string
) => {
  return `Rewrite the following story in ${perspective} perspective:\n\n${story}`;
};

export const regeneratePerspective = (
  perspective: StoryPerspective,
  story: string
) => {
  return buildPerspectivePrompt(perspective, story);
};