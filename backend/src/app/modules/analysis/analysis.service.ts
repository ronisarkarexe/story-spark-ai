import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { WriterApplication } from "../writer_application/writer_application.model";

const getDashboardAnalysis = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  const role = user.role;
  const posts = await Post.find({ author: userId }).lean();
  const totalPosts = posts.length;

  const postsPerMonth: Record<string, number> = {};
  const topicCount: Record<string, number> = {};

  posts.forEach((post: any) => {
    const month = new Date(post.createdAt).toISOString().slice(0, 7);
    postsPerMonth[month] = (postsPerMonth[month] || 0) + 1;
    if (Array.isArray(post.topic)) {
      post.topic.forEach((t: any) => {
        if (t?.title) topicCount[t.title] = (topicCount[t.title] || 0) + 1;
      });
    }
  });

  if (role === ENUM_USER_ROLE.WRITER || role === ENUM_USER_ROLE.ADMIN) {
    const totalReaders = user.followers?.length || 0;
    const applicationStatus =
      (await WriterApplication.findOne({ user: userId }))?.status || "none";

    return {
      role,
      writerStats: {
        totalReaders,
        totalPosts,
        subscriptionStatus: user.subscriptionType
          ? user.subscriptionType.toUpperCase()
          : "FREE",
        applicationStatus,
        gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
      },
      posts: { perMonth: postsPerMonth, topics: topicCount },
    };
  }

  return {
    role,
    posts: { perMonth: postsPerMonth, topics: topicCount },
  };
};

const analyzeStory = async (content: string) => {
  const suggestions: Array<{
    id: string;
    category: "Style" | "Readability" | "Vocabulary" | "Dialogue" | "Pacing";
    title: string;
    description: string;
    originalText?: string;
    suggestedText?: string;
  }> = [];

  const generateId = (prefix: string, index: number) => `${prefix}_${index}_${Math.random().toString(36).substr(2,9)}`;
  const cleanText = content.replace(/[\r\n]+/g, " ").trim();
  const words = cleanText.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase()).filter(Boolean);

  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","for","of","with","to","is","was","were",
    "it","he","she","they","you","we","i","my","his","her","their","its","had","have","has",
    "been","would","could","should","will","that","this","there","then","thence","thus"
  ]);

  const wordCounts: Record<string, number> = {};
  words.forEach(w => {
    if (w.length >= 4 && !stopWords.has(w)) wordCounts[w] = (wordCounts[w] || 0) + 1;
  });

  const synonymMap: Record<string, string[]> = {
    amazing: ["extraordinary","magnificent","marvelous","wonderful"],
    great: ["outstanding","exceptional","remarkable","splendid"],
    good: ["favorable","excellent","superb","satisfying"],
    bad: ["dreadful","awful","severe","unfavorable"],
    happy: ["joyful","ecstatic","cheerful","jubilant"],
    sad: ["gloomy","sorrowful","melancholy","downcast"],
    said: ["declared","stated","whispered","exclaimed","commented"]
  };

  let wordRepIndex = 0;
  Object.entries(wordCounts).forEach(([word, count]) => {
    if (count >= 3) {
      const synonyms = synonymMap[word] || [];
      const match = content.match(new RegExp(`\\b${word}\\b`, "i"));
      const originalText = match ? match[0] : word;
      suggestions.push({
        id: generateId("rep_word", wordRepIndex++),
        category: "Vocabulary",
        title: "Repeated Word Usage",
        description: `The word '${originalText}' appears frequently (${count} times). Consider using alternatives like ${synonyms.length > 0 ? synonyms.join(", ") : "a synonym"}.`,
        originalText,
        suggestedText: synonyms[0]
      });
    }
  });

  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  let longParaIndex = 0;
  paragraphs.forEach((para, index) => {
    const paraWords = para.split(/\s+/).filter(Boolean);
    if (paraWords.length > 100) {
      suggestions.push({
        id: generateId("long_para", longParaIndex++),
        category: "Readability",
        title: "Very Long Paragraph",
        description: `Paragraph ${index + 1} contains ${paraWords.length} words. Consider splitting it.`,
        originalText: para,
      });
    }
  });

  const allSentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  let longSentenceIndex = 0;
  allSentences.forEach((sentence) => {
    const sentenceWords = sentence.split(/\s+/).filter(Boolean);
    if (sentenceWords.length > 25) {
      suggestions.push({
        id: generateId("long_sentence", longSentenceIndex++),
        category: "Readability",
        title: "Long Sentence",
        description: `This sentence is very long (${sentenceWords.length} words). Consider breaking it down.`,
        originalText: sentence,
      });
    }
  });

  if (paragraphs.length >= 3) {
    const lengths = paragraphs.map(p => p.split(/\s+/).filter(Boolean).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const stdDev = Math.sqrt(lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length);
    if (avgLength > 80 && stdDev < 15) {
      suggestions.push({
        id: generateId("pacing_monotony", 1),
        category: "Pacing",
        title: "Monotonous Paragraph Length",
        description: "Most paragraphs are similarly long. Try varying lengths for better pacing."
      });
    }
  }

  return { suggestions };
};

export const AnalysisService = {
  getDashboardAnalysis,
  analyzeStory,
};
