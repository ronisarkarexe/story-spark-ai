export type StoryMilestoneType =
  | "Introduction"
  | "Inciting Incident"
  | "Rising Action"
  | "Climax"
  | "Falling Action"
  | "Resolution";

export interface StoryMilestone {
  id: number;
  title: StoryMilestoneType;
  chapter: string;
  preview: string;
}

export function detectStoryMilestones(
  story: string
): StoryMilestone[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Introduction",
      chapter: "Chapter 1",
      preview: "Introduce the protagonist and world..."
    },
    {
      id: 2,
      title: "Inciting Incident",
      chapter: "Chapter 2",
      preview: "A mysterious event changes everything..."
    },
    {
      id: 3,
      title: "Rising Action",
      chapter: "Chapter 4",
      preview: "Challenges begin to escalate..."
    },
    {
      id: 4,
      title: "Climax",
      chapter: "Chapter 7",
      preview: "The final confrontation takes place..."
    },
    {
      id: 5,
      title: "Falling Action",
      chapter: "Chapter 8",
      preview: "Consequences of the climax unfold..."
    },
    {
      id: 6,
      title: "Resolution",
      chapter: "Chapter 9",
      preview: "The story reaches its conclusion..."
    }
  ];
}

export function refreshMilestones(
  story: string
) {
  return detectStoryMilestones(story);
}