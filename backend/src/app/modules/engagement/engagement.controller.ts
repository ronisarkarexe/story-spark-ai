import { Request, Response } from "express";
import { analyzeEngagement } from "./engagement.service";

import logger from "../../../utils/logger.util";
export const EngagementController = {
  analyzeChapter: async (req: Request, res: Response) => {
    try {
      const { chapterText, title } = req.body;
      const data = await analyzeEngagement(chapterText, title);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error("Engagement analysis failed", error);
      return res.status(500).json({
        success: false,
        message: "Engagement analysis failed. Please try again.",
      });
    }
  },
};
