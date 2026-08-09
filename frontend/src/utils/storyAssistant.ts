export interface Suggestion {
  id: number;
  category: "Grammar" | "Style" | "Dialogue" | "Plot" | "Characters";
  message: string;
  recommendation: string;
}

export function analyzeStory(story: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (story.includes("very very")) {
    suggestions.push({
      id: 1,
      category: "Style",
      message: "Repeated intensifiers detected.",
      recommendation: "Replace repetitive words with stronger vocabulary."
    });
  }

  if (story.includes("suddenly")) {
    suggestions.push({
      id: 2,
      category: "Plot",
      message: "Abrupt transition detected.",
      recommendation: "Add a smoother transition."
    });
  }

  if ((story.match(/"/g) || []).length % 2 !== 0) {
    suggestions.push({
      id: 3,
      category: "Dialogue",
      message: "Possible unclosed dialogue.",
      recommendation: "Check quotation marks."
    });
  }

  if (story.length < 200) {
    suggestions.push({
      id: 4,
      category: "Characters",
      message: "Character introductions are limited.",
      recommendation: "Expand character descriptions."
    });
  }

  return suggestions;
}