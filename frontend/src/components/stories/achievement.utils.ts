export interface Achievement {
  title: string;
  target: number;
  badge: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "First Story",
    target: 1,
    badge: "🌱",
    description: "Create your first story",
  },
  {
    title: "Story Explorer",
    target: 5,
    badge: "📚",
    description: "Write 5 stories",
  },
  {
    title: "Creative Writer",
    target: 10,
    badge: "✍️",
    description: "Write 10 stories",
  },
  {
    title: "Master Storyteller",
    target: 25,
    badge: "🏆",
    description: "Write 25 stories",
  },
  {
    title: "Legendary Author",
    target: 50,
    badge: "👑",
    description: "Write 50 stories",
  },
];


// Get unlocked achievements
export const getUnlockedAchievements = (totalStories: number) => {
  return ACHIEVEMENTS.filter(
    (achievement) => totalStories >= achievement.target
  );
};


// Get next achievement progress
export const getNextAchievement = (totalStories: number) => {
  return ACHIEVEMENTS.find(
    (achievement) => totalStories < achievement.target
  );
};


// Calculate progress percentage
export const calculateAchievementProgress = (
  totalStories: number
) => {
  const nextAchievement = getNextAchievement(totalStories);

  if (!nextAchievement) {
    return 100;
  }

  return Math.min(
    (totalStories / nextAchievement.target) * 100,
    100
  );
};


// Update writing streak
export const updateWritingStreak = () => {
  const today = new Date().toDateString();

  const lastDate =
    localStorage.getItem("last-writing-date");

  let currentStreak = Number(
    localStorage.getItem("current-writing-streak")
  ) || 0;

  let longestStreak = Number(
    localStorage.getItem("longest-writing-streak")
  ) || 0;


  if (lastDate !== today) {
    currentStreak += 1;

    localStorage.setItem(
      "last-writing-date",
      today
    );

    localStorage.setItem(
      "current-writing-streak",
      currentStreak.toString()
    );

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;

      localStorage.setItem(
        "longest-writing-streak",
        longestStreak.toString()
      );
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
};


// Get stored streak values
export const getWritingStreak = () => {
  return {
    currentStreak:
      Number(localStorage.getItem("current-writing-streak")) || 0,

    longestStreak:
      Number(localStorage.getItem("longest-writing-streak")) || 0,
  };
};