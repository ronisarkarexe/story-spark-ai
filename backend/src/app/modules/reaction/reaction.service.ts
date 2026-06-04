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
  }).select("likesCount reactions");
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
    await Reaction.deleteOne({ _id: existingReaction._id });
    await Post.updateOne(
      { _id: postId },
      {
        $pull: { reactions: existingReaction._id },
        $inc: { likesCount: -1 },
      }
    );
    const likesCount = await Reaction.countDocuments({ postId });
    return {
      message: "Reaction removed",
      reaction: null,
      likesCount,
    };
  }

  // Update existing reaction
  if (existingReaction) {
    existingReaction.type = type;
    await existingReaction.save();
    const likesCount = await Reaction.countDocuments({ postId });
    return {
      message: "Reaction updated",
      reaction: existingReaction,
      likesCount,
    };
  }

  // Create new reaction
  const newReaction = await Reaction.create({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type,
  });
  await Post.updateOne(
    { _id: postId },
    {
      $addToSet: { reactions: newReaction._id },
      $inc: { likesCount: 1 },
    }
  );
  const likesCount = await Reaction.countDocuments({ postId });
  return {
    message: "Reaction added",
    reaction: newReaction,
    likesCount,
  };
};

export const ReactionService = {
  toggleReaction,
};