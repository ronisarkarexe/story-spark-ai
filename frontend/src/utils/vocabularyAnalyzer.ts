export interface VocabularySuggestion {
  id: string;
  word: string;
  replacement: string;
  reason: string;
}

export interface VocabularyAnalysis {
  readabilityScore: number;
  diversityScore: number;
  repeatedWords: string[];
  suggestions: VocabularySuggestion[];
}

// Common words excluded from repetition / suggestion analysis so the
// "Repeated Words" list surfaces meaningful vocabulary, not function words.
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "of", "to",
  "in", "on", "for", "with", "as", "by", "at", "from", "is", "was", "were",
  "are", "be", "been", "being", "it", "its", "this", "that", "these",
  "those", "he", "she", "they", "we", "you", "i", "his", "her", "their",
  "our", "your", "my", "him", "them", "us", "me", "not", "no", "so", "do",
  "does", "did", "have", "has", "had", "will", "would", "can", "could",
  "should", "just", "up", "out", "about", "into", "over", "after",
  "before", "than", "too", "very", "also", "there", "here", "when",
  "where", "who", "what", "which",
]);

// Small curated synonym bank for words that are commonly overused in
// creative writing. Not exhaustive by design — this powers a handful of
// concrete, actionable suggestions rather than a full thesaurus lookup.
const SYNONYM_BANK: Record<string, string[]> = {
  said: ["remarked", "murmured", "replied"],
  really: ["genuinely", "truly", "notably"],
  good: ["admirable", "commendable", "fine"],
  bad: ["dreadful", "poor", "troubling"],
  big: ["immense", "substantial", "sizable"],
  small: ["modest", "compact", "slight"],
  nice: ["pleasant", "agreeable", "delightful"],
  happy: ["joyful", "content", "elated"],
  sad: ["sorrowful", "downcast", "mournful"],
  looked: ["glanced", "gazed", "peered"],
  walked: ["strode", "wandered", "ambled"],
  suddenly: ["abruptly", "unexpectedly", "without warning"],
  beautiful: ["stunning", "striking", "lovely"],
};

const splitSentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

const splitWords = (text: string): string[] =>
  text.toLowerCase().match(/[a-z']+/g) || [];

// Heuristic vowel-group syllable counter. Not linguistically perfect, but
// consistent enough to drive a relative readability score.
const countSyllables = (word: string): number => {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  const vowelGroups = clean.match(/[aeiouy]+/g) || [];
  let count = vowelGroups.length;
  if (clean.endsWith("e") && count > 1) count -= 1;
  return Math.max(count, 1);
};

const clampScore = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Analyzes a story's vocabulary using real text metrics:
 * - readabilityScore: Flesch Reading Ease, computed from actual
 *   sentence/word/syllable counts (higher = easier to read).
 * - diversityScore: type-token ratio (unique words / total words).
 * - repeatedWords: non-stopwords used 3+ times in the story.
 * - suggestions: synonym alternatives for a few of the repeated words,
 *   where a suggestion is available.
 */
export const analyzeVocabulary = (story: string): VocabularyAnalysis => {
  const trimmed = story.trim();

  if (!trimmed) {
    return {
      readabilityScore: 0,
      diversityScore: 0,
      repeatedWords: [],
      suggestions: [],
    };
  }

  const sentences = splitSentences(trimmed);
  const words = splitWords(trimmed);
  const wordCount = words.length || 1;
  const sentenceCount = sentences.length || 1;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschScore =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);
  const readabilityScore = clampScore(fleschScore);

  const uniqueWords = new Set(words);
  const diversityScore = clampScore((uniqueWords.size / wordCount) * 100);

  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length < 4 || STOPWORDS.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  const repeatedEntries = Array.from(freq.entries())
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const repeatedWords = repeatedEntries.map(([word]) => word);

  const suggestions: VocabularySuggestion[] = repeatedEntries
    .filter(([word]) => SYNONYM_BANK[word])
    .slice(0, 5)
    .map(([word, count], idx) => {
      const options = SYNONYM_BANK[word];
      const replacement = options[idx % options.length];
      return {
        id: `vocab-${word}-${idx}`,
        word,
        replacement,
        reason: `"${word}" appears ${count} times — try varying it with "${replacement}" in some places.`,
      };
    });

  return { readabilityScore, diversityScore, repeatedWords, suggestions };
};

export const refreshVocabularyAnalysis = (
  story: string
): VocabularyAnalysis => {
  return analyzeVocabulary(story);
};

export const getReadabilityLevel = (
  score: number
): string => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};