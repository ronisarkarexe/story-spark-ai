import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IComment, ICommentPayload } from "./comment.interface";
import httpStatus from "http-status";
import { Comment } from "./comment.model";
import { startSession, Types } from "mongoose";
import { Post } from "../post/post.model";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { assertContentSafe } from "../../../utils/contentModeration";
import { verifyPostAccess } from "../post/post.utils";

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

  verifyPostAccess(post, user);

  // Content moderation — block inappropriate comments before persisting
  try {
    assertContentSafe(payload.comment);
  } catch (moderationError) {
    const msg = moderationError instanceof Error ? moderationError.message : "Comment blocked by content moderation.";
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, msg);
  }

  // Validate parent comment if parentCommentId is provided
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
      { _id: post._id, isDeleted: { $ne: true } },
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

const getCommentsByPostId = async (postId: string, token?: ITokenPayload | null) => {
  const post = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }
  let user = null;
  if (token && token.email) {
    user = await User.findOne({ email: token.email });
  }
  verifyPostAccess(post, user);

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
  verifyPostAccess(post, user);
  
  // Replace the read-modify-write likes toggle with atomic MongoDB operators.
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

const toggleCommentHelpful = async (commentId: string, token: ITokenPayload) => {
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

  const isCurrentlyHelpful = await Comment.exists({
    _id: comment._id,
    helpful: user._id,
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    comment._id,
    isCurrentlyHelpful
      ? { $pull: { helpful: user._id } }
      : { $addToSet: { helpful: user._id } },
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

  const post = await Post.findOne({
    _id: comment.postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }
  verifyPostAccess(post, user);

  // Only the comment author or an admin/super-admin can delete
  const isAuthor = comment.userId.toString() === user._id.toString();
  const isAdmin = role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN;
  if (!isAuthor && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment!"
    );
  }
  // Count replies before deleting parent
  const replyCount = await Comment.countDocuments({ parentCommentId: commentId });

  await Comment.findByIdAndDelete(commentId);

  // Delete all replies to this comment
  if (replyCount > 0) {
    await Comment.deleteMany({ parentCommentId: commentId });
  }

  // Decrement by 1 (parent) + reply count
  await Post.findByIdAndUpdate(comment.postId, {
    $inc: { commentsCount: -(1 + replyCount) },
  });
  return { message: "Comment deleted successfully!" };
};

const hideComment = async (commentId: string) => {
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      isHidden: true,
    },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found!");
  }

  return comment;
};

const restoreComment = async (commentId: string) => {
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      isHidden: false,
    },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found!");
  }

  return comment;
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
  toggleCommentHelpful,
  deleteComment,
  hideComment,
  restoreComment,
};
