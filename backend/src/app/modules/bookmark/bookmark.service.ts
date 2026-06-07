import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Bookmark } from "./bookmark.model";
import { Post } from "../post/post.model";
import { Types } from "mongoose";

const toggleBookmark = async (storyId: string, token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const post = await Post.findOne({
    _id: storyId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Story not found!");
  }

  const existingBookmark = await Bookmark.findOne({
    userId: user._id,
    storyId: post._id,
  });

  if (existingBookmark) {
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    await Post.findByIdAndUpdate(post._id, { $inc: { bookmarksCount: -1 } });
    return { message: "Bookmark removed", isBookmarked: false };
  } else {
    await Bookmark.create({ userId: user._id, storyId: post._id });
    await Post.findByIdAndUpdate(post._id, { $inc: { bookmarksCount: 1 } });
    return { message: "Story bookmarked!", isBookmarked: true };
  }
};

const getBookmarks = async (
  token: ITokenPayload,
  page: number = 1,
  limit: number = 10
) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const skip = (page - 1) * limit;

  // Count total bookmarks pointing to non-deleted stories
  const totalAgg = await Bookmark.aggregate([
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
    { $count: "count" }
  ]);
  const total = totalAgg[0]?.count || 0;

  // Retrieve paginated active bookmark IDs
  const activeBookmarkDocs = await Bookmark.aggregate([
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
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    { $project: { _id: 1 } },
  ]);

  const activeBookmarkIds = activeBookmarkDocs.map((doc) => doc._id);

  // Fetch full details and populate nested paths
  const bookmarks = await Bookmark.find({ _id: { $in: activeBookmarkIds } })
    .populate({
      path: "storyId",
      populate: [
        { path: "author", select: "name email createdAt" },
        {
          path: "reactions",
          populate: { path: "userId", select: "email" },
        },
      ],
    });

  // Maintain the sorted order from aggregation
  const activeBookmarkIdStrings = activeBookmarkIds.map((id) => id.toString());
  bookmarks.sort(
    (a, b) =>
      activeBookmarkIdStrings.indexOf(a._id.toString()) -
      activeBookmarkIdStrings.indexOf(b._id.toString())
  );

  // Map to extract only the fully populated story objects, filtering out any orphaned references
  const bookmarkedStories = bookmarks
    .map((b) => b.storyId)
    .filter((story) => story !== null);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: bookmarkedStories,
  };
};

const checkBookmarkStatus = async (storyId: string, token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const bookmark = await Bookmark.findOne({
    userId: user._id,
    storyId: new Types.ObjectId(storyId),
  });

  return { isBookmarked: !!bookmark };
};

const deleteBookmark = async (storyId: string, token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const deletedBookmark = await Bookmark.findOneAndDelete({
    userId: user._id,
    storyId: new Types.ObjectId(storyId),
  });

  if (deletedBookmark) {
    await Post.findByIdAndUpdate(storyId, { $inc: { bookmarksCount: -1 } });
  }

  return { message: "Bookmark removed" };
};

export const BookmarkService = {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
  deleteBookmark,
};
