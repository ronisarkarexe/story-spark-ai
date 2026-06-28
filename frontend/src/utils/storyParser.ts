export interface IStoryNode {
  id: string;
  name: string;
  type: "location" | "character";
  excerpt: string;
  occurrenceCount?: number; // NEW: Track how many times location appears
}

export interface IStoryLink {
  source: string;
  target: string;
}

export interface IStoryGraph {
  nodes: IStoryNode[];
  links: IStoryLink[];
}

const LOCATION_WORDS = [
  "forest", "castle", "city", "village", "mountain", "ocean", "cave",
  "tower", "palace", "room", "house", "garden", "river", "lake", "sea",
  "desert", "jungle", "island", "valley", "bridge", "market", "temple",
  "dungeon", "tavern", "inn", "port", "harbor", "kingdom", "realm",
  "land", "world", "planet", "street", "alley", "mansion", "cottage",
  "library", "school", "hospital", "church", "prison", "camp", "field",
  "meadow", "cliff", "shore", "beach", "swamp", "ruins", "tomb", "hill",
  "town", "road", "path", "gate", "wall", "throne", "arena",
];

const SKIP_WORDS = new Set([
  "He", "She", "They", "It", "We", "You", "His", "Her", "Their", "Its",
  "Him", "Them", "Our", "Your", "My", "Me", "Us",
  "The", "This", "That", "These", "Those", "A", "An",
  "And", "But", "Or", "Nor", "For", "Yet", "So", "With", "From",
  "Into", "Upon", "Over", "Under", "Through", "Between", "Among",
  "Before", "After", "During", "About", "Against", "Along",
  "Once", "When", "Where", "What", "Which", "Who", "How", "Why",
  "There", "Then", "Than", "Just", "Even", "Also", "Still",
  "Now", "Soon", "Here", "Away", "Back",
  "Was", "Were", "Are", "Is", "Has", "Have", "Had", "Did", "Does",
  "Will", "Would", "Could", "Should", "May", "Might", "Must", "Can",
  "Get", "Got", "Let", "Make", "Made", "Said", "Told", "Came", "Went",
  "Every", "Some", "Many", "Much", "More", "Most", "Such", "Only",
  "Very", "Too", "All", "Both", "Each", "Few", "Own", "Same", "Other",
  ...LOCATION_WORDS.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
  "Dragons", "Dragon", "Night", "Day", "Morning", "Evening",
]);

// ✅ NEW: Helper to find all occurrences of a word
const getAllOccurrences = (content: string, word: string): number[] => {
  const regex = new RegExp(word, 'gi');
  const matches = [...content.matchAll(regex)];
  return matches.map(m => m.index || 0);
};

// ✅ NEW: Score context quality
const scoreContext = (context: string): number => {
  let score = 0;
  const sentences = context.match(/[.!?]/g);
  if (sentences) score += sentences.length * 3;
  const quotes = context.match(/["']/g);
  if (quotes) score += quotes.length * 2;
  const caps = context.match(/[A-Z][a-z]+/g);
  if (caps) score += caps.length;
  const words = context.split(/\s+/).length;
  score += Math.min(words / 10, 5); // Longer context = better
  return score;
};

export function parseStory(content: string): IStoryGraph {
  const nodes: IStoryNode[] = [];
  const links: IStoryLink[] = [];
  const lowerContent = content.toLowerCase();

  // --- Find locations (FIXED: uses ALL occurrences) ---
  const foundLocations: IStoryNode[] = [];
  
  LOCATION_WORDS.forEach((word) => {
    // ✅ FIX: Find ALL occurrences
    const positions = getAllOccurrences(content, word);
    
    if (positions.length === 0) return;
    
    // Find the BEST occurrence (with most context)
    let bestIdx = positions[0];
    let bestScore = -1;
    
    for (const idx of positions) {
      const start = Math.max(0, idx - 50);
      const end = Math.min(content.length, idx + word.length + 50);
      const context = content.slice(start, end);
      const score = scoreContext(context);
      
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }
    
    // Use the BEST occurrence for excerpt
    const start = Math.max(0, bestIdx - 50);
    const end = Math.min(content.length, bestIdx + word.length + 50);
    const excerpt = "..." + content.slice(start, end).trim() + "...";

    const node: IStoryNode = {
      id: `loc_${word}`,
      name: word.charAt(0).toUpperCase() + word.slice(1),
      type: "location",
      excerpt,
      occurrenceCount: positions.length, // Track total occurrences
    };
    
    nodes.push(node);
    foundLocations.push(node);
  });

  // --- Find characters (existing logic) ---
  const words = content.split(/\s+/);
  const charCount: Record<string, number> = {};

  words.forEach((word) => {
    const clean = word.replace(/[^a-zA-Z]/g, "");
    if (
      clean.length >= 3 &&
      /^[A-Z]/.test(clean) &&
      !SKIP_WORDS.has(clean)
    ) {
      charCount[clean] = (charCount[clean] || 0) + 1;
    }
  });

  const sentenceStartWords = new Set<string>();
  const sentences = content.split(/(?<=[.!?])\s+/);
  sentences.forEach((sentence) => {
    const firstWord = sentence.trim().split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "");
    if (firstWord) sentenceStartWords.add(firstWord);
  });

  const characters = Object.entries(charCount)
    .filter(([name, count]) => {
      if (count >= 2) return true;
      return !sentenceStartWords.has(name) || count >= 2;
    })
    .filter(([name]) => !SKIP_WORDS.has(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name]) => name);

  characters.forEach((name) => {
    const idx = content.indexOf(name);
    const start = Math.max(0, idx - 50);
    const end = Math.min(content.length, idx + name.length + 50);
    const excerpt = "..." + content.slice(start, end).trim() + "...";

    nodes.push({
      id: `char_${name}`,
      name,
      type: "character",
      excerpt,
    });
  });

  // --- Connect characters to nearby locations ---
  characters.forEach((charName) => {
    const charId = `char_${charName}`;
    foundLocations.forEach((loc) => {
      const locWord = loc.name.toLowerCase();
      const charIdx = lowerContent.indexOf(charName.toLowerCase());
      const locIdx = lowerContent.indexOf(locWord);
      if (charIdx !== -1 && locIdx !== -1 && Math.abs(charIdx - locIdx) < 200) {
        links.push({ source: charId, target: loc.id });
      }
    });
  });

  // --- Connect consecutive locations ---
  for (let i = 0; i < foundLocations.length - 1; i++) {
    links.push({
      source: foundLocations[i].id,
      target: foundLocations[i + 1].id,
    });
  }

  return { nodes, links };
}