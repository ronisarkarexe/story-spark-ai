import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { getToken } from "../../middleware/token";
import { SuggestionService } from "./suggestion.service";

const generate = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const result = await SuggestionService.generateSuggestion(token._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Suggestion generated successfully!",
    data: result,
  });
});

const accept = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { id } = req.params;
  const result = await SuggestionService.acceptSuggestion(token._id, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestion accepted successfully!",
    data: result,
  });
});

const reject = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { id } = req.params;
  const result = await SuggestionService.rejectSuggestion(token._id, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestion rejected successfully!",
    data: result,
  });
});

const history = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const result = await SuggestionService.getSuggestionsHistory(token._id, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions history retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const token = getToken(req);
  const { id } = req.params;
  const result = await SuggestionService.deleteSuggestionFromHistory(token._id, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
  });
});

export const SuggestionController = {
  generate,
  accept,
  reject,
  history,
  remove,
};
