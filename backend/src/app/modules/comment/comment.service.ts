import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IComment, ICommentDTO, ICommentPayload, ILeanComment } from "./comment.interface";
import httpStatus from "http-status";
import { Comment } from "./comment.model";
import { startSession, Types } from "mongoose";
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
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }

  // Parent comment validations
  if (payload.parentCommentId) {
    if (!Types.ObjectId.isValid(payload.parentCommentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid parentCommentId");
    }
    const parentComment = await Comment.findOne({
      _id: payload.parentCommentId,
      postId: payload.postId,
    });
    if (!parentComment) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Parent comment not found for this post!"
      );
    }
    if (parentComment.parentCommentId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Replies can only be added to top-level comments!"
      );
    }
  }

  const session = await startSession();
  try {
    session.startTransaction();

    const updateResult = await Post.updateOne(
      { _id: payload.postId, isDeleted: { $ne: true } },
      { $inc: { commentsCount: 1 } },
      { session }
    );
    if (updateResult.modifiedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
    }

    const commentData: any = {
      postId: new Types.ObjectId(payload.postId),
      userId: user._id,
      comment: payload.comment,
    };
    if (payload.parentCommentId) {
      commentData.parentCommentId = new Types.ObjectId(payload.parentCommentId);
    }

    const res = await Comment.create([commentData], { session });
    await session.commitTransaction();
    await session.endSession();
    return res[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getCommentsByPostId = async (postId: string) => {
  return await Comment.find({ postId }).populate("userId", "name profile.avatar").sort({ createdAt: -1 });
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

const deleteComment = async (commentId: string, token: ITokenPayload) => {
  const { _id, email, role } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found!");
  }
  // Only the comment author or an admin/super-admin can delete
  const isAuthor = comment.userId.toString() === user._id.toString();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  if (!isAuthor && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment!"
    );
  }
  await Comment.findByIdAndDelete(commentId);
  // Decrement commentsCount on the post atomically
  await Post.findByIdAndUpdate(comment.postId, {
    $inc: { commentsCount: -1 },
  });
  return { message: "Comment deleted successfully!" };
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
  deleteComment,
};
