import { REQUEST_LIMITS } from "../../constants/subscription";

export const getShortenedText = (
  content: string | undefined,
  wordLimit: number = 35
): string => {
  if (!content) return "";
  const words: string[] = content.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : content;
};

export const getRequestLimit = (subscriptionType: string) => {
  if (subscriptionType === "free") {
    return REQUEST_LIMITS.free;
  } else if (subscriptionType === "pro") {
    return REQUEST_LIMITS.pro;
  } else if (subscriptionType === "premium") {
    return REQUEST_LIMITS.premium;
  } else {
    return 3;
  }
};

export const doPublishAccessibility = (subscriptionType: string) => {
  if (
    subscriptionType === "free" ||
    subscriptionType === "pro" ||
    subscriptionType === "premium"
  ) {
    return true;
  } else {
    return false;
  }
};

export const SELECTED_TOPIC_CLASSES = "bg-indigo-100 text-indigo-800";
export const UNSELECTED_TOPIC_CLASSES = "bg-slate-700 text-slate-300";

export interface ITopicData {
  title: string;
  color: string;
  className: string;
  selected: boolean;
}

export interface CharacterProfile {
  name: string;
  role: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  relationships: string;
}

export const TOPICS: ITopicData[] = [
  {
    title: "#StoryIdeas",
    color: "bg-indigo-100 text-indigo-800",
    className: "bg-indigo-100 text-indigo-800",
    selected: true,
  },
  {
    title: "#StoryGeneration",
    color: "bg-purple-100 text-purple-800",
    className: "bg-purple-100 text-purple-800",
    selected: true,
  },
  {
    title: "#Writing",
    color: "bg-blue-100 text-blue-800",
    className: "bg-blue-100 text-blue-800",
    selected: false,
  },
  {
    title: "#Creativity",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#DigitalMarketing",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#Storytelling",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#Productivity",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
];

export const topicsData: ITopicData[] = TOPICS;

export const getWordCount = (str: string | undefined): number => {
  if (typeof str !== "string") {
    return 0;
  }

  const normalizedText = str.replace(/[\r\n]+/g, " ").trim();
  if (!normalizedText) {
    return 0;
  }

  return normalizedText.split(/\s+/).length;
};

export const prompts = [
  {
    id: 1,
    prompt:
      "A brave knight discovers a hidden portal in his castle's basement that leads to a mysterious world.",
  },
  {
    id: 2,
    prompt:
      "Describe a world where animals can speak and humans must negotiate peace treaties with them.",
  },
  {
    id: 3,
    prompt:
      "Write a heartwarming story about two childhood friends reunited after 20 years.",
  },
  {
    id: 4,
    prompt:
      "Imagine a future where dreams can be recorded and sold as entertainment.",
  },
  {
    id: 5,
    prompt:
      "A scientist accidentally creates a serum that lets people see the future for 60 seconds.",
  },
  {
    id: 6,
    prompt:
      "Tell the story of a robot who desperately wants to become human.",
  },
  {
    id: 7,
    prompt:
      "A young artist discovers their extraordinary drawings are magically coming to life with unexpected consequences.",
  },
  {
    id: 8,
    prompt:
      "Write a mystery about a locked room with no doors or windows but someone inside.",
  },
  {
    id: 9,
    prompt:
      "Describe a mesmerizing world where music intricately controls the unpredictable weather patterns.",
  },
  {
    id: 10,
    prompt: "A time traveler finds themselves stuck in the age of dinosaurs.",
  },
];

export const TEMPLATE_STORY_UUID = "test-1";
const emotionKeywords = {
  Happy: [
    "happy",
    "joy",
    "smile",
    "laugh",
    "love",
    "wonderful",
    "celebrate",
    "peace"
  ],

  Sad: [
    "sad",
    "cry",
    "tears",
    "pain",
    "lonely",
    "loss",
    "broken"
  ],

  Suspense: [
    "mystery",
    "dark",
    "fear",
    "danger",
    "secret",
    "shadow"
  ],

  Excitement: [
    "adventure",
    "fight",
    "victory",
    "energy",
    "thrill",
    "power"
  ],
};

export const analyzeStoryEmotion = (content: string) => {
  const text = content.toLowerCase();

  const scores = {
    Happy: 0,
    Sad: 0,
    Suspense: 0,
    Excitement: 0,
  };

  Object.entries(emotionKeywords).forEach(([emotion, words]) => {
    words.forEach((word) => {
      if (text.includes(word)) {
        scores[emotion as keyof typeof scores]++;
      }
    });
  });

  const total = Object.values(scores).reduce(
    (sum, value) => sum + value,
    0
  );

  const percentages = Object.fromEntries(
    Object.entries(scores).map(([emotion, value]) => [
      emotion,
      total > 0 ? Math.round((value / total) * 100) : 0,
    ])
  );

  const dominantEmotion =
    Object.entries(scores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

  return {
    scores: percentages,
    dominantEmotion,
  };
};

/**
 * Calculates estimated reading time based on average 200 WPM reading speed.
 * Returns a human-readable string like "1 min read" or "< 1 min read".
 */
export const getReadingTime = (content: string): string => {
  if (!content || !content.trim()) return "";
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.round(wordCount / 200);
  if (minutes < 1) return "< 1 min read";
  return `${minutes} min read`;
};