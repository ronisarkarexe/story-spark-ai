export interface GenreScore {
  genre: string;
  score: number;
  suggestion: string;
}

const genreKeywords: Record<string, string[]> = {
  Fantasy: [
    "magic",
    "wizard",
    "dragon",
    "spell",
    "kingdom",
    "sword",
    "castle",
    "elf",
  ],

  Romance: [
    "love",
    "kiss",
    "heart",
    "romance",
    "relationship",
    "couple",
  ],

  Mystery: [
    "murder",
    "secret",
    "clue",
    "detective",
    "investigation",
    "evidence",
  ],

  Horror: [
    "ghost",
    "blood",
    "fear",
    "haunted",
    "monster",
    "dark",
  ],

  Sci-Fi: [
    "robot",
    "space",
    "planet",
    "future",
    "alien",
    "technology",
  ],
};

export function analyzeGenres(
  story: string,
  selectedGenres: string[]
): GenreScore[] {

  const text = story.toLowerCase();

  return selectedGenres.map((genre) => {

    const keywords = genreKeywords[genre] || [];

    let matches = 0;

    keywords.forEach(word => {
      const regex = new RegExp(word, "gi");
      matches += (text.match(regex) || []).length;
    });

    const score = Math.min(matches * 10, 100);

    return {
      genre,
      score,
      suggestion:
        score < 40
          ? `Consider adding more ${genre.toLowerCase()} elements.`
          : `${genre} is well represented.`,
    };

  });

}