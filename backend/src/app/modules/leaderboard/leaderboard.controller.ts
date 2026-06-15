import { Request, Response } from "express";

export const getWeeklyLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const mockLeaderboardData = [
      {
        rank: 1,
        name: "Aarav Sharma",
        storiesCount: 14,
        creativeScore: 98,
        collaborations: 6,
        type: "Writers",
      },
      {
        rank: 2,
        name: "Suraj Bharsakle",
        storiesCount: 12,
        creativeScore: 95,
        collaborations: 8,
        type: "Storytellers",
      },
      {
        rank: 3,
        name: "Ananya Iyer",
        storiesCount: 10,
        creativeScore: 92,
        collaborations: 4,
        type: "Contributors",
      },
      {
        rank: 4,
        name: "Rohan Verma",
        storiesCount: 8,
        creativeScore: 89,
        collaborations: 3,
        type: "Writers",
      },
      {
        rank: 5,
        name: "Diya Patel",
        storiesCount: 7,
        creativeScore: 87,
        collaborations: 5,
        type: "Contributors",
      }
    ];

    res.status(200).json({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: mockLeaderboardData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to compile leaderboard metrics",
    });
  }
};