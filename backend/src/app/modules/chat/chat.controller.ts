import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { ChatService } from "./chat.service";

const chatWithAi = catchAsync(async (req: Request, res: Response) => {
  const { messages } = req.body;
  const result = await ChatService.chatWithAi(messages);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chat reply generated successfully!",
    data: result,
  });
});

export const ChatController = {
  chatWithAi,
};
