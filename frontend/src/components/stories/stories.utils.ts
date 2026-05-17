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

export interface ITopicData {
  title: string;
  color: string;
  selected: boolean;
}

export const topicsData: ITopicData[] = [
  {
    title: "#AIWriting",
    color:
      "border-sky-400/45 bg-sky-500/25 text-sky-100 shadow-sm shadow-sky-500/20",
    selected: true,
  },
  {
    title: "#StoryGeneration",
    color:
      "border-violet-400/45 bg-violet-500/25 text-violet-100 shadow-sm shadow-violet-500/20",
    selected: true,
  },
  {
    title: "#Writing",
    color:
      "border-indigo-400/45 bg-indigo-500/25 text-indigo-100 shadow-sm shadow-indigo-500/20",
    selected: false,
  },
  {
    title: "#Creativity",
    color:
      "border-emerald-400/45 bg-emerald-500/25 text-emerald-100 shadow-sm shadow-emerald-500/20",
    selected: false,
  },
  {
    title: "#DigitalMarketing",
    color:
      "border-amber-400/45 bg-amber-500/25 text-amber-100 shadow-sm shadow-amber-500/20",
    selected: false,
  },
  {
    title: "#Storytelling",
    color:
      "border-fuchsia-400/45 bg-fuchsia-500/25 text-fuchsia-100 shadow-sm shadow-fuchsia-500/20",
    selected: false,
  },
  {
    title: "#Productivity",
    color:
      "border-rose-400/45 bg-rose-500/25 text-rose-100 shadow-sm shadow-rose-500/20",
    selected: false,
  },
];

export const getWordCount = (str: string) => {
  if (typeof str !== "string" || !str.trim()) {
    return 0;
  }
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => /^[a-zA-Z]+$/.test(word)).length;
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
    prompt: "Tell the story of a robot who desperately wants to become human.",
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
