# Story Parser

The story parser (`frontend/src/utils/storyParser.ts`) extracts a graph-based representation of characters and locations from free-form story text. It is used by the story visualization feature to render interactive character-location maps.

## Interfaces

### IStoryNode

```typescript
export interface IStoryNode {
  id: string;        // e.g. "char_Alice" or "loc_forest"
  name: string;      // Display name, e.g. "Alice" or "Forest"
  type: "location" | "character";
  excerpt: string;   // Context snippet around the first occurrence
  occurrenceCount?: number; // Number of times the location appears
}
```

### IStoryLink

```typescript
export interface IStoryLink {
  source: string;  // IStoryNode id
  target: string;  // IStoryNode id
}
```

### IStoryGraph

```typescript
export interface IStoryGraph {
  nodes: IStoryNode[];
  links: IStoryLink[];
}
```

## Usage

```typescript
import { parseStory } from "../utils/storyParser";

const text = `
  Alice walked through the dark forest. She had never been here before.
  The castle loomed in the distance. Alicequickly ran toward it.
`;

const graph = parseStory(text);
// graph.nodes  → IStoryNode[]
// graph.links → IStoryLink[]
```

## How It Works

### Location Detection

The parser maintains a list of ~50 common location keywords (forest, castle, city, village, etc.). For each keyword found in the text, it creates a location node. The excerpt is drawn from the occurrence with the richest surrounding context (sentences, quotes, capitalized words nearby).

### Character Detection

Characters are identified as capitalized words that:
- Appear at least twice in the text
- Are not in the skip list (common words, location names, pronouns)
- Start with a capital letter and have at least 3 characters

Up to 6 characters are kept, sorted by frequency of occurrence.

### Link Generation

Two types of links are created:
1. **Character-to-location**: A character node is linked to a location node if they appear within 200 characters of each other.
2. **Location-to-location**: Consecutive locations in the text are linked in order, reflecting the story's movement.

## Limitations

- The location vocabulary is hardcoded (~50 terms). Uncommon or fictional locations will not be detected.
- Character detection is heuristic and may produce false positives for capitalized common nouns.
- The 200-character proximity threshold for character-location links is fixed.

## Testing

Tests are co-located at `frontend/src/utils/__tests__/storyParser.test.ts`.
