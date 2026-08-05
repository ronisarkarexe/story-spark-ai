export interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
}

const LOCATION_KEYWORDS = [
  "Kingdom",
  "City",
  "Village",
  "Forest",
  "Castle",
  "Mountain",
  "Temple",
];

const ORGANIZATION_KEYWORDS = [
  "Guild",
  "Order",
  "Academy",
  "Council",
  "Empire",
];

const ITEM_KEYWORDS = [
  "Sword",
  "Ring",
  "Crystal",
  "Orb",
  "Artifact",
  "Staff",
];

export function generateGlossary(story: string): GlossaryEntry[] {
  const words = story.match(/\b[A-Z][a-zA-Z]+\b/g) || [];

  const unique = [...new Set(words)];

  return unique.map((term) => {
    let category = "Character";

    if (LOCATION_KEYWORDS.some((k) => term.includes(k))) {
      category = "Location";
    }

    if (ORGANIZATION_KEYWORDS.some((k) => term.includes(k))) {
      category = "Organization";
    }

    if (ITEM_KEYWORDS.some((k) => term.includes(k))) {
      category = "Magical Item";
    }

    return {
      term,
      category,
      definition: `${term} is an important ${category.toLowerCase()} mentioned in the story.`,
    };
  });
}