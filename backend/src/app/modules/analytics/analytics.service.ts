import { Post } from "../post/post.model";
import { Types } from "mongoose";
import { ITokenPayload } from "../../../interfaces/token";
import { performance } from "perf_hooks";

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

const SERVER_TIME_ZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const runMeasuredAnalytics = async <T>(
  label: string,
  operation: () => Promise<T>
): Promise<T> => {
  if (process.env.ANALYTICS_BENCHMARK !== "1") {
    return operation();
  }

  const start = performance.now();
  const heapBefore = process.memoryUsage().heapUsed;

  try {
    return await operation();
  } finally {
    const durationMs = performance.now() - start;
    const heapAfter = process.memoryUsage().heapUsed;
    const heapDeltaKb = (heapAfter - heapBefore) / 1024;

    console.info(
      `[analytics:benchmark] ${label} duration=${durationMs.toFixed(
        2
      )}ms heapDelta=${heapDeltaKb.toFixed(2)}KB`
    );
  }
};

const getOverview = async (token: ITokenPayload | null) => {
  if (!token?._id) {
    return {
      totalStories: 0,
      totalWords: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalLikes: 0,
      totalViews: 0,
    };
  }

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

  let shortStories = 0;
  let mediumStories = 0;
  let longStories = 0;

  posts.forEach(p => {
    const wordCount = p.content?.split(/\s+/).length || 0;
    if (wordCount < 500) {
      shortStories++;
    } else if (wordCount <= 2000) {
      mediumStories++;
    } else {
      longStories++;
    }
  });

  return {
    totalStories,
    totalWords,
    currentStreak,
    longestStreak,
    totalLikes,
    totalViews,
    storyLengths: {
      short: shortStories,
      medium: mediumStories,
      long: longStories
    }
  };
};

const getHeatmap = async (token: ITokenPayload | null) => {
  if (!token?._id) {
  return [];
}
  const userObjectId = new Types.ObjectId(token._id);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return runMeasuredAnalytics("heatmap", async () =>
    Post.aggregate([
      {
        $match: {
          author: userObjectId,
          publishedAt: { $gte: oneYearAgo },
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $ifNull: ["$publishedAt", "$createdAt"] },
            },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ])
  );
};

const getGenreDistribution = async (token: ITokenPayload | null) => {
if (!token?._id) {
  return [];
}
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

const getWordCloud = async (token: ITokenPayload | null) => {
  if (!token?._id) {
  return [];
}
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

const getProductiveHours = async (token: ITokenPayload | null) => {
  if(!token?._id){
    return []
  }
  const userObjectId = new Types.ObjectId(token._id);

  return runMeasuredAnalytics("productive-hours", async () => {
    const rows = await Post.aggregate([
      { $match: { author: userObjectId } },
      {
        $project: {
          hour: {
            $hour: {
              date: { $ifNull: ["$publishedAt", "$createdAt"] },
              timezone: SERVER_TIME_ZONE,
            },
          },
        },
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          count: 1,
        },
      },
      { $sort: { hour: 1 } },
    ]);

    const countByHour = new Map<number, number>(
      rows.map((row: { hour: number; count: number }) => [
        row.hour,
        row.count,
      ])
    );

    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: countByHour.get(hour) ?? 0,
    }));
  });
};

const getEmotionDistribution = async (token: ITokenPayload | null) => {
  if (!token?._id) {
    return [];
  } 
  const userObjectId = new Types.ObjectId(token._id);

  const result = await Post.aggregate([
    { $match: { author: userObjectId } },
    { $unwind: "$emotions" },
    { $group: { _id: "$emotions", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return result.map((r) => ({ emotion: r._id, count: r.count }));
};

const getMoodTimeline = async (token: ITokenPayload | null) => {
    if (!token?._id) {
    return [];
  } 
  const userObjectId = new Types.ObjectId(token._id);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return runMeasuredAnalytics("mood-timeline", async () =>
    Post.aggregate([
      {
        $match: {
          author: userObjectId,
          publishedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $project: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: { $ifNull: ["$publishedAt", "$createdAt"] },
            },
          },
          emotions: {
            $cond: [{ $isArray: "$emotions" }, "$emotions", []],
          },
        },
      },
      {
        $unwind: {
          path: "$emotions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
            emotion: { $ifNull: ["$emotions", null] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          emotionPairs: {
            $push: {
              k: "$_id.emotion",
              v: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          emotions: {
            $arrayToObject: {
              $filter: {
                input: "$emotionPairs",
                as: "pair",
                cond: { $ne: ["$$pair.k", null] },
              },
            },
          },
        },
      },
      { $sort: { month: 1 } },
    ])
  );
};

export const AnalyticsService = {
  getOverview,
  getHeatmap,
  getGenreDistribution,
  getWordCloud,
  getProductiveHours,
  getEmotionDistribution,
  getMoodTimeline,
};
