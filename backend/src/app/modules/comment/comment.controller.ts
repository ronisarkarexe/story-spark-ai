import { Request, Response } from "express";
import { routeParam } from "../../../shared/route_param";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { CommentService } from "./comment.service";
import { getToken } from "../../middleware/token";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const result = await CommentService.createComment(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully!",
    data: result,
  });
});

const getCommentsByPostId = catchAsync(async (req: Request, res: Response) => {
  const postId = routeParam(req.params.postId);
  const result = await CommentService.getCommentsByPostId(postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments fetched successfully!",
    data: result,
  });
});

const toggleCommentLike = catchAsync(async (req: Request, res: Response) => {
  const commentId = routeParam(req.params.commentId);
  const token = await getToken(req);
  const result = await CommentService.toggleCommentLike(commentId, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment like toggled successfully!",
    data: result,
  });
});

const toggleCommentHelpful = catchAsync(async (req: Request, res: Response) => {
  const commentId = routeParam(req.params.commentId);
  const token = await getToken(req);
  const result = await CommentService.toggleCommentHelpful(commentId, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment helpful status toggled successfully!",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = routeParam(req.params.commentId);
  const token = await getToken(req);
  const result = await CommentService.deleteComment(commentId, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully!",
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
  toggleCommentHelpful,
  deleteComment,
};
