import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { WriterApplication } from "../writer_application/writer_application.model";

const getDashboardAnalysis = async (userId: string, role: string) => {
  // If Admin or Super Admin, return global dashboard analysis
  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      blockedUsers,
      writers,
      applyForWriter,
      freeUsers,
      proUsers,
      premiumUsers,
      totalPosts,
      publishedPosts,
      featuredPosts,
      postsPerMonthAgg,
      topicCountAgg,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: USER_STATUS.ACTIVE }),
      User.countDocuments({ status: USER_STATUS.INACTIVE }),
      User.countDocuments({ status: USER_STATUS.BLOCKED }),
      User.countDocuments({ role: ENUM_USER_ROLE.WRITER }),
      User.countDocuments({ isApplyForWriter: true, role: ENUM_USER_ROLE.USER }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.FREE, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PRO, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PREMIUM, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      Post.countDocuments({}),
      Post.countDocuments({ isPublished: true }),
      Post.countDocuments({ isFeaturedPost: true }),
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

    const postsPerMonth: Record<string, number> = {};
    for (const entry of postsPerMonthAgg) {
      postsPerMonth[entry._id] = entry.count;
    }

    const topicCount: Record<string, number> = {};
    for (const entry of topicCountAgg) {
      topicCount[entry._id] = entry.count;
    }

    return {
      role,
      users: { total: totalUsers, active: activeUsers, inactive: inactiveUsers, blocked: blockedUsers, writers, applyForWriter },
      subscriptionTypes: { free: freeUsers, pro: proUsers, premium: premiumUsers },
      posts: { total: totalPosts, published: publishedPosts, featured: featuredPosts, perMonth: postsPerMonth, topics: topicCount },
    };
  }

  // If standard user or writer, return personal/writer metrics
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Fetch their writer applications if any
  const latestApp = await WriterApplication.findOne({ user: user._id }).sort({ createdAt: -1 });
  let applicationStatus = "Not Applied";
  if (user.role === ENUM_USER_ROLE.WRITER || user.role === ENUM_USER_ROLE.ADMIN || user.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    applicationStatus = "Approved";
  } else if (latestApp) {
    applicationStatus = latestApp.status.charAt(0).toUpperCase() + latestApp.status.slice(1);
  }

  if (role === ENUM_USER_ROLE.WRITER) {
    const writerPosts = await Post.find({ author: user._id, isDeleted: false });
    const totalReaders = writerPosts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
    const totalPosts = writerPosts.length;

    // Monthly posts for this specific writer
    const postsPerMonthAgg = await Post.aggregate<{ _id: string; count: number }>([
      { $match: { author: user._id, isDeleted: false, publishedAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Topic counts for this specific writer
    const topicCountAgg = await Post.aggregate<{ _id: string; count: number }>([
      { $match: { author: user._id, isDeleted: false } },
      { $unwind: "$topic" },
      {
        $group: {
          _id: "$topic.title",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const postsPerMonth: Record<string, number> = {};
    for (const entry of postsPerMonthAgg) {
      postsPerMonth[entry._id] = entry.count;
    }

    const topicCount: Record<string, number> = {};
    for (const entry of topicCountAgg) {
      topicCount[entry._id] = entry.count;
    }

    return {
      role,
      writerStats: {
        totalReaders,
        totalPosts,
        subscriptionStatus: user.subscriptionType.toUpperCase(),
        applicationStatus,
        gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
      },
      posts: {
        perMonth: postsPerMonth,
        topics: topicCount,
      }
    };
  }

  // Else standard user
  return {
    role,
    userStats: {
      subscriptionStatus: user.subscriptionType.toUpperCase(),
      applicationStatus,
      gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
    }
  };
};

export const AnalysisService = {
  getDashboardAnalysis,
};
