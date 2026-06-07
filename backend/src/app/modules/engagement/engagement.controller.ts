import { Request, Response } from "express";
import { analyzeEngagement } from "./engagement.service";

export const EngagementController = {
  analyzeChapter: async (req: Request, res: Response) => {
    try {
      const { chapterText, title } = req.body;
      if (!chapterText || chapterText.trim().length < 100) {
        return res.status(400).json({
          success: false,
          message: "Chapter text must be at least 100 characters.",
        });
      }
      const data = await analyzeEngagement(chapterText, title);
      return res.status(200).json({ success: true, data });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Engagement analysis failed. Please try again.",
      });
    }
  },
};
