export interface WritingGoal {
  target: number;
  current: number;
}

export const getGoal = (): WritingGoal => {
  if (typeof window === "undefined") {
    return { target: 1000, current: 0 };
  }
  try {
    const goal = localStorage.getItem("writing-goal");
    if (!goal) {
      return { target: 1000, current: 0 };
    }
    return JSON.parse(goal) as WritingGoal;
  } catch {
    return { target: 1000, current: 0 };
  }
};

export const saveGoal = (goal: WritingGoal) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "writing-goal",
      JSON.stringify(goal)
    );
  } catch {
    // Ignore storage write errors
  }
};

export const calculateProgress = (
  current: number,
  target: number
) => {
  if (target === 0) return 0;
  return Math.min(
    Math.round((current / target) * 100),
    100
  );
};