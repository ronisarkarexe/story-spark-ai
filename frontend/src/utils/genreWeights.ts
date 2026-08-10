export interface GenreWeight {
  genre: string;
  weight: number;
}

export interface GenreWeightConfig {
  genres: GenreWeight[];
}

export const normalizeWeights = (
  config: GenreWeightConfig
): GenreWeightConfig => {
  if (config.genres.length === 0) {
    return { genres: [] };
  }

  // Clamp negative weights to 0 so a malformed/accidental negative entry
  // cannot invert the normalization or produce negative percentages.
  const clamped = config.genres.map((g) => ({
    ...g,
    weight: g.weight < 0 ? 0 : g.weight,
  }));

  const total = clamped.reduce((sum, g) => sum + g.weight, 0);

  if (total === 0) {
    return { genres: [] };
  }

  return {
    genres: clamped.map((g) => ({
      ...g,
      weight: Math.round((g.weight / total) * 100),
    })),
  };
};

export const validateWeights = (
  config: GenreWeightConfig
): boolean => {
  return (
    config.genres.reduce((s, g) => s + g.weight, 0) === 100
  );
};

export const buildGenrePrompt = (
  config: GenreWeightConfig
): string => {
  return config.genres
    .map((g) => `${g.genre} (${g.weight}%)`)
    .join(", ");
};