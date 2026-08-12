import { CharacterDialogueAnalysis } from "../types/dialogue";

/**
 * Extracts dialogue lines for a given character from a story.
 * Matches patterns like "CharacterName: dialogue" or "CharacterName said: dialogue".
 */
function extractCharacterDialogue(story: string, characterName: string): string[] {
  const lines: string[] = [];
  const pattern = new RegExp(`^${characterName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[:-]\\s*(.+)$`, "gim");
  let match;
  while ((match = pattern.exec(story)) !== null) {
    lines.push(match[1]);
  }
  return lines;
}

/**
 * Computes the vocabulary uniqueness score for a character's dialogue.
 * Returns a score from 0-100 based on the ratio of unique words to total words.
 */
function computeVocabularyUniqueness(dialogueLines: string[]): number {
  if (dialogueLines.length === 0) return 0;
  const allWords = dialogueLines.join(" ").toLowerCase().match(/\b\w+\b/g) || [];
  if (allWords.length === 0) return 0;
  const uniqueWords = new Set(allWords);
  const ratio = uniqueWords.size / allWords.length;
  return Math.min(100, Math.round(ratio * 100));
}

/**
 * Detects speech pattern characteristics from dialogue lines.
 */
function detectSpeechPattern(dialogueLines: string[]): { avgLength: number; hasExclamation: boolean; hasQuestions: boolean } {
  if (dialogueLines.length === 0) return { avgLength: 0, hasExclamation: false, hasQuestions: false };
  const totalLength = dialogueLines.reduce((sum, line) => sum + line.length, 0);
  const avgLength = Math.round(totalLength / dialogueLines.length);
  const text = dialogueLines.join(" ");
  return {
    avgLength,
    hasExclamation: text.includes("!"),
    hasQuestions: text.includes("?"),
  };
}

/**
 * Analyzes dialogue styles for characters mentioned in a story.
 * For each character found in the story, it computes vocabulary uniqueness,
 * detects speech patterns, and provides actionable suggestions.
 */
export function analyzeDialogue(story: string): CharacterDialogueAnalysis[] {
  if (!story || !story.trim()) {
    return [];
  }

  // Extract unique character names from dialogue lines (lines ending with : or -)
  const characterMatches = story.match(/^([A-Z][a-zA-Z]+)\s*:[-]\s*/gm) || [];
  const uniqueNames = [...new Set(characterMatches.map((m) => m.replace(/\s*:[-]\s*$/, "").trim()))];

  if (uniqueNames.length === 0) {
    return [];
  }

  // Collect dialogue data per character
  const charData: Array<{
    name: string;
    vocabularyScore: number;
    avgLength: number;
    hasExclamation: boolean;
    hasQuestions: boolean;
  }> = uniqueNames.map((name) => {
    const lines = extractCharacterDialogue(story, name);
    const vocabScore = computeVocabularyUniqueness(lines);
    const pattern = detectSpeechPattern(lines);
    return {
      name,
      vocabularyScore: vocabScore,
      avgLength: pattern.avgLength,
      hasExclamation: pattern.hasExclamation,
      hasQuestions: pattern.hasQuestions,
    };
  });

  // Compute uniqueness score: combine vocabulary score with pattern diversity
  const results: CharacterDialogueAnalysis[] = charData.map((data, index) => {
    const patternDiversity =
      (data.hasExclamation ? 10 : 0) + (data.hasQuestions ? 10 : 0) + Math.min(30, data.avgLength / 2);
    const uniquenessScore = Math.min(100, Math.round(data.vocabularyScore * 0.6 + patternDiversity));

    const vocabularyStyle = uniquenessScore > 85
      ? "Distinct"
      : uniquenessScore > 70
        ? "Moderately Distinct"
        : "Generic";

    const speechPattern = uniquenessScore > 85
      ? "Unique tone and sentence structure"
      : uniquenessScore > 70
        ? "Some variation in tone"
        : "Similar wording with other characters";

    // Find a character with lower score (similar character)
    const lowerScore = charData.find(
      (c, i) => i !== index && c.vocabularyScore < data.vocabularyScore
    );

    const suggestions: string[] = uniquenessScore < 75
      ? ["Use unique catchphrases.", "Vary sentence length.", "Adjust vocabulary."]
      : ["Dialogue style is consistent."];

    return {
      id: index + 1,
      character: data.name,
      uniquenessScore,
      vocabularyStyle,
      speechPattern,
      similarTo: uniquenessScore < 75 && lowerScore ? lowerScore.name : undefined,
      suggestions,
    };
  });

  return results;
}
