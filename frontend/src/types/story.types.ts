export interface Chapter {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface StoryVersion {
  id: string;
  timestamp: string;
  title: string;
  chapterCount: number;
  storySnapshot: Story;
}