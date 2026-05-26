import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";

const getDashboardAnalysis = async () => {
  // Run all database queries in parallel for maximum throughput.
  // Each query is handled by MongoDB's engine — nothing is loaded into
  // Node.js memory, so this stays fast regardless of collection size.
  const [
    // ── User counts ──
    totalUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    writers,
    applyForWriter,

    // ── Subscription counts ──
    freeUsers,
    proUsers,
    premiumUsers,

    // ── Post counts ──
    totalPosts,
    publishedPosts,
    featuredPosts,

    // ── Post aggregations ──
    postsPerMonthAgg,
    topicCountAgg,
  ] = await Promise.all([
    // User counts
    User.countDocuments({}),
    User.countDocuments({ status: USER_STATUS.ACTIVE }),
    User.countDocuments({ status: USER_STATUS.INACTIVE }),
    User.countDocuments({ status: USER_STATUS.BLOCKED }),
    User.countDocuments({ role: ENUM_USER_ROLE.WRITER }),
    User.countDocuments({ isApplyForWriter: true }),

    // Subscription counts
    User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.FREE }),
    User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PRO }),
    User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PREMIUM }),

    // Post counts
    Post.countDocuments({}),
    Post.countDocuments({ isPublished: true }),
    Post.countDocuments({ isFeaturedPost: true }),

    // Posts per month — group by YYYY-MM substring of publishedAt
    Post.aggregate<{ _id: string; count: number }>([
      { $match: { publishedAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Topic frequency — unwind the topic array, then count per title
    Post.aggregate<{ _id: string; count: number }>([
      { $unwind: "$topic" },
      {
        $group: {
          _id: "$topic.title",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Convert aggregation arrays into the same { key: count } map shape
  // that the existing frontend expects.
  const postsPerMonth: Record<string, number> = {};
  for (const entry of postsPerMonthAgg) {
    postsPerMonth[entry._id] = entry.count;
  }

  const topicCount: Record<string, number> = {};
  for (const entry of topicCountAgg) {
    topicCount[entry._id] = entry.count;
  }

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      blocked: blockedUsers,
      writers,
      applyForWriter,
    },
    subscriptionTypes: {
      free: freeUsers,
      pro: proUsers,
      premium: premiumUsers,
    },
    posts: {
      total: totalPosts,
      published: publishedPosts,
      featured: featuredPosts,
      perMonth: postsPerMonth,
      topics: topicCount,
    },
  };
};

export const AnalysisService = {
  getDashboardAnalysis,
};
