export interface IStoryNode {
  id: string;
  name: string;
  type: "location" | "character";
  excerpt: string;
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
  // Pronouns
  "He", "She", "They", "It", "We", "You", "His", "Her", "Their", "Its",
  "Him", "Them", "Our", "Your", "My", "Me", "Us",
  // Articles / determiners
  "The", "This", "That", "These", "Those", "A", "An",
  // Conjunctions / prepositions
  "And", "But", "Or", "Nor", "For", "Yet", "So", "With", "From",
  "Into", "Upon", "Over", "Under", "Through", "Between", "Among",
  "Before", "After", "During", "About", "Against", "Along",
  // Common sentence starters
  "Once", "When", "Where", "What", "Which", "Who", "How", "Why",
  "There", "Then", "Than", "Just", "Even", "Also", "Still",
  "Now", "Soon", "Here", "Away", "Back",
  // Common verbs / auxiliaries
  "Was", "Were", "Are", "Is", "Has", "Have", "Had", "Did", "Does",
  "Will", "Would", "Could", "Should", "May", "Might", "Must", "Can",
  "Get", "Got", "Let", "Make", "Made", "Said", "Told", "Came", "Went",
  // Common adjectives / adverbs that appear capitalised mid-sentence
  "Every", "Some", "Many", "Much", "More", "Most", "Such", "Only",
  "Very", "Too", "All", "Both", "Each", "Few", "Own", "Same", "Other",
  // Location words (capitalised in text sometimes)
  ...LOCATION_WORDS.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
  // Story-specific common caps
  "Dragons", "Dragon", "Night", "Day", "Morning", "Evening",
]);

export function parseStory(content: string): IStoryGraph {
  const nodes: IStoryNode[] = [];
  const links: IStoryLink[] = [];
  const lowerContent = content.toLowerCase();

  // --- Find locations ---
  const foundLocations: IStoryNode[] = [];
  LOCATION_WORDS.forEach((word) => {
    if (lowerContent.includes(word)) {
      const idx = lowerContent.indexOf(word);
      const start = Math.max(0, idx - 50);
      const end = Math.min(content.length, idx + word.length + 50);
      const excerpt = "..." + content.slice(start, end).trim() + "...";

      const node: IStoryNode = {
        id: `loc_${word}`,
        name: word.charAt(0).toUpperCase() + word.slice(1),
        type: "location",
        excerpt,
      };
      nodes.push(node);
      foundLocations.push(node);
    }
  });

  // --- Find characters ---
  // A real character name:
  //   1. Starts with a capital letter
  //   2. Is NOT at the start of a sentence (preceded by ". " or is the very first word)
  //      OR appears more than once anywhere
  //   3. Is not in the skip list
  //   4. Is at least 3 chars long

  const words = content.split(/\s+/);
  const charCount: Record<string, number> = {};

  // First pass — count ALL capitalised words not in skip list
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

  // Only keep words that appear 2+ times (real names repeat)
  // or appear right after a comma/mid-sentence (not sentence-start)
  const sentenceStartWords = new Set<string>();
  const sentences = content.split(/(?<=[.!?])\s+/);
  sentences.forEach((sentence) => {
    const firstWord = sentence.trim().split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "");
    if (firstWord) sentenceStartWords.add(firstWord);
  });

  const characters = Object.entries(charCount)
    .filter(([name, count]) => {
      // Keep if appears 2+ times, OR appears once but NOT only as sentence-start
      if (count >= 2) return true;
      // Appears once — only keep if it's not just a sentence-starter
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