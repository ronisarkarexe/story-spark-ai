export interface TitleSuggestion {
  title: string;
  reason: string;
}

const genreKeywords: Record<string, string[]> = {
  fantasy: ["Kingdom", "Dragon", "Magic", "Legend"],
  mystery: ["Secret", "Shadow", "Mystery", "Case"],
  romance: ["Love", "Heart", "Forever", "Promise"],
  horror: ["Night", "Darkness", "Fear", "Haunted"],
  sciFi: ["Future", "Galaxy", "AI", "Beyond"],
};

export function generateTitleSuggestions(
  currentTitle: string,
  genre: string
): TitleSuggestion[] {
  const keywords = genreKeywords[genre] || ["Story", "Journey", "Adventure"];

  return keywords.map((keyword) => ({
    title: `${currentTitle} ${keyword}`,
    reason: `Includes "${keyword}" to better represent the story genre and improve discoverability.`,
  }));
}