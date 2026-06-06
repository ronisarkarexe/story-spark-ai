import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Reaction } from "./reaction.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";

type ReactionType = "like" | "love" | "laugh" | "angry" | "sad";

const toggleReaction = async (
  postId: string,
  type: ReactionType = "like",
  token: ITokenPayload
) => {
  const { email } = token;
  const user = await User.findOne({ email }).select("_id").lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const post = await Post.findOne({
    _id: postId,
    isDeleted: { $ne: true },
  });

  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  // Check existing reaction
  const existingReaction = await Reaction.findOne({
    postId,
    userId: user._id,
  });

  // Remove reaction if same type clicked again
  if (existingReaction && existingReaction.type === type) {
    await Reaction.findByIdAndDelete(existingReaction._id);

    const likesCount = await Reaction.countDocuments({ postId });

    return {
      message: "Reaction removed successfully",
      likesCount,
    };
  }

  // Update existing reaction
  if (existingReaction) {
    existingReaction.type = type;
    await existingReaction.save();
  } else {
    // Create new reaction
    await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type,
    });
  }

  const likesCount = await Reaction.countDocuments({ postId });

  return {
    message: "Reaction updated successfully",
    likesCount,
  };
};

export const ReactionService = {
  toggleReaction,
};