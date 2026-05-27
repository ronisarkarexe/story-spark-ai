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