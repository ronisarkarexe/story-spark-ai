import { Request, Response } from "express";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import httpStatus from "http-status";

export const getWeeklyLeaderboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const weeklyStats = await Post.aggregate([
      {
        $match: {
          isPublished: true,
          isDeleted: false,
          publishedAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: "$author",
          storiesCount: { $sum: 1 },
          totalViews: { $sum: "$viewsCount" },
          totalLikes: { $sum: "$likesCount" },
          totalComments: { $sum: "$commentsCount" },
        },
      },
      {
        $addFields: {
          creativeScore: {
            $add: [
              "$totalViews",
              { $multiply: ["$totalLikes", 3] },
              { $multiply: ["$totalComments", 2] },
            ],
          },
        },
      },
      {
        $sort: { creativeScore: -1 },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          name: { $ifNull: ["$userInfo.name", "Anonymous"] },
          avatar: { $ifNull: ["$userInfo.profile.avatar", ""] },
          storiesCount: 1,
          creativeScore: 1,
          totalViews: 1,
          totalLikes: 1,
          totalComments: 1,
        },
      },
    ]);

    const leaderboardData = weeklyStats.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      avatar: entry.avatar,
      storiesCount: entry.storiesCount,
      creativeScore: Math.round(entry.creativeScore),
      totalViews: entry.totalViews,
      totalLikes: entry.totalLikes,
      totalComments: entry.totalComments,
    }));

    res.status(200).json({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: leaderboardData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to compile leaderboard metrics",
    });
  }
};
