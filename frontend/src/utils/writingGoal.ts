export type GoalType = "daily" | "weekly";

export interface WritingGoal {
  goalType: GoalType;
  targetWords: number;
  targetStories: number;
  targetPrompts: number;

  wordsWritten: number;
  storiesWritten: number;
  promptsCompleted: number;
}

export const calculateWordProgress = (
  current: number,
  target: number
) => {
  if (!target || target <= 0 || isNaN(target)) return 0;
  const safeCurrent = Math.max(0, isNaN(current) ? 0 : current);
  return Math.min((safeCurrent / target) * 100, 100);
};

export const calculateStoryProgress = (
  current: number,
  target: number
) => {
  if (!target || target <= 0 || isNaN(target)) return 0;
  const safeCurrent = Math.max(0, isNaN(current) ? 0 : current);
  return Math.min((safeCurrent / target) * 100, 100);
};

export const calculatePromptProgress = (
  current: number,
  target: number
) => {
  if (!target || target <= 0 || isNaN(target)) return 0;
  const safeCurrent = Math.max(0, isNaN(current) ? 0 : current);
  return Math.min((safeCurrent / target) * 100, 100);
};

export const isGoalCompleted = (
  current: number,
  target: number
) => {
  return current >= target;
};

export const getRemainingWords = (
  current: number,
  target: number
) => {
  return Math.max(target - current, 0);
};

export const getRemainingStories = (
  current: number,
  target: number
) => {
  return Math.max(target - current, 0);
};

export const getRemainingPrompts = (
  current: number,
  target: number
) => {
  return Math.max(target - current, 0);
};

export const getProgressColor = (progress: number) => {
  if (progress >= 100) return "green";
  if (progress >= 70) return "blue";
  if (progress >= 40) return "yellow";
  return "red";
};

export const resetGoal = (
  goal: WritingGoal
): WritingGoal => ({
  ...goal,
  wordsWritten: 0,
  storiesWritten: 0,
  promptsCompleted: 0,
});