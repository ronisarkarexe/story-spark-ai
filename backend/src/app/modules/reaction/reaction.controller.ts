import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import { getToken } from "../../middleware/token";
import sendResponse from "../../../shared/send_response";
import { ReactionService } from "./reaction.service";

const toggleReaction = catchAsync(async (req: Request, res: Response) => {
  const { postId, type } = req.body;
  const token = await getToken(req);
  const result = await ReactionService.toggleReaction(postId, type, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reaction added successfully",
    data: result,
  });
});

export const ReactionController = {
  toggleReaction,
};
