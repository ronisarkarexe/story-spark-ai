export interface StoryMetadata {
  title: string;
  subtitle: string;
  description: string;
  genre: string;
  themes: string;
  audience: string;
  keywords: string;
  readingTime: string;
  tags: string;
}

export const defaultMetadata: StoryMetadata = {
  title: "",
  subtitle: "",
  description: "",
  genre: "",
  themes: "",
  audience: "",
  keywords: "",
  readingTime: "",
  tags: "",
};

export function validateMetadata(data: StoryMetadata) {
  return {
    valid:
      data.title.trim() !== "" &&
      data.description.trim() !== "" &&
      data.genre.trim() !== "",
  };
}