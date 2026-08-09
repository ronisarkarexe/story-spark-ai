export interface PlotStage {
  id: number;
  stage:
    | "Introduction"
    | "Rising Action"
    | "Climax"
    | "Falling Action"
    | "Resolution";
  status: "Strong" | "Needs Improvement" | "Missing";
  score: number;
  explanation: string;
  suggestion: string;
}

export interface PlotStructureAnalysis {
  framework: string;
  overallScore: number;
  stages: PlotStage[];
}

export function analyzePlotStructure(
  story: string,
  framework: string
): PlotStructureAnalysis {
  if (!story.trim()) {
    return {
      framework,
      overallScore: 0,
      stages: [],
    };
  }

  return {
    framework,
    overallScore: 89,
    stages: [
      {
        id: 1,
        stage: "Introduction",
        status: "Strong",
        score: 95,
        explanation:
          "Characters and setting are introduced clearly.",
        suggestion:
          "Maintain this strong opening throughout the narrative.",
      },
      {
        id: 2,
        stage: "Rising Action",
        status: "Needs Improvement",
        score: 74,
        explanation:
          "Conflict builds but lacks consistent tension.",
        suggestion:
          "Increase obstacles and character stakes.",
      },
      {
        id: 3,
        stage: "Climax",
        status: "Strong",
        score: 91,
        explanation:
          "The climax delivers a satisfying emotional payoff.",
        suggestion:
          "Keep the pacing focused around this moment.",
      },
      {
        id: 4,
        stage: "Falling Action",
        status: "Needs Improvement",
        score: 70,
        explanation:
          "Resolution begins too quickly after the climax.",
        suggestion:
          "Expand the aftermath to improve narrative flow.",
      },
      {
        id: 5,
        stage: "Resolution",
        status: "Strong",
        score: 88,
        explanation:
          "Most major story arcs receive satisfying closure.",
        suggestion:
          "Consider resolving minor subplots more explicitly.",
      },
    ],
  };
}

export function refreshPlotStructureAnalysis(
  story: string,
  framework: string
) {
  return analyzePlotStructure(story, framework);
}