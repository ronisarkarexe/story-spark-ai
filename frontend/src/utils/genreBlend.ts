export interface GenreBlendRequest {
  genres: string[];
  prompt: string;
}

export interface GenreBlendResult {
  selectedGenres: string[];
  blendedPrompt: string;
}

export const blendGenres = (
  request: GenreBlendRequest
): GenreBlendResult => {
  return {
    selectedGenres: request.genres,
    blendedPrompt: request.prompt,
  };
};

export const validateGenres = (
  genres: string[]
): boolean => {
  return genres.length >= 2;
};

export const regenerateBlend = (
  request: GenreBlendRequest
): GenreBlendResult => {
  return blendGenres(request);
};

export const DEFAULT_MAX_PROMPT_LENGTH = 2000;

export const validatePromptLength = (
  prompt: string,
  maxLength: number = DEFAULT_MAX_PROMPT_LENGTH
): boolean => {
  if (!prompt || typeof prompt !== "string") {
    return false;
  }
  return prompt.length <= maxLength;
};