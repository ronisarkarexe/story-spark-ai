export interface StoryInfo {
  title: string;
  genre: string;
  theme: string;
  characters: string[];
}

export interface CoverImage {
  id: number;
  image: string;
}

export const generatePrompt = (story: StoryInfo) => {
  return `${story.title}, ${story.genre}, ${story.theme}, ${story.characters.join(", ")}`;
};

export const generateCoverOptions = (
  story: StoryInfo
): CoverImage[] => {
  return [
    { id: 1, image: "/covers/cover1.png" },
    { id: 2, image: "/covers/cover2.png" },
    { id: 3, image: "/covers/cover3.png" },
    { id: 4, image: "/covers/cover4.png" },
  ];
};