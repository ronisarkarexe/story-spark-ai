import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IPost, IPostPayload, IPostSearchFields } from "./post.interface";
import httpStatus from "http-status";
import { Post } from "./post.model";
import { StoryVersionService } from "../story_version/story_version.service";
import {
  IGenericResponse,
  IPaginationOptions,
} from "../../../interfaces/pagination";
import paginationHelper from "../../../utils/pagination_helper";
import { postSearchFields } from "./post.constant";
import { SortOrder } from "mongoose";
import { GamificationService } from "../gamification/gamification.service";


const MAX_SEARCH_TERM_LENGTH = 100;

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createPost = async (payload: IPostPayload, token: ITokenPayload) => {
  const { email, role } = token;
  const user = await User.findOne({
    email: email,
    role: role,
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  try {
    const isPublished = payload.isPublished ?? true;
    const res = await Post.create({
      ...payload,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      author: user._id,
      updatedBy: user._id,
    });
    if (res && res.isPublished) {
      user.postsCount += 1;
      await user.save();
      GamificationService.addXp(String(user._id), 50, "CREATED_POST").catch(console.error);
      if (user.postsCount === 1) {
        GamificationService.awardBadge(String(user._id), "First Story").catch(console.error);
      }
    }
    return res;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create post"
    );
  }
};

const getPosts = async (
  filters: IPostSearchFields,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IPost[]>> => {
  const { page, limit, skip, sortBy, orderBy } = paginationHelper(pagination);
  const { searchTerm, trendingTopic, sortFilter, genres, ...filterData } =
    filters;
  const andCondition: Record<string, unknown>[] = [
    { isDeleted: { $ne: true } },
  ];

 if (searchTerm) {
  const safeSearchTerm = escapeRegex(
    searchTerm.trim().slice(0, MAX_SEARCH_TERM_LENGTH)
  );

  if (safeSearchTerm) {
    andCondition.push({
      $or: postSearchFields.map((field) => ({
        [field]: {
          $regex: safeSearchTerm,
          $options: "i",
        },
      })),
    });
  }
}

  if (trendingTopic) {
    andCondition.push({
      "topic.title": trendingTopic,
    });
  }

  const genreList = Array.isArray(genres)
    ? genres
    : typeof genres === "string"
      ? genres.split(",").map((g) => g.trim()).filter(Boolean)
      : [];

  if (genreList.length > 0) {
    andCondition.push({
      $or: genreList.map((genre) => ({
        tag: {
          $regex: new RegExp(
            `^${genre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  // sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortFilter === "mostPopular") {
    sortCondition.likesCount = -1;
  }

  if (sortBy && orderBy) {
    sortCondition[sortBy] = orderBy === "asc" ? 1 : -1;
  }

  const result = await Post.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate("author", "name email createdAt profile.bio")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    })
    .populate("bookmarks", "email");
  const total = await Post.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPublishedPostsByAuthor = async (
  token: ITokenPayload,
  filters: Pick<IPostSearchFields, "searchTerm">,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IPost[]>> => {
  const { page, limit, skip, sortBy, orderBy } = paginationHelper(pagination);
  const user = await User.findOne({ email: token.email, role: token.role });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const andCondition: Record<string, unknown>[] = [
    { author: user._id },
    { isPublished: true },
    { isDeleted: { $ne: true } },
  ];

  if (filters.searchTerm) {
    andCondition.push({
      $or: postSearchFields.map((field) => ({
        [field]: {
          $regex: filters.searchTerm,
          $options: "i",
        },
      })),
    });
  }

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && orderBy) {
    sortCondition[sortBy] = orderBy === "asc" ? 1 : -1;
  } else {
    sortCondition.publishedAt = -1;
    sortCondition.createdAt = -1;
  }

  const whereCondition = { $and: andCondition };
  const result = await Post.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate("author", "name email createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    })
    .populate("bookmarks", "email");
  const total = await Post.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getLatestPosts = async () => {
  try {
    const res = await Post.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "name email createdAt profile.bio")
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
      })
      .populate("bookmarks", "email");
    return res;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get latest posts"
    );
  }
};

const getFeaturedPosts = async () => {
  try {
    const res = await Post.find({
      isFeaturedPost: true,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1, updatedBy: -1 })
      .limit(10)
      .populate("author", "name email createdAt profile.bio")
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
      })
      .populate("bookmarks", "email");
    return res;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get featured posts"
    );
  }
};

const doFeaturedPosts = async (postId: string) => {
  try {
    const res = await Post.findOneAndUpdate(
      { _id: postId, isDeleted: { $ne: true } },
      { isFeaturedPost: true },
      { new: true }
    );
    return res;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to approve featured posts"
    );
  }
};

const getSinglePost = async (id: string) => {
  const postById = await Post.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("author", "name email createdAt profile.bio")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    })
    .populate("bookmarks", "email");
  if (!postById) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }
  return postById;
};

const getPostsByTag = async (tag: string, excludeId?: string) => {
  const query: any = { tag, isDeleted: { $ne: true } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const result = await Post.find(query)
    .limit(2)
    .populate("author", "name email createdAt profile.bio")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    })
    .populate("bookmarks", "email");
  return result;
};

const toggleBookmark = async (postId: string, token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const post = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }
  // Check bookmark status atomically via a DB query instead of loading the full document
  const isBookmarked = await Post.exists({ _id: postId, bookmarks: user._id });

  if (isBookmarked) {
    // Remove bookmark atomically
    await Post.updateOne(
      { _id: postId },
      { $pull: { bookmarks: user._id } }
    );
    return { message: "Bookmark removed", bookmarked: false };
  } else {
    // Add bookmark atomically — $addToSet prevents duplicates
    await Post.updateOne(
      { _id: postId },
      { $addToSet: { bookmarks: user._id } }
    );
    return { message: "Bookmark added", bookmarked: true };
  }
}

const updatePost = async (
  postId: string,
  payload: Partial<IPostPayload> & { prompt?: string; generationType?: string },
  token: ITokenPayload
) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }

  // Enforce ownership
  if (
    post.author.toString() !== user._id.toString() &&
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to edit this story!");
  }

  // Automatically create version snapshot of the current state BEFORE overwriting
  await StoryVersionService.createVersionSnapshot(
    postId,
    user._id.toString(),
    payload.prompt || "",
    payload.generationType || "edited"
  );

  // Overwrite post content
  if (payload.title !== undefined) post.title = payload.title;
  if (payload.content !== undefined) post.content = payload.content;
  if (payload.tag !== undefined) post.tag = payload.tag;
  if (payload.topic !== undefined) post.topic = payload.topic;

  post.updatedBy = user._id;
  await post.save();

  return post;
};

const deletePost = async (postId: string, token: ITokenPayload) => {
  const user = await User.findOne({ email: token.email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const post = await Post.findOne({
    _id: postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }

  if (!post.author || post.author.toString() !== user._id.toString()) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own story!"
    );
  }

  post.isDeleted = true;
  post.deletedAt = new Date();
  post.deletedBy = user._id;
  await post.save();

  if (post.isPublished && user.postsCount > 0) {
    user.postsCount -= 1;
    await user.save();
  }

  return post;
};

export const PostService = {
  createPost,
  getPosts,
  getPublishedPostsByAuthor,
  getLatestPosts,
  getFeaturedPosts,
  doFeaturedPosts,
  getSinglePost,
  getPostsByTag,
  toggleBookmark,
  updatePost,
  deletePost,
};
