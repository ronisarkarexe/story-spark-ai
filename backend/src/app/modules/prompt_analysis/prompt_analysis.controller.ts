import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { PromptAnalysisService } from "./prompt_analysis.service";
import { IPromptAnalysisRequest } from "./prompt_analysis.interface";

export const PromptAnalysisController = {
  /**
   * POST /api/v1/prompt-analysis/analyze
   * Analyze a user prompt and return creativity score + enhancements
   */
  analyzePrompt: catchAsync(async (req: Request, res: Response) => {
    const { prompt, language, genre, tone } = req.body as IPromptAnalysisRequest;

    const result = await PromptAnalysisService.analyzePrompt({
      prompt,
      language,
      genre,
      tone,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prompt analysis completed successfully",
      data: result,
    });
  }),

  /**
   * POST /api/v1/prompt-analysis/batch
   * Analyze multiple prompts (for bulk operations)
   */
  batchAnalyzePrompts: catchAsync(async (req: Request, res: Response) => {
    const { prompts } = req.body as {
      prompts: IPromptAnalysisRequest[];
    };

    if (!Array.isArray(prompts) || prompts.length === 0) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Prompts array is required and must not be empty",
        data: [],
      });
      return;
    }

    // Limit batch size to 10
    const limitedPrompts = prompts.slice(0, 10);

    const results = await Promise.all(
      limitedPrompts.map((p) => PromptAnalysisService.analyzePrompt(p))
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Analyzed ${results.length} prompts successfully`,
      data: results,
    });
  }),

  /**
   * POST /api/v1/prompt-analysis/enhance
   * Get enhanced version of a prompt without full analysis
   */
  enhancePrompt: catchAsync(async (req: Request, res: Response) => {
    const { prompt, language, genre, tone } = req.body as IPromptAnalysisRequest;

    const result = await PromptAnalysisService.analyzePrompt({
      prompt,
      language,
      genre,
      tone,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prompt enhanced successfully",
      data: {
        originalPrompt: prompt,
        enhancedPrompt: result.enhancedPrompt,
        improvements: result.improvements,
        keywords: result.keywords,
      },
    });
  }),
};
