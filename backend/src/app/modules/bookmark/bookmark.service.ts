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

  // Check if bookmark already exists
  const existingBookmark = await Bookmark.findOne({
    userId: user._id,
    storyId: post._id,
  });

  if (existingBookmark) {
    // Remove bookmark
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    
    // Synchronize with Post.bookmarks array
    post.bookmarks = post.bookmarks || [];
    post.bookmarks = post.bookmarks.filter(
      (uId) => uId && uId.toString() !== user._id.toString()
    );
    await post.save();

    return { message: "Bookmark removed", isBookmarked: false };
  } else {
    // Add bookmark
    await Bookmark.create({
      userId: user._id,
      storyId: post._id,
    });

    // Synchronize with Post.bookmarks array
    post.bookmarks = post.bookmarks || [];
    if (!post.bookmarks.some((uId) => uId && uId.toString() === user._id.toString())) {
      post.bookmarks.push(user._id);
    }
    await post.save();

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

  // Find user's bookmarks
  const bookmarks = await Bookmark.find({ userId: user._id })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "storyId",
      match: { isDeleted: { $ne: true } },
      populate: [
        { path: "author", select: "name email createdAt" },
        {
          path: "reactions",
          populate: { path: "userId", select: "email" },
        },
        { path: "bookmarks", select: "email" },
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
  const post = await Post.findById(storyId);

  const deletedBookmark = await Bookmark.findOneAndDelete({
    userId: user._id,
    storyId: new Types.ObjectId(storyId),
  });

  if (deletedBookmark && post) {
    post.bookmarks = post.bookmarks || [];
    post.bookmarks = post.bookmarks.filter(
      (uId) => uId && uId.toString() !== user._id.toString()
    );
    await post.save();
  }

  return { message: "Bookmark removed" };
};

export const BookmarkService = {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
  deleteBookmark,
};
