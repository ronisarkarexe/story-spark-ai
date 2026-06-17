import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IPost, IPostPayload, IPostSearchFields } from "./post.interface";
import httpStatus from "http-status";
import { Post } from "./post.model";
import { Bookmark } from "../bookmark/bookmark.model";
import { StoryVersionService } from "../story_version/story_version.service";
import {
  IGenericResponse,
  IPaginationOptions,
} from "../../../interfaces/pagination";
import paginationHelper from "../../../utils/pagination_helper";
import { postSearchFields } from "./post.constant";
import { SortOrder, Types } from "mongoose";
import { GamificationService } from "../gamification/gamification.service";
import { escapeRegex } from "../../../utils/regex.util";
const MAX_SEARCH_TERM_LENGTH = 100;

interface ICursorPayload {
  value: string;
  id: string;
}

const encodeCursor = (item: IPost, sortBy: string) => {
  const rawValue = item[sortBy as keyof IPost];
  const value = rawValue instanceof Date ? rawValue.toISOString() : String(rawValue ?? "");
  return Buffer.from(JSON.stringify({ value, id: item._id?.toString() })).toString("base64");
};

const decodeCursor = (cursor?: string): ICursorPayload | null => {
  if (!cursor) {
    return null;
  }

  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (!parsed?.id || parsed.value === undefined) {
      return null;
    }
    return parsed as ICursorPayload;
  } catch {
    return null;
  }
};

const getCursorCondition = (
  sortBy: string,
  orderBy: SortOrder,
  cursor?: string,
) => {
  const parsed = decodeCursor(cursor);
  if (!parsed) {
    return null;
  }

  const { value: rawValue, id } = parsed;
  let value: string | number | Date = rawValue;

  if (sortBy === "createdAt" || sortBy === "publishedAt") {
    value = new Date(rawValue);
  } else if (
    ["likesCount", "commentsCount", "viewsCount", "bookmarksCount"].includes(
      sortBy,
    )
  ) {
    value = Number(rawValue);
  }

  const compareOperator = orderBy === "asc" ? "$gt" : "$lt";
  const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

  return {
    $or: [
      {
        [sortBy]: {
          [compareOperator]: value,
        },
      },
      {
        [sortBy]: value,
        _id: {
          [compareOperator]: objectId,
        },
      },
    ],
  };
};

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
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $inc: { postsCount: 1 } },
        { new: true }
      );
      GamificationService.addXp(String(user._id), 50, "CREATED_POST").catch(console.error);
      if (updatedUser && updatedUser.postsCount === 1) {
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
  const { page, limit, cursor, sortBy, orderBy } = paginationHelper(
    pagination,
  );
  const { searchTerm, trendingTopic, sortFilter, genres, ...filterData } =
    filters;
  const andCondition: Record<string, unknown>[] = [
    { isDeleted: { $ne: true } },
    { isPublished: true },
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
          $regex: new RegExp(`^${escapeRegex(genre)}$`, "i"),
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

  const countCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortFilter === "mostPopular") {
    sortCondition.likesCount = -1;
  }

  if (sortBy && orderBy) {
    sortCondition[sortBy] = orderBy === "asc" ? 1 : -1;
  }
  sortCondition._id = orderBy === "asc" ? 1 : -1;

  const cursorCondition = getCursorCondition(sortBy, orderBy, cursor);
  if (cursorCondition) {
    andCondition.push(cursorCondition);
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Post.find(whereCondition)
    .sort(sortCondition)
    .limit(limit)
    .populate("author", "name email createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    })
    .populate("bookmarks", "email");
  const total = await Post.countDocuments(countCondition);
  const nextCursor = result.length === limit ? encodeCursor(result[result.length - 1], sortBy) : undefined;

  return {
    meta: {
      page,
      limit,
      total,
      nextCursor,
      hasMore: Boolean(nextCursor),
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
    const safeSearchTerm = escapeRegex(
      filters.searchTerm.trim().slice(0, MAX_SEARCH_TERM_LENGTH)
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
    .populate("author", "name createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "_id" },
    });
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
    const res = await Post.find({ isDeleted: { $ne: true }, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "name email createdAt")
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
      isPublished: true,
    })
      .sort({ createdAt: -1, updatedBy: -1 })
      .limit(10)
      .populate("author", "name email createdAt")
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

const getSinglePost = async (id: string, token?: ITokenPayload | null) => {
  const postById = await Post.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("author", "name email createdAt")
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

const getPostsByTag = async (tag: string, excludeId?: string, limit: number = 2) => {
  if (!tag) {
    return [];
  }

  const query: any = { tag, isDeleted: { $ne: true } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const result = await Post.find(query)
    .limit(limit)
    .populate("author", "name email createdAt")
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

  const postExists = await Post.exists({ _id: postId, isDeleted: { $ne: true } });
  if (!postExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  const isBookmarked = await Post.exists({
    _id: postId,
    bookmarks: user._id,
  });

  if (isBookmarked) {
    await Post.updateOne(
      { _id: postId },
      { $pull: { bookmarks: user._id } }
    );

    return {
      message: "Bookmark removed",
      bookmarked: false,
    };
  }

  await Post.updateOne(
    { _id: postId },
    { $addToSet: { bookmarks: user._id } }
  );

  return {
    message: "Bookmark added",
    bookmarked: true,
  };
};

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

  if (
    post.author.toString() !== user._id.toString() &&
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to edit this story!");
  }

  await StoryVersionService.createVersionSnapshot(
    postId,
    user._id.toString(),
    payload.prompt || "",
    payload.generationType || "edited"
  );

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

  if (
    post.author.toString() !== user._id.toString() &&
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own story!"
    );
  }

  post.isDeleted = true;
  post.deletedAt = new Date();
  post.deletedBy = user._id;
  await post.save();

  if (post.isPublished) {
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { postsCount: -1 } }
    );
  }

  await Bookmark.deleteMany({ storyId: postId });
  // Delete all comments associated with the post to prevent orphaned
  // comment documents accumulating in the database after post deletion.
  await Comment.deleteMany({ postId });

  return post;
};

const remixStory = async (postId: string, prompt: string, token: ITokenPayload) => {
  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Prompt is required and must be a string");
  }
  const safePrompt = prompt.slice(0, 500).replace(/[\n\r\t"]/g, " ").trim();
  if (!safePrompt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Prompt cannot be empty or whitespace");
  }
  const user = await User.findOne({ email: token.email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const originalPost = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!originalPost) {
    throw new ApiError(httpStatus.NOT_FOUND, "Original story post not found!");
  }

  const remixedContent = `[AI Remixed Version based on prompt: "${safePrompt}"]\n\n${originalPost.content}`;

  const res = await Post.create({
    title: `Remix of ${originalPost.title}`,
    content: remixedContent,
    author: user._id,
    updatedBy: user._id,
    tag: originalPost.tag,
  });

  if (res) {
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { postsCount: 1 } }
    );
  }

  return res;
};

const translateStory = async (postId: string, language: string, token: ITokenPayload) => {
  if (!language || typeof language !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Language is required and must be a string");
  }
  const safeLanguage = language.slice(0, 50).replace(/[\n\r\t"]/g, " ").trim();
  if (!safeLanguage) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Language cannot be empty or whitespace");
  }
  const user = await User.findOne({ email: token.email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const originalPost = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!originalPost) {
    throw new ApiError(httpStatus.NOT_FOUND, "Original story post not found!");
  }

  const translatedContent = `[Translated to ${safeLanguage}]\n\n${originalPost.content}`;

  const res = await Post.create({
    title: `${originalPost.title} (${language})`,
    content: translatedContent,
    author: user._id,
    updatedBy: user._id,
    tag: originalPost.tag,
  });

  if (res) {
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { postsCount: 1 } }
    );
  }

  return res;
};

const getGenres = async (): Promise<string[]> => {
  const genres = await Post.distinct("tag", { isDeleted: { $ne: true }, tag: { $nin: [null, ""] } });
  return genres.sort();
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
  remixStory,
  translateStory,
  getGenres,
};

