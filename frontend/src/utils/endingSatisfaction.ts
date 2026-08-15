export interface EndingMetric {
  title: string;
  score: number;
  description: string;
  suggestion: string;
}

export const getEndingMetrics = (): EndingMetric[] => [
  {
    title: "Conflict Resolution",
    score: 92,
    description: "Most conflicts are resolved naturally.",
    suggestion: "Address one remaining subplot for better closure.",
  },
  {
    title: "Character Arc",
    score: 85,
    description: "Main character completes their journey.",
    suggestion: "Expand supporting character endings.",
  },
  {
    title: "Emotional Payoff",
    score: 88,
    description: "Ending delivers a satisfying emotional impact.",
    suggestion: "Add a reflective closing paragraph.",
  },
  {
    title: "Pacing",
    score: 76,
    description: "Final chapter feels slightly rushed.",
    suggestion: "Slow the final scene with more details.",
  },
];