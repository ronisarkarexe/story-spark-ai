export interface StoryPrompt {
  id: number;
  title: string;
  prompt: string;
  genre: string;
  theme: string;
  mood: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const storyPrompts: StoryPrompt[] = [
  {
    id: 1,
    title: "The Lost Kingdom",
    prompt: "A forgotten kingdom suddenly reappears after 500 years.",
    genre: "Fantasy",
    theme: "Adventure",
    mood: "Mysterious",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "AI Takes Control",
    prompt: "An AI assistant becomes humanity's only hope.",
    genre: "Sci-Fi",
    theme: "Technology",
    mood: "Suspenseful",
    difficulty: "Hard",
  },
  {
    id: 3,
    title: "Hidden Letter",
    prompt: "A child finds a mysterious letter hidden inside an old book.",
    genre: "Drama",
    theme: "Family",
    mood: "Emotional",
    difficulty: "Easy",
  },
];

export function searchPrompts(
  keyword: string,
  prompts = storyPrompts
) {
  return prompts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
    item.genre.toLowerCase().includes(keyword.toLowerCase()) ||
    item.theme.toLowerCase().includes(keyword.toLowerCase()) ||
    item.mood.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function filterByGenre(
  genre: string,
  prompts = storyPrompts
) {
  if (!genre) return prompts;
  return prompts.filter((item) => item.genre === genre);
}