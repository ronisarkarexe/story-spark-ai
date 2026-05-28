import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IComment, ICommentPayload } from "./comment.interface";
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
  const post = await Post.findOne({ _id: payload.postId });
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
  const comments = await Comment.find({ postId })
    .populate("userId", "name email")
    .populate({ path: "likes" });

  const commentNodes = new Map<string, (IComment & { replies: IComment[] })>();
  const topLevel: (IComment & { replies: IComment[] })[] = [];

  for (const comment of comments) {
    const commentObject = comment.toObject() as IComment & { replies: IComment[] };
    commentObject.replies = [];
    commentNodes.set(comment._id.toString(), commentObject);
  }

  for (const comment of comments) {
    const node = commentNodes.get(comment._id.toString());
    if (!node) {
      continue;
    }

    if (comment.parentCommentId) {
      const parentNode = commentNodes.get(comment.parentCommentId.toString());
      if (parentNode) {
        parentNode.replies.push(node);
        continue;
      }
    }

    topLevel.push(node);
  }

  for (const node of commentNodes.values()) {
    if (node.replies.length > 1) {
      node.replies.sort(
        (a, b) =>
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime()
      );
    }
  }

  topLevel.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );

  return { comments: topLevel, totalComments: comments.length };
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
