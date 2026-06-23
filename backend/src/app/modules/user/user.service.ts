import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { Post } from "../post/post.model";
import httpStatus from "http-status";
import { Comment } from "../comment/comment.model";
import { Reaction } from "../reaction/reaction.model";
import { Bookmark } from "../bookmark/bookmark.model";
import { Notification } from "../notification/notification.model";
import { StoryVersion } from "../story_version/story_version.model";
import { Report } from "../report/report.model";

const allowedSocialFields = ["facebook", "twitter", "linkedin", "instagram", "github", "discord"] as const;

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({}).select("-password");
  return result;
};

const getUser = async (payload: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: payload })
    .select("-password")
    .populate("followers", "name profile")
    .populate("following", "name profile");
  return result;
};

const updateUser = async (token: ITokenPayload, payload: Partial<IUser>) => {
  const updateData: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    const trimmedName = payload.name.trim();
    if (!trimmedName) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Full Name cannot be empty!");
    }
    updateData.name = trimmedName;
  }

  if (payload.profile) {
    if (typeof payload.profile.avatar === "string") {
      updateData["profile.avatar"] = payload.profile.avatar;
    }

    if (typeof payload.profile.bio === "string") {
      updateData["profile.bio"] = payload.profile.bio;
    }

    if (payload.profile.social) {
      for (const field of allowedSocialFields) {
        const value = payload.profile.social[field];
        if (typeof value === "string") {
          updateData[`profile.social.${field}`] = value;
        }
      }
    }
  }

  // ─── ADDED: PARSE WRITING GOALS PAYLOADS FOR INJECTION ───
  if (payload.writingGoals) {
    if (typeof payload.writingGoals.dailyWordCount === "number") {
      updateData["writingGoals.dailyWordCount"] = payload.writingGoals.dailyWordCount;
    }
    if (typeof payload.writingGoals.weeklyWordCount === "number") {
      updateData["writingGoals.weeklyWordCount"] = payload.writingGoals.weeklyWordCount;
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No valid user fields provided!");
  }

  const result = await User.findOneAndUpdate(
    { email: token.email },
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return result;
};

const deleteUser = async (id: string): Promise<void> => {
  const userExists = await User.exists({ _id: id });

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const userPosts = await Post.find({ author: id }).select("_id").lean();
  const postIds = userPosts.map((p) => p._id);

  await StoryVersion.deleteMany({ storyId: { $in: postIds } });
  await Reaction.deleteMany({ postId: { $in: postIds } });
  await Comment.deleteMany({ postId: { $in: postIds } });
  await Bookmark.deleteMany({ storyId: { $in: postIds } });

  await Bookmark.deleteMany({ userId: id });
  await Reaction.deleteMany({ userId: id });
  await Comment.deleteMany({ userId: id });
  await Report.deleteMany({ reportedBy: id });
  await Notification.deleteMany({ userId: id });
  await Post.deleteMany({ author: id });

  // ─── FIX: REMOVE DANGLING REFERENCES ───
  await User.updateMany({ followers: id }, { $pull: { followers: id } });
  await User.updateMany({ following: id }, { $pull: { following: id } });

  const result = await User.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
};

const applyForWriter = async (token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (user.isApplyForWriter) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You have already applied for writer!");
  }
  const result = await User.findOneAndUpdate(
    { email: email },
    { isApplyForWriter: true },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const approveWriterApplication = async (email: string) => {
  try {
    const isExistUser = await User.findOne({ email: email });
    if (!isExistUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }
    if (isExistUser.role === ENUM_USER_ROLE.WRITER) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is already a writer!");
    }
    const result = await User.findOneAndUpdate(
      { email: email },
      { role: ENUM_USER_ROLE.WRITER },
      {
        new: true,
        runValidators: true,
      }
    );
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "An unknown error occurred");
    }
  }
};

const getAllWriterApplicationUsers = async (): Promise<IUser[]> => {
  const result = await User.find({ isApplyForWriter: true });
  return result;
};

const getProfileInfo = async (token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({ email: email })
    .populate("followers", "name profile")
    .populate("following", "name profile");
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // postsCount is kept in sync via event-driven increments in createPost and
  // decrements in deletePost. We do NOT repair it here to keep this GET
  // endpoint side-effect-free and idempotent (fixes write-on-read anti-pattern).
  return user;
};

const toggleFollow = async (token: ITokenPayload, authorId: string) => {
  const currentUser = await User.findOne({ email: token.email });
  if (!currentUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const author = await User.findById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Author not found!");
  }

  const isFollowing = currentUser.following.includes(author._id);

  if (isFollowing) {
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: author._id },
    });
    await User.findByIdAndUpdate(author._id, {
      $pull: { followers: currentUser._id },
    });
    return { isFollowing: false };
  } else {
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: author._id },
    });
    await User.findByIdAndUpdate(author._id, {
      $addToSet: { followers: currentUser._id },
    });
    return { isFollowing: true };
  }
};

const getFollowStatus = async (token: ITokenPayload, authorId: string) => {
  const currentUser = await User.findOne({ email: token.email });
  if (!currentUser) {
    return { isFollowing: false };
  }
  const isFollowing = currentUser.following.some(
    (id) => id.toString() === authorId
  );
  return { isFollowing };
};

export const UserService = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfileInfo,
  applyForWriter,
  approveWriterApplication,
  getAllWriterApplicationUsers,
  toggleFollow,
  getFollowStatus,
};
