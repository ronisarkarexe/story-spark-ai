export interface WritingStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalWritingDays: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}
