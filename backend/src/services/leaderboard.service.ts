import {
  LeaderboardUser,
  WeeklyLeaderboard,
} from "../models/leaderboard.model";

export const getWeeklyLeaderboard =
  async (): Promise<WeeklyLeaderboard> => {
    // Mock data for now
    // Later you can connect database models here

    const stories = [
      {
        username: "PremDhakad07",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
        contributions: 34,
      },
      {
        username: "Roni",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4",
        contributions: 28,
      },
      {
        username: "Alex",
        avatar: "https://avatars.githubusercontent.com/u/3?v=4",
        contributions: 21,
      },
      {
        username: "Sarah",
        avatar: "https://avatars.githubusercontent.com/u/4?v=4",
        contributions: 18,
      },
    ];

    const leaderboard: LeaderboardUser[] = stories.map(
      (s): LeaderboardUser => ({
        username: s.username,
        avatar: s.avatar,
        score: Number(s.contributions),
      })
    );

    leaderboard.sort((a, b) => b.score - a.score);

    return {
      totalStories: stories.length,
      leaderboard,
    };
  };