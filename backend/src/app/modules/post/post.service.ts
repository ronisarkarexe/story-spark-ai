import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IPost, IPostPayload, IPostSearchFields } from "./post.interface";
import httpStatus from "http-status";
import { Post } from "./post.model";
import {
  IGenericResponse,
  IPaginationOptions,
} from "../../../interfaces/pagination";
import paginationHelper from "../../../utils/pagination_helper";
import { postSearchFields } from "./post.constant";
import { SortOrder } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";

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
    const res = await Post.create({
      ...payload,
      author: user._id,
      updatedBy: user._id,
    });
    if (res) {
      user.postsCount += 1;
      await user.save();
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
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: postSearchFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (trendingTopic) {
    andCondition.push({
      "topic.title": trendingTopic,
    });
  }

  if (genres && genres.length > 0) {
    andCondition.push({
      tag: { $in: genres },
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
    sortCondition[sortBy] = orderBy;
  }

  const result = await Post.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate("author", "name email createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
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
    const res = await Post.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("author", "name email createdAt")
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
      });
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
    const res = await Post.find({ isFeaturedPost: true })
      .sort({ createdAt: -1, updatedBy: -1 })
      .limit(2)
      .populate("author", "name email createdAt")
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
      });
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
    const res = await Post.findByIdAndUpdate(
      postId,
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
  const postById = await Post.findOne({ _id: id })
    .populate("author", "name email createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    });
  if (!postById) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }
  return postById;
};

 feat/ui-polish-accessibility
const getPostsByTag = async (
  tag: string,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IPost[]>> => {
  const { page, limit, skip, sortBy, orderBy } = paginationHelper(pagination);
  const whereCondition = { tag };

  const [result, total] = await Promise.all([
    Post.find(whereCondition)
      .sort({ [sortBy]: orderBy })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email createdAt"),
    Post.countDocuments(whereCondition),
  ]);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

/** Public counts for landing pages and marketing widgets */
const getPlatformStats = async () => {
  const [totalPosts, publishedPosts, totalUsers, totalWriters] =
    await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ isPublished: true }),
      User.countDocuments(),
      User.countDocuments({ role: ENUM_USER_ROLE.WRITER }),
    ]);

  return {
    totalPosts,
    publishedPosts,
    totalUsers,
    totalWriters,
    updatedAt: new Date().toISOString(),
  };

const getPostsByTag = async (tag: string) => {
  const result = await Post.find({ tag })
    .limit(2)
    .populate("author", "name email createdAt")
    .populate({
      path: "reactions",
      populate: { path: "userId", select: "email" },
    });
  return result;
 main
};

export const PostService = {
  createPost,
  getPosts,
  getLatestPosts,
  getFeaturedPosts,
  doFeaturedPosts,
  getSinglePost,
  getPostsByTag,
  getPlatformStats,
};
