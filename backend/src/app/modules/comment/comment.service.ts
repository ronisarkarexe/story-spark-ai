import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IComment, ICommentDTO, ICommentPayload, ILeanComment } from "./comment.interface";
import httpStatus from "http-status";
import { Comment } from "./comment.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";

const createComment = async (
  payload: ICommentPayload,
  token: ITokenPayload
) => {
  const { _id, email } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const post = await Post.findOne({
    _id: payload.postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }
  // Use an atomic $inc update instead of the read-modify-write pattern.
  // With concurrent requests, both would read the same commentsCount value
  // and both would write count + 1, losing one increment per race.
  // findByIdAndUpdate with $inc is a single atomic MongoDB operation.
  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });
  const commentData: Omit<IComment, "parentCommentId"> = {
    postId: new Types.ObjectId(payload.postId),
    userId: user._id,
    comment: payload.comment,
  };
  if (payload.parentCommentId) {
    (commentData as IComment).parentCommentId = new Types.ObjectId(
      payload.parentCommentId
    );
  }
  const res = await Comment.create(commentData);
  return res;
};

const getCommentsByPostId = async (postId: string) => {
  return await Comment.find({ post: postId }).populate("author", "name profile.avatar").sort({ createdAt: -1 });
};

const toggleCommentLike = async (commentId: string, token: ITokenPayload) => {
  const { _id, email } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  const post = await Post.findOne({
    _id: comment.postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }
  
  // Replace the read-modify-write likes toggle with atomic MongoDB operators.
  // The original pattern read likes, checked membership with includes, mutated
  // the array, and saved. Two concurrent toggles by the same user can both pass
  // the includes check (both see the ID absent), both push, and both save,
  // resulting in a duplicate like entry.
  //
  // $addToSet adds the user ID only if it is not already present (like).
  // $pull removes all matching entries (unlike). Both are atomic.
  // Checking the current state first determines which operation to perform.
  const isCurrentlyLiked = await Comment.exists({
    _id: comment._id,
    likes: user._id,
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    comment._id,
    isCurrentlyLiked
      ? { $pull: { likes: user._id } }
      : { $addToSet: { likes: user._id } },
    { new: true }
  );
  return updatedComment;
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
};
