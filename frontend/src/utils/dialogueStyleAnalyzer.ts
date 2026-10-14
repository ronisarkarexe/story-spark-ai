import type { CharacterDialogueAnalysis } from "../types/dialogue";

interface DialogueLine {
  character: string;
  text: string;
  position: number;
}

interface CharacterStats {
  character: string;
  words: string[];
  vocabulary: Set<string>;
  sentences: string[];
  averageSentenceLength: number;
  sentenceLengthRange: number;
  questionCount: number;
  exclamationCount: number;
}

const STOPWORDS = new Set([
  "a", "about", "after", "all", "am", "an", "and", "any", "are", "as",
  "at", "be", "because", "been", "before", "being", "but", "by", "can",
  "could", "did", "do", "does", "down", "each", "for", "from", "had",
  "has", "have", "he", "her", "hers", "him", "his", "how", "i", "if",
  "in", "into", "is", "it", "its", "just", "me", "more", "most", "my",
  "no", "not", "of", "off", "on", "once", "only", "or", "other", "our",
  "ours", "out", "over", "own", "same", "she", "should", "so", "some",
  "such", "than", "that", "the", "their", "theirs", "them", "then",
  "there", "these", "they", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "we", "were", "what", "when",
  "where", "which", "while", "who", "whom", "why", "will", "with",
  "would", "you", "your", "yours",
]);

const SPEAKER = String.raw`\p{Lu}[\p{L}\p{M}'’-]*(?:\s+\p{Lu}[\p{L}\p{M}'’-]*){0,2}`;
const SPEECH_VERBS =
  "said|says|asked|asks|replied|replies|answered|answers|whispered|whispers|shouted|shouts|cried|cries|murmured|murmurs|called|calls|exclaimed|exclaims";

const getDialogueLines = (story: string): DialogueLine[] => {
  const matches: DialogueLine[] = [];
  const addMatch = (character: string, text: string, position: number) => {
    const normalizedCharacter = character.trim().replace(/\s+/g, " ");
    const normalizedText = text
      .replace(/^\s*["“]|["”]\s*$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (normalizedCharacter && normalizedText) {
      matches.push({
        character: normalizedCharacter,
        text: normalizedText,
        position,
      });
    }
  };

  const labeledDialogue = new RegExp(
    String.raw`^\s*(${SPEAKER})\s*:\s*(.+?)\s*$`,
    "gmu"
  );
  for (const match of story.matchAll(labeledDialogue)) {
    addMatch(match[1], match[2], match.index);
  }

  const speakerBeforeDialogue = new RegExp(
    String.raw`\b(${SPEAKER})\s+(?:${SPEECH_VERBS})\s*,?\s*["“]([\s\S]*?)["”]`,
    "gu"
  );
  for (const match of story.matchAll(speakerBeforeDialogue)) {
    addMatch(match[1], match[2], match.index);
  }

  const speakerAfterDialogue = new RegExp(
    String.raw`["“]([\s\S]*?)["”]\s*,?\s+(?:${SPEECH_VERBS})\s+(${SPEAKER})`,
    "gu"
  );
  for (const match of story.matchAll(speakerAfterDialogue)) {
    addMatch(match[2], match[1], match.index);
  }

  const seen = new Set<string>();
  return matches
    .sort((a, b) => a.position - b.position)
    .filter((line) => {
      const key = `${line.character.toLowerCase()}|${line.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const getWords = (text: string): string[] =>
  text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];

const getSentences = (text: string): string[] =>
  text
    .match(/[^.!?]+(?:[.!?]+|$)/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];

const getCharacterStats = (
  character: string,
  lines: string[]
): CharacterStats => {
  const dialogue = lines.join(" ");
  const words = getWords(dialogue);
  const sentences = getSentences(dialogue);
  const vocabulary = new Set(words.filter((word) => !STOPWORDS.has(word)));
  const sentenceLengths = sentences.map((sentence) => getWords(sentence).length);

  return {
    character,
    words,
    vocabulary,
    sentences,
    averageSentenceLength: sentenceLengths.length
      ? sentenceLengths.reduce((total, length) => total + length, 0) /
        sentenceLengths.length
      : 0,
    sentenceLengthRange: sentenceLengths.length
      ? Math.max(...sentenceLengths) - Math.min(...sentenceLengths)
      : 0,
    questionCount: (dialogue.match(/\?/g) ?? []).length,
    exclamationCount: (dialogue.match(/!/g) ?? []).length,
  };
};

const getSimilarity = (first: Set<string>, second: Set<string>): number => {
  const union = new Set([...first, ...second]);
  if (union.size === 0) return 0;
  const sharedWords = [...first].filter((word) => second.has(word)).length;
  return sharedWords / union.size;
};

const describeSpeechPattern = (stats: CharacterStats): string => {
  const average = Math.round(stats.averageSentenceLength);
  const lengthStyle =
    average <= 8 ? "concise" : average <= 15 ? "moderate" : "elaborate";
  const punctuationStyles: string[] = [];

  if (stats.sentences.length > 0) {
    if (stats.questionCount / stats.sentences.length >= 0.5) {
      punctuationStyles.push("frequent questions");
    }
    if (stats.exclamationCount / stats.sentences.length >= 0.5) {
      punctuationStyles.push("frequent exclamations");
    }
  }

  const punctuationDescription = punctuationStyles.length
    ? `; uses ${punctuationStyles.join(" and ")}`
    : "; mostly declarative punctuation";

  return `Typically ${lengthStyle} sentences (about ${average} words each)${punctuationDescription}.`;
};

const getSuggestions = (
  stats: CharacterStats,
  uniquenessScore: number,
  similarTo?: string
): string[] => {
  const suggestions: string[] = [];
  const contentWordCount = stats.words.filter(
    (word) => !STOPWORDS.has(word)
  ).length;

  if (contentWordCount < 5) {
    suggestions.push(
      `Add more dialogue for ${stats.character} to make the vocabulary analysis more reliable.`
    );
  }

  if (contentWordCount >= 5 && uniquenessScore < 50) {
    suggestions.push(
      `Give ${stats.character} more distinctive vocabulary; their measured vocabulary distinctiveness score is ${uniquenessScore}%.`
    );
  }

  if (
    stats.sentences.length >= 2 &&
    stats.averageSentenceLength <= 8 &&
    stats.sentenceLengthRange <= 2
  ) {
    suggestions.push(
      `Vary ${stats.character}'s sentence lengths to add more rhythm to their dialogue.`
    );
  }

  if (similarTo) {
    suggestions.push(
      `Differentiate ${stats.character}'s word choices or speech rhythm from ${similarTo}.`
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      `${stats.character}'s dialogue has a distinct vocabulary and a consistent speech pattern.`
    );
  }

  return suggestions;
};

export function analyzeDialogue(story: string): CharacterDialogueAnalysis[] {
  const dialogueLines = getDialogueLines(story);
  const linesByCharacter = new Map<
    string,
    { character: string; lines: string[] }
  >();

  for (const line of dialogueLines) {
    const key = line.character.toLowerCase();
    const existing = linesByCharacter.get(key);
    if (existing) {
      existing.lines.push(line.text);
    } else {
      linesByCharacter.set(key, {
        character: line.character,
        lines: [line.text],
      });
    }
  }

  const characters = [...linesByCharacter.values()].map(
    ({ character, lines }) => getCharacterStats(character, lines)
  );

  return characters.map((stats, index) => {
    const otherVocabulary = new Set(
      characters
        .filter((_, otherIndex) => otherIndex !== index)
        .flatMap((other) => [...other.vocabulary])
    );
    const vocabulary = [...stats.vocabulary];
    const uniqueWordCount = vocabulary.filter(
      (word) => !otherVocabulary.has(word)
    ).length;
    const contentWordCount = stats.words.filter(
      (word) => !STOPWORDS.has(word)
    ).length;
    const lexicalDiversity = contentWordCount
      ? stats.vocabulary.size / contentWordCount
      : 0;
    const distinctiveVocabulary = vocabulary.length
      ? uniqueWordCount / vocabulary.length
      : 0;
    const uniquenessScore = Math.round(
      ((lexicalDiversity + distinctiveVocabulary) / 2) * 100
    );

    let nearestCharacter: CharacterStats | undefined;
    let highestSimilarity = 0;
    for (const [otherIndex, other] of characters.entries()) {
      if (otherIndex === index) continue;
      const similarity = getSimilarity(stats.vocabulary, other.vocabulary);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        nearestCharacter = other;
      }
    }

    const similarTo =
      stats.vocabulary.size >= 5 &&
      nearestCharacter?.vocabulary.size &&
      nearestCharacter.vocabulary.size >= 5 &&
      highestSimilarity >= 0.5
        ? nearestCharacter.character
        : undefined;
    const vocabularyStyle =
      uniquenessScore >= 75
        ? "Distinct"
        : uniquenessScore >= 45
          ? "Moderately Distinct"
          : "Similar";

    return {
      id: index + 1,
      character: stats.character,
      uniquenessScore,
      vocabularyStyle,
      speechPattern: describeSpeechPattern(stats),
      similarTo,
      suggestions: getSuggestions(stats, uniquenessScore, similarTo),
    };
  });
}
