import { Request, Response } from "express";
import { getWeeklyLeaderboard } from "../../../services/leaderboard.service";

export const getWeeklyLeaderboardController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getWeeklyLeaderboard();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};