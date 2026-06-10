import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";

/**
 * Helper to convert a $facet bucket array (e.g. [{ _id: "Active", count: 5 }])
 * into a plain object (e.g. { Active: 5 }).
 */
const bucketToMap = (
  buckets: Array<{ _id: string | null; count: number }>
): Record<string, number> => {
  const map: Record<string, number> = {};
  for (const b of buckets) {
    if (b._id !== null) {
      map[b._id] = b.count;
    }
  }
  return map;
};

const getDashboardAnalysis = async (
  userId?: string,
  role?: string
) => {
  // Run user and post aggregations concurrently for maximum throughput.
  const [userAgg, postAgg] = await Promise.all([
    User.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          bySubscription: [
            { $group: { _id: "$subscriptionType", count: { $sum: 1 } } },
          ],
          applyForWriter: [
            { $match: { isApplyForWriter: true } },
            { $count: "count" },
          ],
        },
      },
    ]),
    Post.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          published: [
            { $match: { isPublished: true } },
            { $count: "count" },
          ],
          featured: [
            { $match: { isFeaturedPost: true } },
            { $count: "count" },
          ],
          perMonth: [
            { $match: { publishedAt: { $ne: null } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          topics: [
            { $unwind: "$topic" },
            {
              $group: {
                _id: "$topic.title",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]),
  ]);

  // Extract results from the $facet output (always a single-element array).
  const userFacet = userAgg[0];
  const postFacet = postAgg[0];

  const statusMap = bucketToMap(userFacet.byStatus);
  const roleMap = bucketToMap(userFacet.byRole);
  const subscriptionMap = bucketToMap(userFacet.bySubscription);

  const postsPerMonth: Record<string, number> = {};
  for (const entry of postFacet.perMonth) {
    postsPerMonth[entry._id] = entry.count;
  }

  const topicCount: Record<string, number> = {};
  for (const entry of postFacet.topics) {
    topicCount[entry._id] = entry.count;
  }

  return {
    users: {
      total: userFacet.total[0]?.count ?? 0,
      active: statusMap[USER_STATUS.ACTIVE] ?? 0,
      inactive: statusMap[USER_STATUS.INACTIVE] ?? 0,
      blocked: statusMap[USER_STATUS.BLOCKED] ?? 0,
      writers: roleMap[ENUM_USER_ROLE.WRITER] ?? 0,
      applyForWriter: userFacet.applyForWriter[0]?.count ?? 0,
    },
    subscriptionTypes: {
      free: subscriptionMap[SUBSCRIPTION_TYPE.FREE] ?? 0,
      pro: subscriptionMap[SUBSCRIPTION_TYPE.PRO] ?? 0,
      premium: subscriptionMap[SUBSCRIPTION_TYPE.PREMIUM] ?? 0,
    },
    posts: {
      total: postFacet.total[0]?.count ?? 0,
      published: postFacet.published[0]?.count ?? 0,
      featured: postFacet.featured[0]?.count ?? 0,
      perMonth: postsPerMonth,
      topics: topicCount,
    },
  };
};
const analyzeStory = async (content: string) => {
  return {
    summary: "Analysis feature temporarily unavailable",
    contentLength: content?.length || 0,
  };
};

export const AnalysisService = {
  getDashboardAnalysis,
  analyzeStory,
};
