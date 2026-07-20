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