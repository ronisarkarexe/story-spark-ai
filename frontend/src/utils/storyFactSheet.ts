export interface StoryFactSheet {
  characters: string[];
  locations: string[];
  timeline: string;
  genre: string;
  themes: string[];
  conflict: string;
  resolution: string;
}

export function generateFactSheet(
  story: string
): StoryFactSheet {
  const words = story.split(/\s+/);

  return {
    characters: [...new Set(words.filter((w) => /^[A-Z]/.test(w)))].slice(0, 5),
    locations: ["Unknown Location"],
    timeline: "Chronological",
    genre: "Adventure",
    themes: ["Friendship", "Courage"],
    conflict: "Main conflict extracted from story.",
    resolution: "Ending summary extracted from story.",
  };
}

export function copyFactSheet(
  sheet: StoryFactSheet
) {
  return `
Characters: ${sheet.characters.join(", ")}

Locations: ${sheet.locations.join(", ")}

Timeline: ${sheet.timeline}

Genre: ${sheet.genre}

Themes: ${sheet.themes.join(", ")}

Conflict: ${sheet.conflict}

Resolution: ${sheet.resolution}
`;
}