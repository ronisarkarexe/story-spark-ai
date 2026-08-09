export interface GenreIssue {
  id: number;
  section: string;
  category: "Tone" | "Pacing" | "Theme" | "Narrative";
  compatibility: number;
  explanation: string;
  suggestion: string;
}

export interface GenreAnalysis {
  genre: string;
  overallScore: number;
  issues: GenreIssue[];
}

export function analyzeGenreCompatibility(
  story: string,
  genre: string
): GenreAnalysis {
  if (!story.trim()) {
    return {
      genre,
      overallScore: 0,
      issues: [],
    };
  }

  return {
    genre,
    overallScore: 88,
    issues: [
      {
        id: 1,
        section: "Opening Chapter",
        category: "Tone",
        compatibility: 92,
        explanation:
          "The opening establishes the selected genre effectively.",
        suggestion:
          "Maintain this tone consistently throughout the story.",
      },
      {
        id: 2,
        section: "Middle Chapters",
        category: "Pacing",
        compatibility: 70,
        explanation:
          "The pacing slows and feels inconsistent with the chosen genre.",
        suggestion:
          "Increase tension or action to match reader expectations.",
      },
      {
        id: 3,
        section: "Ending",
        category: "Theme",
        compatibility: 80,
        explanation:
          "The conclusion partially aligns with the genre themes.",
        suggestion:
          "Strengthen genre-specific elements for a more satisfying ending.",
      },
    ],
  };
}

export function refreshGenreAnalysis(
  story: string,
  genre: string
) {
  return analyzeGenreCompatibility(story, genre);
}