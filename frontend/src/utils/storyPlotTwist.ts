export interface PlotTwist {
  id: number;
  title: string;
  description: string;
}

export function generatePlotTwists(
  story: string
): PlotTwist[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Hidden Identity",
      description:
        "A trusted ally is revealed to have secretly been working against the protagonist for a greater purpose.",
    },
    {
      id: 2,
      title: "Unexpected Survivor",
      description:
        "A character believed to be dead unexpectedly returns with information that changes the course of the story.",
    },
    {
      id: 3,
      title: "Secret Connection",
      description:
        "Two seemingly unrelated characters discover they share a hidden past that explains the central conflict.",
    },
  ];
}

export function regeneratePlotTwists(
  story: string
): PlotTwist[] {
  return generatePlotTwists(story);
}