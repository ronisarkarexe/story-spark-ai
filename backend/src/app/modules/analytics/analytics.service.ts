import { Post } from "../post/post.model";
import { Types } from "mongoose";
import { ITokenPayload } from "../../../interfaces/token";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "dare",
  "it", "its", "this", "that", "these", "those", "i", "you", "he", "she",
  "we", "they", "my", "your", "his", "her", "our", "their", "what", "which",
  "who", "when", "where", "why", "how", "all", "each", "every", "both",
  "few", "more", "most", "other", "some", "such", "no", "not", "only",
  "same", "so", "than", "too", "very", "just", "as", "up", "out", "if",
]);

const getOverview = async (token: ITokenPayload) => {
  const userObjectId = new Types.ObjectId(token._id);

  const posts = await Post.find({ author: userObjectId }).lean() as Array<Record<string, any>>;
  const totalStories = posts.length;
  const totalWords = posts.reduce((sum, p) => {
    return sum + (p.content?.split(/\s+/).length || 0);
  }, 0);

  // Calculate writing streak
  const dates = posts
    .map((p) => new Date(p.publishedAt || p.createdAt).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);

  return {
    totalStories,
    totalWords,
    currentStreak,
    longestStreak,
    totalLikes,
    totalViews,
  };
};

const getHeatmap = async (token: ITokenPayload) => {
  const userObjectId = new Types.ObjectId(token._id);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const posts = await Post.find({
    author: userObjectId,
    publishedAt: { $gte: oneYearAgo },
  }).lean() as Array<Record<string, any>>;

  const heatmap: Record<string, number> = {};
  posts.forEach((p) => {
    const date = new Date(p.publishedAt || p.createdAt)
      .toISOString()
      .split("T")[0];
    heatmap[date] = (heatmap[date] || 0) + 1;
  });

  return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
};

const getGenreDistribution = async (token: ITokenPayload) => {
  const userObjectId = new Types.ObjectId(token._id);

  const result = await Post.aggregate([
    { $match: { author: userObjectId } },
    { $unwind: "$topic" },
    { $match: { "topic.selected": true } },
    { $group: { _id: "$topic.title", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return result.map((r) => ({ genre: r._id, count: r.count }));
};

const getWordCloud = async (token: ITokenPayload) => {
  const userObjectId = new Types.ObjectId(token._id);
  const posts = await Post.find({ author: userObjectId })
    .select("content title")
    .lean();

  const wordCount: Record<string, number> = {};
  posts.forEach((p) => {
    const text = `${p.title} ${p.content}`.toLowerCase();
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    words.forEach((word) => {
      if (!STOP_WORDS.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([text, value]) => ({ text, value }));
};

const getProductiveHours = async (token: ITokenPayload) => {
  const userObjectId = new Types.ObjectId(token._id);
  const posts = await Post.find({ author: userObjectId }).lean() as Array<Record<string, any>>;

  const hourCount: Record<number, number> = {};
  for (let i = 0; i < 24; i++) hourCount[i] = 0;

  posts.forEach((p) => {
    const hour = new Date(p.publishedAt || p.createdAt).getHours();
    hourCount[hour]++;
  });

  return Object.entries(hourCount).map(([hour, count]) => ({
    hour: parseInt(hour),
    count,
  }));
};

export const AnalyticsService = {
  getOverview,
  getHeatmap,
  getGenreDistribution,
  getWordCloud,
  getProductiveHours,
};