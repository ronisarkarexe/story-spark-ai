export interface RecentStory {
  id: string; // storyId or draft uuid
  title: string;
  imageURL: string;
  tag: string;
  progress: number; // 0 to 100 percentage
  lastScrollPosition: number;
  updatedAt: number;
  isDraft: boolean;
}

const LOCAL_STORAGE_KEY = "story_spark_recently_viewed";
const MAX_RECENT_STORIES = 20;

export const getRecentStories = (): RecentStory[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    const list = JSON.parse(data);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Failed to parse recent stories from localStorage:", error);
    return [];
  }
};

export const saveRecentStory = (story: Omit<RecentStory, "updatedAt">): RecentStory[] => {
  const recentStories = getRecentStories();
  const index = recentStories.findIndex((s) => s.id === story.id);

  const updatedStory: RecentStory = {
    ...story,
    updatedAt: Date.now(),
  };

  if (index > -1) {
    // Remove the old one so we can place the updated one at the beginning
    recentStories.splice(index, 1);
  }

  recentStories.unshift(updatedStory);

  // Limit the size of the list
  if (recentStories.length > MAX_RECENT_STORIES) {
    recentStories.pop();
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentStories));
    // Trigger custom event so other components (like BookmarksComponent) can update in real-time
    window.dispatchEvent(new Event("recent_stories_changed"));
  } catch (error) {
    console.error("Failed to save recent story to localStorage:", error);
  }

  return recentStories;
};

export const getRecentStoryProgress = (storyId: string): { progress: number; lastScrollPosition: number } | null => {
  const recentStories = getRecentStories();
  const story = recentStories.find((s) => s.id === storyId);
  if (story) {
    return { progress: story.progress, lastScrollPosition: story.lastScrollPosition };
  }
  return null;
};

export const removeRecentStory = (storyId: string): RecentStory[] => {
  const recentStories = getRecentStories();
  const updatedStories = recentStories.filter((s) => s.id !== storyId);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStories));
    window.dispatchEvent(new Event("recent_stories_changed"));
  } catch (error) {
    console.error("Failed to remove recent story from localStorage:", error);
  }
  return updatedStories;
};
