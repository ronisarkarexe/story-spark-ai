import { adventureEffects } from "./animations/adventure.effects";
import { fantasyEffects } from "./animations/fantasy.effects";
import { horrorEffects } from "./animations/horror.effects";
import { romanceEffects } from "./animations/romance.effects";
import { scifiEffects } from "./animations/scifi.effects";

export type StoryMood =
  | "romance"
  | "horror"
  | "fantasy"
  | "sci-fi"
  | "mystery"
  | "comedy"
  | "adventure"
  | "drama";

export type NarrationTone =
  | "warm"
  | "dramatic"
  | "mystical"
  | "precise"
  | "bold"
  | "curious"
  | "playful"
  | "grounded";

export interface MoodProfile {
  mood: StoryMood;
  confidence: number;
  animationTheme: StoryMood | "cinematic";
  soundTheme: string;
  backgroundStyle: string;
  overlayEffect: string;
  narrationTone: NarrationTone;
  accentClass: string;
  cardClassName: string;
  particleShape: "heart" | "mist" | "sparkle" | "orb" | "ember" | "star";
  particleColors: string[];
}

interface MoodInput {
  selectedGenre?: string;
  title?: string;
  content?: string;
  prompt?: string;
}

const moodKeywords: Record<StoryMood, string[]> = {
  romance: [
    "romance",
    "love",
    "kiss",
    "heart",
    "wedding",
    "beloved",
    "soulmate",
    "date",
    "affection",
    "passion",
  ],
  horror: [
    "horror",
    "ghost",
    "blood",
    "shadow",
    "monster",
    "curse",
    "haunted",
    "scream",
    "nightmare",
    "fear",
  ],
  fantasy: [
    "fantasy",
    "dragon",
    "magic",
    "kingdom",
    "wizard",
    "spell",
    "enchanted",
    "fae",
    "myth",
    "sword",
  ],
  "sci-fi": [
    "sci-fi",
    "science fiction",
    "robot",
    "android",
    "future",
    "galaxy",
    "space",
    "neon",
    "cyber",
    "alien",
  ],
  mystery: [
    "mystery",
    "clue",
    "detective",
    "secret",
    "hidden",
    "investigation",
    "puzzle",
    "crime",
    "case",
    "unknown",
  ],
  comedy: [
    "comedy",
    "funny",
    "laugh",
    "awkward",
    "chaos",
    "joke",
    "ridiculous",
    "goofy",
    "quirky",
    "hilarious",
  ],
  adventure: [
    "adventure",
    "journey",
    "quest",
    "escape",
    "treasure",
    "wild",
    "expedition",
    "hero",
    "battle",
    "voyage",
  ],
  drama: [
    "drama",
    "family",
    "loss",
    "choice",
    "regret",
    "hope",
    "memory",
    "conflict",
    "relationship",
    "life",
  ],
};

const moodBaseProfiles: Record<StoryMood, Omit<MoodProfile, "confidence">> = {
  romance: {
    mood: "romance",
    ...romanceEffects,
  } as Omit<MoodProfile, "confidence">,
  horror: {
    mood: "horror",
    ...horrorEffects,
  } as Omit<MoodProfile, "confidence">,
  fantasy: {
    mood: "fantasy",
    ...fantasyEffects,
  } as Omit<MoodProfile, "confidence">,
  "sci-fi": {
    mood: "sci-fi",
    ...scifiEffects,
  } as Omit<MoodProfile, "confidence">,
  mystery: {
    mood: "mystery",
    animationTheme: "cinematic",
    soundTheme: "tense-echoes",
    backgroundStyle: "from-slate-950 via-slate-900 to-indigo-950/80",
    overlayEffect: "vignette",
    narrationTone: "curious",
    accentClass: "from-slate-200 via-indigo-200 to-cyan-200",
    cardClassName:
      "border-indigo-300/20 bg-slate-950/40 shadow-[0_0_70px_rgba(99,102,241,0.15)]",
    particleShape: "star",
    particleColors: ["#cbd5e1", "#818cf8", "#67e8f9"],
  },
  comedy: {
    mood: "comedy",
    animationTheme: "cinematic",
    soundTheme: "playful-bounce",
    backgroundStyle: "from-slate-950 via-orange-900/90 to-yellow-900/80",
    overlayEffect: "glow",
    narrationTone: "playful",
    accentClass: "from-yellow-200 via-orange-200 to-pink-200",
    cardClassName:
      "border-yellow-300/20 bg-slate-950/35 shadow-[0_0_65px_rgba(251,191,36,0.16)]",
    particleShape: "star",
    particleColors: ["#fde68a", "#fdba74", "#f9a8d4"],
  },
  adventure: {
    mood: "adventure",
    ...adventureEffects,
  } as Omit<MoodProfile, "confidence">,
  drama: {
    mood: "drama",
    animationTheme: "cinematic",
    soundTheme: "soft-strings",
    backgroundStyle: "from-slate-950 via-blue-950/85 to-violet-950/80",
    overlayEffect: "glow",
    narrationTone: "grounded",
    accentClass: "from-slate-100 via-blue-200 to-violet-200",
    cardClassName:
      "border-blue-300/20 bg-slate-950/40 shadow-[0_0_70px_rgba(96,165,250,0.15)]",
    particleShape: "star",
    particleColors: ["#bfdbfe", "#c4b5fd", "#e2e8f0"],
  },
};

const normalizeGenre = (value?: string) =>
  value?.toLowerCase().replace(/[^\w\s-]/g, "").trim() ?? "";

export const detectStoryMood = ({
  selectedGenre,
  title,
  content,
  prompt,
}: MoodInput): MoodProfile => {
  const mergedText = [selectedGenre, title, content, prompt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const scores = Object.entries(moodKeywords).reduce(
    (acc, [mood, keywords]) => {
      const directGenreBoost = normalizeGenre(selectedGenre).includes(mood)
        ? 4
        : 0;
      const keywordScore = keywords.reduce((sum, keyword) => {
        const matches = mergedText.match(new RegExp(keyword, "g"));
        return sum + (matches?.length ?? 0);
      }, 0);

      acc[mood as StoryMood] = keywordScore + directGenreBoost;
      return acc;
    },
    {} as Record<StoryMood, number>
  );

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [winningMood, topScore] = sortedScores[0] as [StoryMood, number];
  const [, runnerUpScore = 0] = sortedScores[1] ?? [];
  const fallbackMood: StoryMood = normalizeGenre(selectedGenre).includes("sci")
    ? "sci-fi"
    : normalizeGenre(selectedGenre).includes("horror")
      ? "horror"
      : normalizeGenre(selectedGenre).includes("romance")
        ? "romance"
        : normalizeGenre(selectedGenre).includes("fantasy")
          ? "fantasy"
          : normalizeGenre(selectedGenre).includes("mystery")
            ? "mystery"
            : normalizeGenre(selectedGenre).includes("comedy")
              ? "comedy"
              : normalizeGenre(selectedGenre).includes("adventure")
                ? "adventure"
                : "drama";

  const mood = topScore > 0 ? winningMood : fallbackMood;
  const confidence = Math.min(
    0.98,
    Math.max(0.45, 0.5 + (topScore - Number(runnerUpScore || 0)) * 0.08)
  );

  return {
    ...moodBaseProfiles[mood],
    confidence,
  };
};

export const extractDialogues = (content: string) => {
  const quoteMatches = content.match(/["“][^"”]+["”]/g) ?? [];
  return quoteMatches.map((entry, index) => ({
    id: `${index}-${entry.slice(0, 12)}`,
    text: entry.replace(/["”“]/g, "").trim(),
  }));
};
