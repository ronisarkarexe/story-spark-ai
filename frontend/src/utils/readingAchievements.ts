export interface Badge {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
}

export function getAchievementBadges(
  storiesRead: number,
  genresRead: number,
  streak: number
): Badge[] {
  const safeStories = Math.max(0, isNaN(storiesRead) ? 0 : storiesRead);
  const safeGenres = Math.max(0, isNaN(genresRead) ? 0 : genresRead);
  const safeStreak = Math.max(0, isNaN(streak) ? 0 : streak);

  return [
    {
      id: 1,
      title: "First Story",
      description: "Read your first story",
      unlocked: safeStories >= 1,
    },
    {
      id: 2,
      title: "Bookworm",
      description: "Read 10 stories",
      unlocked: safeStories >= 10,
    },
    {
      id: 3,
      title: "Genre Explorer",
      description: "Explore 5 genres",
      unlocked: safeGenres >= 5,
    },
    {
      id: 4,
      title: "Reading Streak",
      description: "Read for 7 consecutive days",
      unlocked: safeStreak >= 7,
    },
  ];
}