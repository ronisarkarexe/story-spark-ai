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

  // Bookmark collection is the single source of truth; bookmarksCount mirrors it.
  const deletedBookmark = await Bookmark.findOneAndDelete({
    userId: user._id,
    storyId: post._id,
  });

  if (deletedBookmark) {
    await Post.updateOne(
      { _id: post._id, bookmarksCount: { $gt: 0 } },
      { $inc: { bookmarksCount: -1 } }
    );
    return { message: "Bookmark removed", isBookmarked: false };
  }

  try {
    await Bookmark.create({ userId: user._id, storyId: post._id });
    await Post.updateOne({ _id: post._id }, { $inc: { bookmarksCount: 1 } });
    return { message: "Story bookmarked!", isBookmarked: true };
  } catch (error: any) {
    // Duplicate means it was already bookmarked; treat as a no-op success.
    if (error.code === 11000) {
      return { message: "Story bookmarked!", isBookmarked: true };
    }
    throw error;
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

  // Find user's bookmarks
  const bookmarks = await Bookmark.find({ userId: user._id })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "storyId",
      match: { isDeleted: { $ne: true } },
      populate: [
        { path: "author", select: "name createdAt profile.bio" },
        {
          path: "reactions",
          populate: { path: "userId", select: "_id" },
        },
      ],
    });

  const total = await Bookmark.countDocuments({ userId: user._id });

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
    await Post.updateOne(
      { _id: storyId, bookmarksCount: { $gt: 0 } },
      { $inc: { bookmarksCount: -1 } }
    );
  }

  return { message: "Bookmark removed" };
};

export const BookmarkService = {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
  deleteBookmark,
};
