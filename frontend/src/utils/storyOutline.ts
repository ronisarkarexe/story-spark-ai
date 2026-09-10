export interface StoryPrompt {
  prompt: string;
}

export interface StoryOutline {
  introduction: string;
  plotPoints: string[];
  climax: string;
  conclusion: string;
}

export const generateOutline = (
  prompt: StoryPrompt
): StoryOutline => {
  return {
    introduction: "",
    plotPoints: [],
    climax: "",
    conclusion: "",
  };
};

export const regenerateOutline = (
  prompt: StoryPrompt
): StoryOutline => {
  return generateOutline(prompt);
};

export const isOutlineComplete = (
  outline: StoryOutline
): boolean => {
  return (
    outline.introduction.length > 0 &&
    outline.plotPoints.length > 0 &&
    outline.climax.length > 0 &&
    outline.conclusion.length > 0
  );
};