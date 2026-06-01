import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Reaction } from "./reaction.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";

const toggleReaction = async (
  postId: string,
  type: string = "like",
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

  // Check if reaction already exists
  // Optimization: Use lean() for read-only existence check
  const existingReaction = await Reaction.findOne({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type: type,
  }).lean();

  if (existingReaction) {
    // Remove reaction
    await Reaction.findByIdAndDelete(existingReaction._id);

    // Update post counts and reactions list (Preserving upstream/main logic)
    post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
    post.reactions = post.reactions || [];
    post.reactions = post.reactions.filter(
      (rId) => rId.toString() !== existingReaction._id.toString()
    );
    await post.save();

    return { message: "Reaction removed", likesCount: post.likesCount };
  } else {
    // Add reaction
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type: type,
    });

    // Update post counts and reactions list (Preserving upstream/main logic)
    post.likesCount = (post.likesCount || 0) + 1;
    post.reactions = post.reactions || [];
    post.reactions.push(newReaction._id);
    await post.save();

    return { message: "Reaction added", likesCount: post.likesCount };
  }
};

export const ReactionService = {
  toggleReaction,
};
