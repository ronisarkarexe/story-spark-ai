import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catch_async';
import sendResponse from '../../../shared/send_response';
import { ReactionService } from './reaction.service';

const toggleReaction = catchAsync(async (req: Request, res: Response) => {
  const { postId, type } = req.body;
  const user = (req as any).user;

  const result = await ReactionService.toggleReaction(postId, user, type);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reaction toggled successfully",
    data: result,
  });
});

export const ReactionController = {
  toggleReaction,
};
