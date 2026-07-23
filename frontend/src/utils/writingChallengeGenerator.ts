export interface WritingChallenge {
  id: number;
  title: string;
  prompt: string;
  type: "Daily" | "Weekly";
  genre: string;
  wordLimit: number;
  completed: boolean;
}

export function generateChallenges(): WritingChallenge[] {
  return [
    {
      id: 1,
      title: "Mystery Monday",
      prompt:
        "Write a mystery story where the detective is the real culprit.",
      type: "Daily",
      genre: "Mystery",
      wordLimit: 500,
      completed: false,
    },
    {
      id: 2,
      title: "Fantasy Quest",
      prompt:
        "Create a fantasy adventure with only two named characters.",
      type: "Weekly",
      genre: "Fantasy",
      wordLimit: 1500,
      completed: false,
    },
    {
      id: 3,
      title: "Sci-Fi Twist",
      prompt:
        "Write a science fiction story where time travel creates an unexpected friendship.",
      type: "Daily",
      genre: "Science Fiction",
      wordLimit: 700,
      completed: false,
    },
  ];
}

export function completeChallenge(
  challenges: WritingChallenge[],
  id: number
): WritingChallenge[] {
  return challenges.map((challenge) =>
    challenge.id === id
      ? { ...challenge, completed: true }
      : challenge
  );
}

export function earnedBadges(
  challenges: WritingChallenge[]
): string[] {
  const completed = challenges.filter((c) => c.completed).length;

  if (completed >= 10) return ["🏆 Master Writer"];
  if (completed >= 5) return ["🥇 Writing Champion"];
  if (completed >= 1) return ["✍️ First Challenge Completed"];

  return [];
}