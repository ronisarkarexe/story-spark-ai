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

  // Optimization: Use select() and lean() for user lookup to reduce overhead
  const user = await User.findOne({ email }).select("_id").lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Optimization: Use select() to fetch only necessary fields for the toggle operation
  // Note: lean() is NOT used here because we call post.save() later
  const post = await Post.findOne({ _id: postId, isDeleted: { $ne: true } }).select("likesCount reactions");
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  // Check existing reaction (by this user on this post, regardless of type)
  const existingReaction = await Reaction.findOne({
    postId: new Types.ObjectId(postId),
    userId: user._id,
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      // Remove reaction if same type clicked again
      await Reaction.findByIdAndDelete(existingReaction._id);

      // Update post counts and reactions list
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      post.reactions = post.reactions || [];
      post.reactions = post.reactions.filter(
        (rId) => rId.toString() !== existingReaction._id.toString()
      );
      await post.save();

      return {
        message: "Reaction removed successfully",
        likesCount: post.likesCount,
      };
    } else {
      // Update existing reaction type
      existingReaction.type = type;
      await existingReaction.save();

      // Ensure post.reactions contains this reaction ID
      post.reactions = post.reactions || [];
      if (!post.reactions.some((rId) => rId.toString() === existingReaction._id.toString())) {
        post.reactions.push(existingReaction._id);
        await post.save();
      }

      return {
        message: "Reaction updated successfully",
        likesCount: post.likesCount,
      };
    }
  } else {
    // Create new reaction
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type,
    });

    // Update post counts and reactions list
    post.likesCount = (post.likesCount || 0) + 1;
    post.reactions = post.reactions || [];
    post.reactions.push(newReaction._id);
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
