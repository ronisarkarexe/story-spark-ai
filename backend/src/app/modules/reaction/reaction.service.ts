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

const newReaction = await Reaction.create({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type: type,
  });
  // Check if reaction already exists
  const existingReaction = await Reaction.findOne({
    postId: postId,
    userId: user._id,
    type: type,
  });

  if (existingReaction) {
    // Remove reaction
    await Reaction.findByIdAndDelete(existingReaction._id);
    post.likesCount = Math.max(0, post.likesCount - 1);
    post.reactions = post.reactions || [];
    post.reactions = post.reactions.filter(
      (rId) => rId.toString() !== existingReaction._id.toString()
    );
    await post.save();
    return { message: "Reaction removed", likesCount: post.likesCount };
  } else {
    // Add reaction
 main
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type: type,
    });
 main
    };
  }
};

export const ReactionService = {
  toggleReaction,
};
