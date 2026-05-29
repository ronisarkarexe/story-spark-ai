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
    postId: new Types.ObjectId(postId),
    userId: user._id,
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      const likesCount = await Reaction.countDocuments({ postId: new Types.ObjectId(postId), type: "like" });
      return { message: "Reaction removed", likesCount };
    } else {
      existingReaction.type = type;
      await existingReaction.save();
      const likesCount = await Reaction.countDocuments({ postId: new Types.ObjectId(postId), type: "like" });
      return { message: "Reaction updated", likesCount };
    }
  } else {
    const newReaction = await Reaction.create({
      postId: new Types.ObjectId(postId),
      userId: user._id,
      type: type,
    });
    const likesCount = await Reaction.countDocuments({ postId: new Types.ObjectId(postId), type: "like" });
    return { message: "Reaction added", likesCount };
  }
};

export const ReactionService = {
  toggleReaction,
};
