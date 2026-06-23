import { ReadingProgress } from "./reading_progress.model";
import { User } from "../user/user.model";
import { Post } from "../post/post.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { ITokenPayload } from "../../../interfaces/token";

const saveReadingProgress = async (
  token: ITokenPayload,
  storyId: string,
  progress: number,
  lastScrollPosition?: number
) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const post = await Post.findOne({ _id: storyId, isDeleted: { $ne: true } });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Story not found!");
  }

  const progressRecord = await ReadingProgress.findOneAndUpdate(
    { userId: user._id, storyId: post._id },
    {
      progress,
      lastScrollPosition,
    },
    { upsert: true, new: true }
  );

  return progressRecord;
};

const getReadingProgress = async (token: ITokenPayload, storyId: string) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const record = await ReadingProgress.findOne({
    userId: user._id,
    storyId,
  });

  return record;
};

const getRecentProgressList = async (token: ITokenPayload, limit: number = 10) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Get recent records with active stories
  const recentRecords = await ReadingProgress.aggregate([
    { $match: { userId: user._id } },
    {
      $lookup: {
        from: "posts",
        localField: "storyId",
        foreignField: "_id",
        as: "story",
      },
    },
    { $unwind: "$story" },
    { $match: { "story.isDeleted": { $ne: true } } },
    { $sort: { updatedAt: -1 } },
    { $limit: limit },
  ]);

  const recordIds = recentRecords.map((rec) => rec._id);
  const populatedRecords = await ReadingProgress.find({ _id: { $in: recordIds } })
    .populate({
      path: "storyId",
      populate: [
        { path: "author", select: "name email createdAt" }
      ]
    });

  // Sort back to match recentRecords order (which is sorted by updatedAt desc)
  const idOrder = recordIds.map((id) => id.toString());
  populatedRecords.sort(
    (a, b) => idOrder.indexOf(a._id.toString()) - idOrder.indexOf(b._id.toString())
  );

  return populatedRecords;
};

const deleteReadingProgress = async (token: ITokenPayload, storyId: string) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  await ReadingProgress.findOneAndDelete({
    userId: user._id,
    storyId,
  });

  return { message: "Reading progress deleted" };
};

export const ReadingProgressService = {
  saveReadingProgress,
  getReadingProgress,
  getRecentProgressList,
  deleteReadingProgress,
};
