import { REQUEST_LIMITS } from "../../constants/subscription";

export const SELECTED_TOPIC_CLASSES = "bg-indigo-100 text-indigo-800";
export const UNSELECTED_TOPIC_CLASSES = "bg-slate-700 text-slate-300";

export interface ITopicData {
  title: string;
  color: string;
  className: string;
  selected: boolean;
}

export const topicsData: ITopicData[] = [
  { title: "#AIWriting", color: SELECTED_TOPIC_CLASSES, className: SELECTED_TOPIC_CLASSES, selected: true },
  { title: "#StoryGeneration", color: SELECTED_TOPIC_CLASSES, className: SELECTED_TOPIC_CLASSES, selected: true },
  { title: "#Writing", color: UNSELECTED_TOPIC_CLASSES, className: UNSELECTED_TOPIC_CLASSES, selected: false },
  { title: "#Creativity", color: UNSELECTED_TOPIC_CLASSES, className: UNSELECTED_TOPIC_CLASSES, selected: false },
  { title: "#DigitalMarketing", color: UNSELECTED_TOPIC_CLASSES, className: UNSELECTED_TOPIC_CLASSES, selected: false },
  { title: "#Storytelling", color: UNSELECTED_TOPIC_CLASSES, className: UNSELECTED_TOPIC_CLASSES, selected: false },
  { title: "#Productivity", color: UNSELECTED_TOPIC_CLASSES, className: UNSELECTED_TOPIC_CLASSES, selected: false },
];

export const getShortenedText = (content: string | undefined, wordLimit = 35): string => {
  if (!content) return "";
  const words = content.split(" ");
  return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}...` : content;
};

export const getRequestLimit = (subscriptionType: string) => {
  if (subscriptionType === "free") return REQUEST_LIMITS.free;
  if (subscriptionType === "pro") return REQUEST_LIMITS.pro;
  if (subscriptionType === "premium") return REQUEST_LIMITS.premium;
  return 3;
};

export const doPublishAccessibility = (subscriptionType: string) =>
  subscriptionType === "free" || subscriptionType === "pro" || subscriptionType === "premium";

export const getWordCount = (str: string) => {
  if (!str.trim()) return 0;
  return str.trim().split(/\s+/).length;
};

export const prompts = [
  { id: 1, prompt: "A brave knight discovers a hidden portal in the castle basement." },
  { id: 2, prompt: "Describe a world where animals can speak and humans negotiate peace treaties." },
  { id: 3, prompt: "Write a heartwarming story about two childhood friends reunited after 20 years." },
  { id: 4, prompt: "Imagine a future where dreams can be recorded and sold as entertainment." },
  { id: 5, prompt: "A scientist creates a serum that lets people see 60 seconds into the future." },
];
