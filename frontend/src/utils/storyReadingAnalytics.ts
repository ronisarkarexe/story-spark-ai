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

  // For empty/whitespace-only input there is no story to analyse; return a
  // zeroed report instead of fabricated engagement stats and a reading time
  // of 1 (caused by the Math.max(1, ...) floor).
  if (words === 0) {
    return {
      totalViews: 0,
      averageReadingTime: 0,
      completionRate: 0,
      likes: 0,
      bookmarks: 0,
      shares: 0,
      engagementTrend: [],
    };
  }

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