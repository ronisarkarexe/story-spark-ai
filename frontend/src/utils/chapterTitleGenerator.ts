export interface ChapterTitle {
  chapter: string;
  suggestions: string[];
}

export const generateChapterTitles = (): ChapterTitle[] => {
  return [
    {
      chapter: "Chapter 1",
      suggestions: [
        "The Beginning of Destiny",
        "A New Dawn",
        "Echoes of Tomorrow",
      ],
    },
    {
      chapter: "Chapter 2",
      suggestions: [
        "Hidden Truths",
        "The Silent Forest",
        "Beyond the Horizon",
      ],
    },
    {
      chapter: "Chapter 3",
      suggestions: [
        "Broken Promises",
        "Turning Point",
        "Rise of Hope",
      ],
    },
  ];
};