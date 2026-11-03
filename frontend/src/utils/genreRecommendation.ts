export interface GenreRecommendation {
  genre: string;
  confidence: number;
  reason: string;
}

export function getGenreRecommendations(): GenreRecommendation[] {
  return [
    {
      genre: "Fantasy",
      confidence: 95,
      reason: "Story contains magical elements and imaginative world-building.",
    },
    {
      genre: "Adventure",
      confidence: 87,
      reason: "The plot focuses on exploration and exciting journeys.",
    },
    {
      genre: "Mystery",
      confidence: 73,
      reason: "Several hidden clues and unanswered questions are present.",
    },
  ];
}