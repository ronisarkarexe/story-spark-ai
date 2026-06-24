export interface LeaderboardUser {
  username: string;
  avatar: string;
  score: number;
}

export interface WeeklyLeaderboard {
  totalStories: number;
  leaderboard: LeaderboardUser[];
}