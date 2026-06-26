import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";
import {
  safeParseAIResponse,
  CharacterNetworkResponseSchema,
  type CharacterNetworkResponse,
} from "../ai";

export interface ICharacter {
  id: string;
  name: string;
  appearanceCount: number;
  importanceScore: number;
}

export interface IRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
  interactionCount: number;
}

export interface ICharacterNetworkResponse {
  characters: ICharacter[];
  relationships: IRelationship[];
}

const COMMON_STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "where",
  "why", "how", "who", "whom", "this", "that", "these", "those", "i", "you",
  "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "his",
  "my", "your", "their", "our", "its", "mine", "yours", "hers", "ours", "theirs",
  "in", "on", "at", "by", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "to", "from", "up",
  "down", "in", "out", "off", "over", "under", "again", "further", "then", "once",
  "here", "there", "all", "any", "both", "each", "few", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "s", "t", "can", "will", "just", "don", "should", "now", "was", "were",
  "is", "are", "am", "be", "been", "being", "have", "has", "had", "having",
  "do", "does", "did", "doing", "would", "could", "should", "one", "two", "three",
  "four", "five", "first", "second", "third", "mr", "mrs", "ms", "miss", "dr", "prof"
]);

// Offline fallback extractor using regex and heuristics
export function extractCharacterNetworkOffline(content: string): ICharacterNetworkResponse {
  if (!content || !content.trim()) {
    return { characters: [], relationships: [] };
  }

  // 1. Sentence-based split
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  
  // 2. Candidate character extraction: Capitalized words
  const rawNamesCount: Record<string, number> = {};
  const sentenceOccurrences: string[][] = [];

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    const sentenceNames = new Set<string>();
    
    let i = 0;
    while (i < words.length) {
      const cleanWord = words[i].replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
      if (cleanWord && /^[A-Z]/.test(cleanWord)) {
        const lower = cleanWord.toLowerCase();
        if (!COMMON_STOP_WORDS.has(lower) && cleanWord.length > 2) {
          let name = cleanWord;
          if (i + 1 < words.length) {
            const nextClean = words[i+1].replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
            if (nextClean && /^[A-Z]/.test(nextClean) && !COMMON_STOP_WORDS.has(nextClean.toLowerCase())) {
              name = name + " " + nextClean;
              i++; 
            }
          }
          sentenceNames.add(name);
        }
      }
      i++;
    }

    if (sentenceNames.size > 0) {
      sentenceOccurrences.push(Array.from(sentenceNames));
      for (const name of sentenceNames) {
        rawNamesCount[name] = (rawNamesCount[name] || 0) + 1;
      }
    }
  }

  const minAppearances = sentences.length > 15 ? 2 : 1;
  const filteredNames = Object.keys(rawNamesCount).filter(
    name => rawNamesCount[name] >= minAppearances
  );

  if (filteredNames.length === 0) {
    return {
      characters: [
        { id: "hero", name: "Hero", appearanceCount: 5, importanceScore: 80 },
        { id: "villain", name: "Villain", appearanceCount: 4, importanceScore: 75 }
      ],
      relationships: [
        {
          id: "hero-villain",
          source: "hero",
          target: "villain",
          type: "Rival",
          strength: 70,
          interactionCount: 3
        }
      ]
    };
  }

  const characters: ICharacter[] = filteredNames.map(name => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return {
      id,
      name,
      appearanceCount: rawNamesCount[name],
      importanceScore: 0
    };
  });

  const charMap = new Map<string, ICharacter>();
  characters.forEach(c => charMap.set(c.name, c));

  const pairInteractions: Record<string, { source: string; target: string; count: number }> = {};
  
  for (const occurrences of sentenceOccurrences) {
    const validOccurrences = occurrences.filter(name => charMap.has(name));
    for (let x = 0; x < validOccurrences.length; x++) {
      for (let y = x + 1; y < validOccurrences.length; y++) {
        const nameA = validOccurrences[x];
        const nameB = validOccurrences[y];
        const charA = charMap.get(nameA)!;
        const charB = charMap.get(nameB)!;
        
        const [first, second] = charA.id < charB.id ? [charA, charB] : [charB, charA];
        const pairKey = `${first.id}-${second.id}`;
        
        if (!pairInteractions[pairKey]) {
          pairInteractions[pairKey] = {
            source: first.id,
            target: second.id,
            count: 0
          };
        }
        pairInteractions[pairKey].count += 1;
      }
    }
  }

  const relationshipTypes = ["Friend", "Rival", "Mentor", "Enemy", "Ally", "Romantic Interest", "Family", "Unknown"];

  const relationships: IRelationship[] = Object.entries(pairInteractions).map(([id, data]) => {
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const type = relationshipTypes[hash % relationshipTypes.length];
    const strength = Math.min(100, Math.max(10, data.count * 15));
    
    return {
      id,
      source: data.source,
      target: data.target,
      type,
      strength,
      interactionCount: data.count
    };
  });

  characters.forEach(char => {
    const charRelationships = relationships.filter(r => r.source === char.id || r.target === char.id);
    const totalInteractions = charRelationships.reduce((acc, r) => acc + r.interactionCount, 0);
    const rawScore = char.appearanceCount * 3 + charRelationships.length * 10 + totalInteractions * 2;
    char.importanceScore = Math.min(100, Math.max(10, Math.round(rawScore)));
  });

  return { characters, relationships };
}

// Main analyzer function with Gemini AI and offline fallback
export async function analyzeCharacterNetwork(content: string): Promise<ICharacterNetworkResponse> {
  const geminiApiKey = config.gemini_api_key?.trim();
  
  if (!geminiApiKey) {
    console.log("[AI] Gemini key not configured, falling back to offline character network extraction.");
    return extractCharacterNetworkOffline(content);
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert narrative analyzer. Analyze the story content below and extract:
1. All unique major and minor characters. For each character, calculate:
   - "id": A clean, unique identifier (e.g., lowercase names like "john_smith" or "harry")
   - "name": The readable character name
   - "appearanceCount": Estimated number of times they are mentioned/appear in the story
   - "importanceScore": A score from 1 to 100 based on their role in the plot, appearance count, and relationships.
2. Relationships between characters. For each relationship, identify:
   - "id": A unique identifier (e.g., "sourceId-targetId")
   - "source": The ID of the source character
   - "target": The ID of the target character
   - "type": One of: "Friend", "Family", "Rival", "Mentor", "Ally", "Enemy", "Romantic Interest", "Unknown"
   - "strength": Relationship strength from 1 (very weak) to 100 (extremely strong)
   - "interactionCount": Estimate of how many times they interact directly.

Story Content:
"${content}"

Return ONLY valid JSON format containing:
{
  "characters": [
    { "id": "char_id", "name": "Name", "appearanceCount": 10, "importanceScore": 85 }
  ],
  "relationships": [
    { "id": "char_id1-char_id2", "source": "char_id1", "target": "char_id2", "type": "Rival", "strength": 75, "interactionCount": 5 }
  ]
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const parsed = safeParseAIResponse<CharacterNetworkResponse>(
      text,
      CharacterNetworkResponseSchema,
      extractCharacterNetworkOffline(content),
      { label: "Gemini character network" }
    );

    return parsed;
  } catch (error) {
    console.error("[AI] Gemini character network analysis failed:", error);
    console.log("[AI] Executing fallback offline character network extraction.");
    return extractCharacterNetworkOffline(content);
  }
}
