export interface StoryAnalytics {
  totalViews: number;
  averageReadingTime: number;
  completionRate: number;
  likes: number;
  bookmarks: number;
  shares: number;
  engagementTrend: number[];
}

export function generateStoryAnalytics(
  story: string
): StoryAnalytics {
  const words = story.trim().split(/\s+/).filter(Boolean).length;

  return {
    totalViews: 1248,
    averageReadingTime: Math.max(1, Math.ceil(words / 200)),
    completionRate: 87,
    likes: 312,
    bookmarks: 96,
    shares: 41,
    engagementTrend: [22, 30, 38, 45, 58, 67, 81],
  };
}

export function refreshAnalytics(story: string) {
  return generateStoryAnalytics(story);
}