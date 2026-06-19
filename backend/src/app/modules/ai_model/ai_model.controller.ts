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
  QuotaRefundGuard,
  runWithQuotaCleanup,
} from "./quota.lifecycle";
import { generateWithGeminiStoriesStream } from "./ai_model.utils";

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
    const result = await AiModelService.aiModelGenerate(prompt);
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
    setGuestUserIdCookie(res, userId);  // ✅ Fixed: now includes sameSite
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
      setGuestUserIdCookie(res, userId);  // ✅ Fixed: now includes sameSite
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
  const guard = res.locals.quotaRefundGuard;

  if (!guard) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Quota guard missing - checkRequestLimit middleware required"
    );
  }

  await streamStoryGeneration(req, res, guard);
};

const aiFreeModelGenerateStream = async (req: Request, res: Response) => {
  let userId = req.cookies.userId as string | undefined;

  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    setGuestUserIdCookie(res, userId);
  }

  const guard = createGuestQuotaGuard(userId);
  await reserveGuestQuota(userId);
  await streamStoryGeneration(req, res, guard);
};

const streamStoryGeneration = async (
  req: Request,
  res: Response,
  guard: QuotaRefundGuard
) => {
  const {
    prompt,
    wordLength = 250,
    numStories = 2,
    language = "English",
    tone,
    genre,
  } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const controller = new AbortController();
  let completed = false;

  req.on("close", () => {
    if (!completed) {
      controller.abort();
    }
  });

  try {
    const stories = await runWithQuotaCleanup(guard, () =>
      generateWithGeminiStoriesStream(
        prompt,
        wordLength,
        numStories,
        (chunk: string) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        controller.signal,
        language,
        tone,
        genre
      )
    );

    res.write(`data: ${JSON.stringify({ stories })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    completed = true;
    res.end();
  } catch (error: unknown) {
    await guard.refundOnce();
    const errorMsg = error instanceof Error ? error.message : String(error);
    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    completed = true;
    res.end();
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
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
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
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
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
    res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
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

export const AiModelController = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelGenerateStream,
  aiFreeModelGenerateStream,
  aiModelRemix,
  aiFreeModelRemix,
  aiModelTranslate,
  aiFreeModelTranslate,
  aiModelChat,
  aiFreeModelChat,
};
