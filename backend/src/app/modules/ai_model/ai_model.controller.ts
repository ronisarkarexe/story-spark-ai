import { Request, Response } from "express";
import { setGuestUserIdCookie } from "../../../utils/cookie.util";
import { randomUUID } from "node:crypto";
import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { AiModelService } from "./ai_model.service";
import { IRemixPayload, ITranslatePayload, IChatPayload } from "./ai_model.interface";
import { reserveGuestQuota } from "./quota.service";
import {
  createGuestQuotaGuard,
  runWithQuotaCleanup,
} from "./quota.lifecycle";
import { generateWithGeminiStoriesStream } from "./ai_model.utils";
import { UsageRecord } from "./usageRecord.model";
import { PLAN_QUOTAS } from "../../../config/quota.config";

const aiModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelGenerate(prompt, undefined, controller.signal);
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
    userId = randomUUID();
    setGuestUserIdCookie(res, userId);
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await reserveGuestQuota(userId);
  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiFreeModelGenerate(prompt, controller.signal);
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

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelAlternateEndings(payload, undefined, controller.signal);
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
      userId = randomUUID();
      setGuestUserIdCookie(res, userId);
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await reserveGuestQuota(userId);
    const guard = createGuestQuotaGuard(userId);
    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiFreeModelAlternateEndings(payload, controller.signal);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Alternate endings generated successfully!",
        data: result,
      });
    });
  }
);

const aiModelGenerateStream = catchAsync(async (req: Request, res: Response) => {
  const { prompt, wordLength, numStories } = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {                                           // ← ADD
    res.status(500).json({ error: "Quota guard missing" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const controller = new AbortController();

  req.on("close", () => {
    controller.abort();
  });

await runWithQuotaCleanup(guard, async () => {
  try {
    await generateWithGeminiStoriesStream(
      prompt,
      wordLength ?? 250,
      numStories ?? 2,
      (chunk: string) => {
        if (!res.writableEnded) res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
      controller.signal
    );
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  } catch (error: unknown) {
    if (controller.signal.aborted) {
      // Client disconnected, do nothing else to avoid crashing
      if (!res.writableEnded) res.end();
      return;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.end();
    }
    throw error;
  }
});
});
const aiModelRemix = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRemixPayload;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelRemix(payload, undefined, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story remixed successfully!",
      data: result,
    });
  });
});

const aiFreeModelRemix = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRemixPayload;
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = randomUUID();
    setGuestUserIdCookie(res, userId);
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await reserveGuestQuota(userId);
  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiFreeModelRemix(payload, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story remixed successfully!",
      data: result,
    });
  });
});

const aiModelTranslate = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ITranslatePayload;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelTranslate(payload, undefined, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story translated successfully!",
      data: result,
    });
  });
});

const aiFreeModelTranslate = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as ITranslatePayload;
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = randomUUID();
    setGuestUserIdCookie(res, userId);
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await reserveGuestQuota(userId);
  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiFreeModelTranslate(payload, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story translated successfully!",
      data: result,
    });
  });
});

const aiModelChat = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IChatPayload;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelChat(payload, undefined, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat response generated successfully!",
      data: result,
    });
  });
});

const aiFreeModelChat = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IChatPayload;
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = randomUUID();
    setGuestUserIdCookie(res, userId);
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await reserveGuestQuota(userId);
  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiFreeModelChat(payload, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat response generated successfully!",
      data: result,
    });
  });
});

const aiStoryContinuation = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as { prompt: string; language?: string };
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelStoryContinuation(payload, undefined, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story continuation generated successfully!",
      data: result,
    });
  });
});

const aiFreeStoryContinuation = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as { prompt: string; language?: string };
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = randomUUID();
    setGuestUserIdCookie(res, userId);
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  await reserveGuestQuota(userId);
  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiFreeStoryContinuation(payload, controller.signal);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story continuation generated successfully!",
      data: result,
    });
  });
});

const generateCharacterProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { story } = req.body;

    const result = await AiModelService.generateCharacterProfile(story);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Character profiles generated successfully!",
      data: result,
    });
  }
);

const getUsageMe = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const plan = user.subscriptionType || "free";
  const limitsForPlan = PLAN_QUOTAS[plan as keyof typeof PLAN_QUOTAS] || PLAN_QUOTAS.free;

  const now = new Date();
  const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch the usage records for this user for the current month
  const records = await UsageRecord.find({
    userId: user._id,
    billingPeriodStart,
  });

  const generateRecord = records.find((r) => r.action === "story_generate");
  const continueRecord = records.find((r) => r.action === "story_continue");

  const resetsAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Usage retrieved successfully",
    data: {
      plan,
      usage: {
        story_generate: {
          used: generateRecord ? generateRecord.count : 0,
          limit: limitsForPlan.story_generate,
        },
        story_continue: {
          used: continueRecord ? continueRecord.count : 0,
          limit: limitsForPlan.story_continue,
        },
      },
      resetsAt,
    },
  });
});

export const AiModelController = {
  aiModelGenerate,
  aiFreeModelGenerate,
  generateCharacterProfile,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelGenerateStream,
  aiModelRemix,
  aiFreeModelRemix,
  aiModelTranslate,
  aiFreeModelTranslate,
  aiStoryContinuation,
  aiFreeStoryContinuation,
  aiModelChat,
  aiFreeModelChat,
  getUsageMe,
};
