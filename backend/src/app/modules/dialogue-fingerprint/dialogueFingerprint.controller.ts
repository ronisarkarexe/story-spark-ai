import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { DialogueFingerprintService } from "./dialogueFingerprint.service";
import ApiError from "../../../errors/api_error";
import { routeParam } from "../../../shared/route_param";

const analyzeDialogueVoices = catchAsync(
  async (req: Request, res: Response) => {
    const storyId = routeParam(req.params.storyId);
    const user = req.user;

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized.");
    }

    const result = await DialogueFingerprintService.analyzeDialogueVoices(
      storyId,
      user._id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dialogue voice analysis completed successfully!",
      data: result,
    });
  }
);

export const DialogueFingerprintController = {
  analyzeDialogueVoices,
};
