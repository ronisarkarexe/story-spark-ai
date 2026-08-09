export interface ComplexityMetric {
  title: string;
  score: number;
  description: string;
}

export function getComplexityMetrics(): ComplexityMetric[] {
  return [
    {
      title: "Subplots",
      score: 78,
      description: "Good balance of supporting storylines.",
    },
    {
      title: "Character Interactions",
      score: 90,
      description: "Characters interact frequently.",
    },
    {
      title: "Timeline Depth",
      score: 68,
      description: "Timeline is moderately complex.",
    },
    {
      title: "World Building",
      score: 82,
      description: "Rich environmental details.",
    },
    {
      title: "Vocabulary Diversity",
      score: 75,
      description: "Vocabulary is varied and engaging.",
    },
  ];
}

export function getRecommendation(avg: number) {
  if (avg >= 80)
    return "Story complexity is excellent. Maintain consistency.";
  if (avg >= 60)
    return "Balanced complexity. Add depth only where needed.";
  return "Consider enriching plot and character development.";
}