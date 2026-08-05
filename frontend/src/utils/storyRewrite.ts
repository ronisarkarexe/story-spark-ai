export type CreativityLevel =
  | "Low"
  | "Balanced"
  | "High"
  | "Experimental";

export interface RewriteRequest {
  story: string;
  creativity: CreativityLevel;
}

export interface RewriteResponse {
  rewrittenStory: string;
}

export const rewriteStory = (
  request: RewriteRequest
): RewriteResponse => {
  return {
    rewrittenStory: request.story,
  };
};

export const getCreativityDescription = (
  level: CreativityLevel
) => {
  switch (level) {
    case "Low":
      return "Preserves most of the original wording.";
    case "Balanced":
      return "Balances originality with accuracy.";
    case "High":
      return "Produces a more creative rewrite.";
    case "Experimental":
      return "Applies bold stylistic changes while preserving the core plot.";
  }
};