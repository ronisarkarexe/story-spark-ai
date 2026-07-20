import { Request, Response } from "express";
import { getWeeklyLeaderboard } from "../services/leaderboard.service";

export const weeklyLeaderboardController = async (
  _req: Request,
  res: Response
) => {
  try {
    const data = await getWeeklyLeaderboard();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};