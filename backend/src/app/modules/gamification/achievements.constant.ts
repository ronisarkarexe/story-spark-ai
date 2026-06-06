export interface IAchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "story" | "word_count" | "productivity";
  target: number;
}

export const ACHIEVEMENT_DEFINITIONS: IAchievementDefinition[] = [
  // Streak Achievements
  { id: "streak_1", title: "First Day Writing", description: "Write on 1 day to start your streak", icon: "🔥", category: "streak", target: 1 },
  { id: "streak_3", title: "3-Day Streak", description: "Maintain a writing streak for 3 days", icon: "⚡", category: "streak", target: 3 },
  { id: "streak_7", title: "7-Day Streak", description: "Maintain a writing streak for 7 days", icon: "🏆", category: "streak", target: 7 },
  { id: "streak_14", title: "14-Day Streak", description: "Maintain a writing streak for 14 days", icon: "🌟", category: "streak", target: 14 },
  { id: "streak_30", title: "30-Day Streak", description: "Maintain a writing streak for 30 days", icon: "👑", category: "streak", target: 30 },
  { id: "streak_100", title: "100-Day Streak", description: "Maintain a writing streak for 100 days", icon: "💯", category: "streak", target: 100 },

  // Story Achievements
  { id: "story_1", title: "First Story", description: "Create your first story", icon: "📝", category: "story", target: 1 },
  { id: "story_10", title: "10 Stories", description: "Create 10 stories", icon: "📚", category: "story", target: 10 },
  { id: "story_25", title: "25 Stories", description: "Create 25 stories", icon: "📂", category: "story", target: 25 },
  { id: "story_50", title: "50 Stories", description: "Create 50 stories", icon: "✍️", category: "story", target: 50 },
  { id: "story_100", title: "100 Stories", description: "Create 100 stories", icon: "🖋️", category: "story", target: 100 },

  // Word Count Achievements
  { id: "words_1000", title: "1,000 Words", description: "Write a total of 1,000 words", icon: "🌱", category: "word_count", target: 1000 },
  { id: "words_10000", title: "10,000 Words", description: "Write a total of 10,000 words", icon: "🌿", category: "word_count", target: 10000 },
  { id: "words_50000", title: "50,000 Words", description: "Write a total of 50,000 words", icon: "🌲", category: "word_count", target: 50000 },
  { id: "words_100000", title: "100,000 Words", description: "Write a total of 100,000 words", icon: "🌳", category: "word_count", target: 100000 },

  // Productivity Achievements
  { id: "productivity_7", title: "7 Active Days", description: "Write on 7 different days", icon: "📅", category: "productivity", target: 7 },
  { id: "productivity_30", title: "30 Active Days", description: "Write on 30 different days", icon: "📆", category: "productivity", target: 30 },
  { id: "productivity_100", title: "100 Active Days", description: "Write on 100 different days", icon: "🗓️", category: "productivity", target: 100 },
];
