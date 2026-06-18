import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Reaction } from "./reaction.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";
import { PostService } from "../post/post.service";

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

      PostService.clearPostCache().catch(console.error);

      return {
        message: "Reaction removed successfully",
        likesCount: post.likesCount,
      };
    } else {
      // Update reaction to new type
      existingReaction.type = type;
      await existingReaction.save();

      PostService.clearPostCache().catch(console.error);

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

    PostService.clearPostCache().catch(console.error);

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
