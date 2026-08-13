export interface StorySymbol {
  symbol: string;
  occurrences: number;
  status: "Resolved" | "Unresolved";
}

const SYMBOLS = [
  "ring",
  "sword",
  "key",
  "moon",
  "forest",
  "fire",
  "bird",
  "mirror",
  "flower",
];

export function analyzeSymbols(story: string): StorySymbol[] {
  const text = story.toLowerCase();

  return SYMBOLS.map((item): StorySymbol => {
    const count = (text.match(new RegExp(item, "g")) || []).length;

    return {
      symbol: item,
      occurrences: count,
      status: count > 1 ? "Resolved" : "Unresolved",
    };
  }).filter((s) => s.occurrences > 0);
}