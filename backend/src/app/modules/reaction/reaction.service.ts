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
    _id: postId,
    isDeleted: { $ne: true },
  }).select("likesCount reactions");

  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

//  main
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
  const existingReaction = await Reaction.findOne({
    postId: post._id,
    userId: user._id,
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      // Remove reaction if the same type is toggled
      await Reaction.findByIdAndDelete(existingReaction._id);
      post.reactions = (post.reactions || []).filter(
        (id) => id && id.toString() !== existingReaction._id.toString()
      );
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      await post.save();

      return {
        message: "Reaction removed successfully",
        likesCount: post.likesCount,
      };
    } else {
      // Update reaction to new type
      existingReaction.type = type;
      await existingReaction.save();

      return {
        message: "Reaction updated successfully",
        likesCount: post.likesCount,
      };
    }
  } else {
    // Create new reaction
    const newReaction = await Reaction.create({
      postId: post._id,
      userId: user._id,
      type: type,
    });
    post.reactions = post.reactions || [];
    post.reactions.push(newReaction._id);
    post.likesCount = (post.likesCount || 0) + 1;
    await post.save();

    return {
      message: "Reaction added successfully",
      likesCount: post.likesCount,
    };
  }
};

export const ReactionService = {
  toggleReaction,
};