import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { AiModelService } from "./ai_model.service";
import { getToken } from "../../middleware/token";

const storyGenerationCounts: { [key: string]: number } = {};

const aiModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  const token = await getToken(req);
  const result = await AiModelService.aiModelGenerate(prompt, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stories generated successfully!",
    data: result,
  });
});

const aiFreeModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  let userId = req.cookies.userId;
  // If no cookie exists, generate a unique ID and set it in a cookie
  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  // Initialize or get the current count for the user
  if (!storyGenerationCounts[userId]) {
    storyGenerationCounts[userId] = 0;
  }
  
  if (storyGenerationCounts[userId] >= 3) {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "You have reached the maximum limit of 3 story generations.",
    });
  }
  
  // Atomic reservation in JS event loop
  storyGenerationCounts[userId] += 1;
  
  try {
    const result = await AiModelService.aiFreeModelGenerate(prompt);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story generated successfully!",
      data: result,
    });
  } catch (error) {
    // Rollback quota
    storyGenerationCounts[userId] = Math.max(0, storyGenerationCounts[userId] - 1);
    throw error;
  }
});

const aiModelAlternateEndings = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const token = await getToken(req);
  const result = await AiModelService.aiModelAlternateEndings(payload, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Alternate endings generated successfully!",
    data: result,
  });
});

const aiFreeModelAlternateEndings = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  let userId = req.cookies.userId;
  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  if (!storyGenerationCounts[userId]) {
    storyGenerationCounts[userId] = 0;
  }
  
  if (storyGenerationCounts[userId] > 3) {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "You have reached the maximum limit of 3 story generations.",
    });
  }
  
  const result = await AiModelService.aiFreeModelAlternateEndings(payload);
  storyGenerationCounts[userId] += 1;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Alternate endings generated successfully!",
    data: result,
  });
});

export const AiModelController = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
};

