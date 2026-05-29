import httpStatus from 'http-status';
import ApiError from '../../../errors/api_error';
import { Post } from '../post/post.model';
import { Reaction } from './reaction.model';
import { Types } from 'mongoose';

const toggleReaction = async (postId: string, user: any, type: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  const newReaction = await Reaction.create({
    postId: new Types.ObjectId(postId),
    userId: user._id,
    type: type,
  });

  return newReaction;
};

export const ReactionService = {
  toggleReaction,
};
