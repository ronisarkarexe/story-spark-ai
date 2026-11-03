export interface StorySymbol {
  id: number;
  symbol: string;
  type: "Symbol" | "Metaphor" | "Motif";
  meaning: string;
  relatedPassage: string;
}

export function analyzeStorySymbolism(
  story: string
): StorySymbol[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      symbol: "Broken Clock",
      type: "Symbol",
      meaning:
        "Represents lost time and missed opportunities.",
      relatedPassage: "Chapter 2",
    },
    {
      id: 2,
      symbol: "Storm",
      type: "Metaphor",
      meaning:
        "Reflects the protagonist's inner emotional conflict.",
      relatedPassage: "Chapter 4",
    },
    {
      id: 3,
      symbol: "White Feather",
      type: "Motif",
      meaning:
        "Appears repeatedly to symbolize hope and guidance.",
      relatedPassage: "Chapter 7",
    },
  ];
}

export function refreshStorySymbolism(
  story: string
) {
  return analyzeStorySymbolism(story);
}