export interface CharacterArc {
  id: number;
  name: string;
  growth: "Strong" | "Moderate" | "Weak";
  beginning: string;
  ending: string;
  summary: string;
  suggestion: string;
}

export interface CharacterArcAnalysis {
  overallScore: number;
  characters: CharacterArc[];
}

export function analyzeCharacterArcs(
  story: string
): CharacterArcAnalysis {

  if (!story.trim()) {
    return {
      overallScore: 0,
      characters: [],
    };
  }

  return {
    overallScore: 88,
    characters: [
      {
        id: 1,
        name: "Emma",
        growth: "Strong",
        beginning: "Timid and uncertain",
        ending: "Confident leader",
        summary:
          "Emma evolves from avoiding responsibility to confidently leading others.",
        suggestion:
          "Expand the emotional turning point before the climax.",
      },
      {
        id: 2,
        name: "Liam",
        growth: "Moderate",
        beginning: "Impulsive",
        ending: "More thoughtful",
        summary:
          "Shows gradual maturity but lacks a defining transformation.",
        suggestion:
          "Add one major decision that demonstrates personal growth.",
      },
      {
        id: 3,
        name: "Sophia",
        growth: "Weak",
        beginning: "Supportive friend",
        ending: "Supportive friend",
        summary:
          "Little noticeable development throughout the story.",
        suggestion:
          "Introduce internal conflict or a personal challenge.",
      },
    ],
  };
}

export function refreshCharacterArcAnalysis(story: string) {
  return analyzeCharacterArcs(story);
}