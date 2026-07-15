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
  const total = config.genres.reduce(
    (sum, g) => sum + g.weight,
    0
  );

  if (total === 0) return config;

  return {
    genres: config.genres.map((g) => ({
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