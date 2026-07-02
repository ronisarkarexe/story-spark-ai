import { Request, Response } from "express";
import { analyzeEngagement } from "./engagement.service";

export const EngagementController = {
  analyzeChapter: async (req: Request, res: Response) => {
    try {
      const { chapterText, title } = req.body;
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
