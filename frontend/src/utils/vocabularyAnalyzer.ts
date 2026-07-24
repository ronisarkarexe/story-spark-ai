/**
 * Client-side vocabulary and readability analysis for a story's text.
 *
 * All scoring here runs entirely in the browser against text already held
 * in memory (no network calls), so there is no added latency or API cost.
 */

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

// A small set of common English stopwords. These are excluded from
// "repeated word" detection since their high frequency is normal and not
// a sign of weak/repetitive vocabulary.
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "so", "because",
  "as", "of", "at", "by", "for", "with", "about", "against", "between",
  "into", "through", "during", "before", "after", "above", "below", "to",
  "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
  "further", "once", "is", "am", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "having", "do", "does", "did", "doing",
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us",
  "them", "my", "your", "his", "its", "our", "their", "this", "that",
  "these", "those", "there", "here", "what", "which", "who", "whom",
  "will", "would", "shall", "should", "can", "could", "may", "might",
  "must", "not", "no", "nor", "too", "very", "just", "than", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more",
  "most", "other", "some", "such", "only", "own", "same",
]);

// A small hand-picked synonym table for common words that tend to get
// overused in first-draft prose. Not exhaustive by design: if a word isn't
// in here, we simply skip offering a suggestion for it rather than
// fabricating a poor one.
const SYNONYM_MAP: Record<string, string[]> = {
  said: ["remarked", "stated"],
  good: ["great", "excellent"],
  bad: ["poor", "terrible"],
  big: ["large", "huge"],
  small: ["tiny", "little"],
  happy: ["glad", "joyful"],
  sad: ["unhappy", "sorrowful"],
  walked: ["strolled", "wandered"],
  looked: ["glanced", "gazed"],
  went: ["headed", "traveled"],
  got: ["obtained", "received"],
  nice: ["pleasant", "lovely"],
  very: ["extremely", "remarkably"],
  really: ["truly", "genuinely"],
  suddenly: ["abruptly", "unexpectedly"],
  beautiful: ["gorgeous", "stunning"],
  angry: ["furious", "irritated"],
  scared: ["frightened", "terrified"],
  thought: ["pondered", "considered"],
  asked: ["inquired", "questioned"],
};

/** Splits raw story text into sentences using simple punctuation boundaries. */
const splitSentences = (text: string): string[] => {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const sentences = trimmed
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences.length > 0 ? sentences : [trimmed];
};

/** Splits raw story text into lowercase word tokens (letters/numbers/apostrophes only). */
const splitWords = (text: string): string[] => {
  const matches = text.toLowerCase().match(/[a-z0-9']+/g);
  return matches ? matches.filter((w) => w.replace(/'/g, "").length > 0) : [];
};

/** Rough syllable estimate for a single word, used for readability scoring. */
const countSyllables = (word: string): number => {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return 0;
  if (cleaned.length <= 3) return 1;

  // Drop a silent trailing "e" before counting vowel groups.
  const withoutSilentE = cleaned.replace(/e$/, "");
  const vowelGroups = withoutSilentE.match(/[aeiouy]+/g);
  const count = vowelGroups ? vowelGroups.length : 1;
  return Math.max(1, count);
};

/**
 * Computes a Flesch Reading Ease score (0-100, higher = easier to read)
 * from real sentence/word/syllable counts.
 */
const calculateReadabilityScore = (
  words: string[],
  sentences: string[]
): number => {
  if (words.length === 0 || sentences.length === 0) return 0;

  const syllableCount = words.reduce(
    (total, word) => total + countSyllables(word),
    0
  );

  const wordsPerSentence = words.length / sentences.length;
  const syllablesPerWord = syllableCount / words.length;

  const rawScore =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;

  return Math.round(Math.max(0, Math.min(100, rawScore)));
};

/**
 * Computes a vocabulary diversity score (0-100) from the type-token ratio
 * (unique words ÷ total words). Longer texts naturally reuse words like
 * "the" and "and" more, so the raw ratio is scaled up to keep the score
 * meaningful across both short and long stories.
 */
const calculateDiversityScore = (words: string[]): number => {
  if (words.length === 0) return 0;

  const uniqueWords = new Set(words);
  const typeTokenRatio = uniqueWords.size / words.length;

  // Scale the ratio so typical prose (which naturally reuses function
  // words) doesn't get an artificially low score. The 1.6 multiplier was
  // chosen so a well-varied ~500-word story lands in the 70-90 range.
  const scaled = typeTokenRatio * 160;

  return Math.round(Math.max(0, Math.min(100, scaled)));
};

/**
 * Finds the most frequently used non-stopword tokens in the text — i.e.
 * words a writer may be leaning on too heavily.
 */
const findRepeatedWords = (words: string[], limit = 5): string[] => {
  const frequency = new Map<string, number>();

  for (const word of words) {
    if (word.length < 3) continue;
    if (STOPWORDS.has(word)) continue;
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
};

/**
 * Builds synonym suggestions for the most overused words that we have a
 * known replacement for. Words without a synonym entry are skipped rather
 * than given a fabricated suggestion.
 */
const buildSuggestions = (repeatedWords: string[]): VocabularySuggestion[] => {
  const suggestions: VocabularySuggestion[] = [];

  for (const word of repeatedWords) {
    const synonyms = SYNONYM_MAP[word];
    if (!synonyms || synonyms.length === 0) continue;

    suggestions.push({
      id: `${word}-${synonyms[0]}`,
      word,
      replacement: synonyms.join(" / "),
      reason: `"${word}" appears often in this story — try varying your word choice for stronger prose.`,
    });
  }

  return suggestions;
};

/**
 * Analyzes a story's text and returns real readability, diversity,
 * repeated-word, and synonym-suggestion data computed from the actual
 * content (as opposed to a fixed placeholder).
 */
export const analyzeVocabulary = (story: string): VocabularyAnalysis => {
  const text = story ?? "";
  const words = splitWords(text);
  const sentences = splitSentences(text);

  const readabilityScore = calculateReadabilityScore(words, sentences);
  const diversityScore = calculateDiversityScore(words);
  const repeatedWords = findRepeatedWords(words);
  const suggestions = buildSuggestions(repeatedWords);

  return {
    readabilityScore,
    diversityScore,
    repeatedWords,
    suggestions,
  };
};

export const refreshVocabularyAnalysis = (
  story: string
): VocabularyAnalysis => {
  return analyzeVocabulary(story);
};

export const getReadabilityLevel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};