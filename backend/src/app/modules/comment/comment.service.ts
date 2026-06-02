import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import {
  IComment,
  ICommentDTO,
  ICommentPayload,
  ILeanComment,
} from "./comment.interface";
import httpStatus from "http-status";
import { Comment } from "./comment.model";
import { startSession, Types } from "mongoose";
import { Post } from "../post/post.model";

const getValidParentCommentId = async (
  parentCommentId: string,
  postId: string,
) => {
  if (!Types.ObjectId.isValid(parentCommentId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid parentCommentId");
  }

  const parentComment = await Comment.findOne({
    _id: parentCommentId,
    postId,
  });

  if (!parentComment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Parent comment not found for this post!",
    );
  }

  if (parentComment.parentCommentId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Replies can only be added to top-level comments!",
    );
  }

  return new Types.ObjectId(parentCommentId);
};

const createComment = async (
  payload: ICommentPayload,
  token: ITokenPayload,
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

  const commentData: Omit<IComment, "parentCommentId"> = {
    postId: new Types.ObjectId(payload.postId),
    userId: user._id,
    comment: payload.comment,
  };
  if (payload.parentCommentId) {
    (commentData as IComment).parentCommentId = await getValidParentCommentId(
      payload.parentCommentId,
      payload.postId,
    );
  }
  const session = await startSession();

  try {
    session.startTransaction();

    const [createdComment] = await Comment.create([commentData], { session });
    const updateResult = await Post.updateOne(
      {
        _id: post._id,
        isDeleted: { $ne: true },
      },
      { $inc: { commentsCount: 1 } },
      { session },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
    }

    await session.commitTransaction();
    return createdComment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getCommentsByPostId = async (postId: string) => {
  const post = await Post.findOne({ _id: postId, isDeleted: { $ne: true } });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }

  const allComments = (await Comment.find({ postId })
    .populate("userId", "name email")
    .populate("likes")
    .sort({ createdAt: -1 })
    .lean()) as unknown as ILeanComment[];

  const totalComments = allComments.length;

  const topLevelComments: ICommentDTO[] = [];
  const replyMap = new Map<string, ICommentDTO[]>();

  for (const comment of allComments) {
    const commentDTO: ICommentDTO = {
      ...comment,
      replies: [],
    };

    if (!commentDTO.parentCommentId) {
      topLevelComments.push(commentDTO);
    } else {
      const parentIdStr = commentDTO.parentCommentId.toString();
      if (!replyMap.has(parentIdStr)) {
        replyMap.set(parentIdStr, []);
      }
      replyMap.get(parentIdStr)!.push(commentDTO);
    }
  }

  for (const comment of topLevelComments) {
    const idStr = comment._id.toString();
    const replies = replyMap.get(idStr) || [];

    // Sort replies in ascending chronological order, avoiding new Date allocation where possible
    replies.sort((a, b) => {
      const timeA =
        a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : new Date(a.createdAt).getTime();
      const timeB =
        b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

    comment.replies = replies;
  }

  return { comments: topLevelComments, totalComments };
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
