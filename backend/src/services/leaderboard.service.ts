import {
  LeaderboardUser,
  WeeklyLeaderboard,
} from "../models/leaderboard.model";
import { Post } from "../app/modules/post/post.model";
import { User } from "../app/modules/user/user.model";

export const getWeeklyLeaderboard =
  async (): Promise<WeeklyLeaderboard> => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const results = await Post.aggregate([
      {
        $match: {
          isDeleted: { $ne: true },
          publishedAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: "$author",
          score: { $sum: 1 },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          username: { $ifNull: ["$user.name", "deleted"] },
          avatar: { $ifNull: ["$user.profile.avatar", ""] },
          score: 1,
        },
      },
    ]);

    const leaderboard: LeaderboardUser[] = results;

    const totalStories = await Post.countDocuments({
      isDeleted: { $ne: true },
      publishedAt: { $gte: oneWeekAgo },
    });

    return {
      totalStories,
      leaderboard,
    };
  };