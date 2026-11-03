import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { ChapterIllustrationService } from "./chapter_illustration.service";
import { IChapterIllustrationPayload } from "./chapter_illustration.interface";

export const ChapterIllustrationController = {
  /**
   * Generate illustration for a single chapter
   */
  generateIllustration: catchAsync(async (req: Request, res: Response) => {
    const payload: IChapterIllustrationPayload = req.body;

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    const result = await ChapterIllustrationService.generateChapterIllustration(
      payload,
      controller.signal
    );

    sendResponse(res, {
      statusCode:
        result.imageStatus === "failed"
          ? httpStatus.PARTIAL_CONTENT
          : httpStatus.OK,
      success: result.imageStatus !== "failed",
      message:
        result.imageStatus === "generated"
          ? "Chapter illustration generated successfully"
          : result.imageStatus === "cached"
            ? "Chapter illustration retrieved from cache"
            : "Chapter illustration generation failed - fallback recommended",
      data: result,
    });
  }),

  /**
   * Generate illustrations for multiple chapters
   */
  generateBatchIllustrations: catchAsync(
    async (req: Request, res: Response) => {
      const { chapters, style = "illustration", quality = "standard" } = req.body;

      const payloads: IChapterIllustrationPayload[] = chapters.map(
        (chapter: any) => ({
          ...chapter,
          style,
          quality,
        })
      );

      const controller = new AbortController();
      req.on("close", () => controller.abort());

      const results =
        await ChapterIllustrationService.generateBatchIllustrations(
          payloads,
          controller.signal
        );

      const successCount = results.filter(
        (r) => r.imageStatus !== "failed"
      ).length;

      sendResponse(res, {
        statusCode:
          successCount === results.length
            ? httpStatus.OK
            : httpStatus.ACCEPTED,
        success: successCount > 0,
        message: `Generated ${successCount} of ${results.length} chapter illustrations`,
        data: {
          total: results.length,
          successful: successCount,
          failed: results.length - successCount,
          illustrations: results,
        },
      });
    }
  ),

  /**
   * Clear expired cache
   */
  clearCache: catchAsync(async (req: Request, res: Response) => {
    const deletedCount = await ChapterIllustrationService.clearExpiredCache();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Cleared ${deletedCount} expired cache entries`,
      data: { deletedCount },
    });
  }),
};
