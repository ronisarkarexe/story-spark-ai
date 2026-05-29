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
  post.commentsCount = post.commentsCount + 1;
  await post.save();
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

  // Distribute comments into top-level list and replies map
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

  // Attach replies to their corresponding top-level comments and sort them chronologically (createdAt: 1)
  for (const comment of topLevelComments) {
    const idStr = comment._id.toString();
    const replies = replyMap.get(idStr) || [];
    
    // Sort replies in ascending chronological order, avoiding new Date allocation where possible
    replies.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
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
  
  const hasLiked = comment.likes?.includes(user._id);
  if (hasLiked) {
    comment.likes = comment.likes?.filter((id) => id.toString() !== user._id.toString());
  } else {
    comment.likes?.push(user._id);
  }
  await comment.save();
  return comment;
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
};
