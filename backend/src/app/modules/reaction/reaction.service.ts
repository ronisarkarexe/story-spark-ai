import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Reaction } from "./reaction.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";
import { verifyPostAccess } from "../post/post.utils";

type ReactionType = "like" | "love" | "laugh" | "angry" | "sad";

const toggleReaction = async (
  postId: string,
  type: ReactionType = "like",
  token: ITokenPayload
) => {
  const { email } = token;

  if (!Types.ObjectId.isValid(postId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid post ID!");
  }

  const user = await User.findOne({ email }).select("_id").lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }
  
  verifyPostAccess(post, user);

  // Check if reaction already exists
  const existingReaction = await Reaction.findOne({
    postId: postId,
    userId: user._id,
    type: type,
  });

  if (existingReaction) {
    // Remove reaction atomically
    await Reaction.findByIdAndDelete(existingReaction._id);
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { reactions: existingReaction._id },
        $inc: { likesCount: -1 },
      },
      { new: true }
    );
    // Ensure likesCount never goes below 0
    if (updatedPost && updatedPost.likesCount < 0) {
      await Post.updateOne({ _id: postId }, { $set: { likesCount: 0 } });
    }
    return {
      message: "Reaction removed",
      likesCount: Math.max(0, updatedPost?.likesCount ?? 0),
    };
  } else {
    // Add reaction atomically
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: { reactions: newReaction._id },
        $inc: { likesCount: 1 },
      },
      { new: true }
    );
    return {
      message: "Reaction added",
      likesCount: updatedPost?.likesCount ?? 0,
    };
  }
};

export const ReactionService = {
  toggleReaction,
};
