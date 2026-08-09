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
  return [
    {
      id: 1,
      title: "First Story",
      description: "Read your first story",
      unlocked: storiesRead >= 1,
    },
    {
      id: 2,
      title: "Bookworm",
      description: "Read 10 stories",
      unlocked: storiesRead >= 10,
    },
    {
      id: 3,
      title: "Genre Explorer",
      description: "Explore 5 genres",
      unlocked: genresRead >= 5,
    },
    {
      id: 4,
      title: "Reading Streak",
      description: "Read for 7 consecutive days",
      unlocked: streak >= 7,
    },
  ];
}