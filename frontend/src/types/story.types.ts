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