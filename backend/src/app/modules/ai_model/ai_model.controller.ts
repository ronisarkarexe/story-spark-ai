import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { AiModelService } from "./ai_model.service";
import { IRemixPayload } from "./ai_model.interface";
import { getToken } from "../../middleware/token";
import { reserveGuestQuota } from "./quota.service";
import {
  createGuestQuotaGuard,
  runWithQuotaCleanup,
} from "./quota.lifecycle";

const aiModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  await runWithQuotaCleanup(guard, async () => {
    const token = await getToken(req);
    const result = await AiModelService.aiModelGenerate(prompt, token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Stories generated successfully!",
      data: result,
    });
  });
});

const aiFreeModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }

  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    await reserveGuestQuota(userId);
    const result = await AiModelService.aiFreeModelGenerate(prompt);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story generated successfully!",
      data: result,
    });
  });
});

const aiModelAlternateEndings = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  await runWithQuotaCleanup(guard, async () => {
    const token = await getToken(req);
    const result = await AiModelService.aiModelAlternateEndings(payload, token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Alternate endings generated successfully!",
      data: result,
    });
  });
});

const aiFreeModelAlternateEndings = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    let userId = req.cookies.userId as string | undefined;

    if (!userId) {
      userId = Math.random().toString(36).substring(7);
      res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }

    const guard = createGuestQuotaGuard(userId);
    await runWithQuotaCleanup(guard, async () => {
      await reserveGuestQuota(userId);
      const result = await AiModelService.aiFreeModelAlternateEndings(payload);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Alternate endings generated successfully!",
        data: result,
      });
    });
  }
);

const aiModelRemix = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRemixPayload;
  const token = await getToken(req);
  const result = await AiModelService.aiModelRemix(payload, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story remixed successfully!",
    data: result,
  });
});

const aiFreeModelRemix = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRemixPayload;
  const result = await AiModelService.aiFreeModelRemix(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story remixed successfully!",
    data: result,
  });
});

export const AiModelController = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelRemix,
  aiFreeModelRemix,
};

