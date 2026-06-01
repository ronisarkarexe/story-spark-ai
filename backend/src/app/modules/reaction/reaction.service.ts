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

  const existingReaction = await Reaction.findOne({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type: type,
  });

  if (existingReaction) {
    await Reaction.deleteOne({ _id: existingReaction._id });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { likesCount: -1 } },
      { new: true }
    );
    return { message: "Reaction removed successfully", likesCount: updatedPost?.likesCount || 0 };
  } else {
    await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type: type,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    return { message: "Reaction added successfully", likesCount: updatedPost?.likesCount || 0 };
  }

  const newReaction = await Reaction.create({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type,
  });

  post.likesCount = (post.likesCount || 0) + 1;
  post.reactions = post.reactions || [];
  post.reactions.push(newReaction._id);

  await post.save();

  return { message: "Reaction added", likesCount: post.likesCount };
};

export const ReactionService = {
  toggleReaction,
};