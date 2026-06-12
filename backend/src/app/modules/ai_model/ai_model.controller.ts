import { Request, Response } from "express";
import { setGuestUserIdCookie } from "../../../utils/cookie.util";
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
import { checkAndTrackRequest, releaseRequest } from "../../../utils/idempotency";

const aiModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  const user = (req as any).user;
  const userIdentifier = user?._id || user?.email || req.ip || "unknown";

  if (!checkAndTrackRequest(userIdentifier, prompt)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "A duplicate request is already in progress. Please wait."
    );
  }

  try {
    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiModelGenerate(prompt);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Stories generated successfully!",
        data: result,
      });
    });
  } finally {
    releaseRequest(userIdentifier, prompt);
  }
});

const aiFreeModelGenerate = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body;
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const userIdentifier = userId || req.ip || "guest";

  if (!checkAndTrackRequest(userIdentifier, prompt)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "A duplicate request is already in progress. Please wait."
    );
  }

  const guard = createGuestQuotaGuard(userId);
  try {
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
  } finally {
    releaseRequest(userIdentifier, prompt);
  }
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
    const result = await AiModelService.aiModelAlternateEndings(payload);
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
      setGuestUserIdCookie(res, userId);
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

const aiModelGenerateStream = async (req: Request, res: Response) => {
  const { prompt, wordLength, numStories } = req.body;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    res.status(500).json({ error: "Quota guard missing" });
    return;
  }

  const user = (req as any).user;
  const userIdentifier = user?._id || user?.email || req.ip || "unknown";
  const payloadForDeduplication = { prompt, wordLength, numStories };

  if (!checkAndTrackRequest(userIdentifier, payloadForDeduplication)) {
    res.status(409).json({ error: "A duplicate request is already in progress. Please wait." });
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

  try {
    await runWithQuotaCleanup(guard, async () => {
      try {
        await generateWithGeminiStoriesStream(
          prompt,
          wordLength ?? 250,
          numStories ?? 2,
          (chunk: string) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
          },
          controller.signal
        );
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
        res.end();
        throw error;
      }
    });
  } finally {
    releaseRequest(userIdentifier, payloadForDeduplication);
  }
};
const aiModelRemix = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as IRemixPayload;
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing — checkRequestLimit middleware required"
    );
  }

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelRemix(payload);
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
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    await reserveGuestQuota(userId);
    const result = await AiModelService.aiFreeModelRemix(payload);
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

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelTranslate(payload);
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
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    await reserveGuestQuota(userId);
    const result = await AiModelService.aiFreeModelTranslate(payload);
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

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelChat(payload);
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
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    await reserveGuestQuota(userId);
    const result = await AiModelService.aiFreeModelChat(payload);
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

  await runWithQuotaCleanup(guard, async () => {
    const result = await AiModelService.aiModelStoryContinuation(payload);
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
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const guard = createGuestQuotaGuard(userId);
  await runWithQuotaCleanup(guard, async () => {
    await reserveGuestQuota(userId);
    const result = await AiModelService.aiFreeStoryContinuation(payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story continuation generated successfully!",
      data: result,
    });
  });
});

export const AiModelController = {
  aiModelGenerate,
  aiFreeModelGenerate,
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
};
