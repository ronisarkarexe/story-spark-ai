import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { NarrationService } from "./narration.service";
import path from "path";
import fs from "fs";

const getVoices = catchAsync(async (req: Request, res: Response) => {
  const result = NarrationService.getVoices();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Voices retrieved successfully!",
    data: result,
  });
});

const synthesize = catchAsync(async (req: Request, res: Response) => {
  const { text, voiceId, storyId, chapterId } = req.body;

  const filename = await NarrationService.synthesizeTTS(
    text,
    voiceId,
    storyId,
    chapterId
  );

  // Construct URL dynamically from request host
  const protocol = req.protocol;
  const host = req.get("host");
  const audioUrl = `${protocol}://${host}/api/v1/narration/audio/${filename}`;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TTS Narration generated successfully!",
    data: {
      audioUrl,
      filename,
    },
  });
});

const getAudioFile = (req: Request, res: Response) => {
  const { filename } = req.params;

  // Prevent path traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(NarrationService.CACHE_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Audio file not found",
    });
  }

  res.setHeader("Content-Type", "audio/mpeg");
  res.sendFile(filePath);
};

export const NarrationController = {
  getVoices,
  synthesize,
  getAudioFile,
};
