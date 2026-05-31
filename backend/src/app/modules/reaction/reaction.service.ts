import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Reaction } from "./reaction.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";

const toggleReaction = async (
  postId: string,
  type: "like" | "love" | "laugh" | "angry" | "sad" = "like",
  token: ITokenPayload
) => {
  const { email } = token;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const post = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  const existingReaction = await Reaction.findOne({
    userId: user._id,
    postId: post._id,
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { reactions: existingReaction._id },
          $inc: { likesCount: type === "like" ? -1 : 0 },
        },
        { new: true }
      );
      if (updatedPost && updatedPost.likesCount < 0) {
        await Post.updateOne({ _id: postId }, { $set: { likesCount: 0 } });
      }
      return {
        message: "Reaction removed",
        likesCount: Math.max(0, updatedPost?.likesCount ?? 0),
      };
    } else {
      const oldType = existingReaction.type;
      existingReaction.type = type;
      await existingReaction.save();

      let likesInc = 0;
      if (oldType === "like" && type !== "like") likesInc = -1;
      else if (oldType !== "like" && type === "like") likesInc = 1;

      let updatedPost = null;
      if (likesInc !== 0) {
        updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: { likesCount: likesInc } },
          { new: true }
        );
        if (updatedPost && updatedPost.likesCount < 0) {
          await Post.updateOne({ _id: postId }, { $set: { likesCount: 0 } });
        }
      } else {
        updatedPost = await Post.findById(postId);
      }
      return {
        message: "Reaction updated",
        likesCount: Math.max(0, updatedPost?.likesCount ?? 0),
      };
    }
  } else {
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type: type,
    });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: { reactions: newReaction._id },
        $inc: { likesCount: type === "like" ? 1 : 0 },
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
