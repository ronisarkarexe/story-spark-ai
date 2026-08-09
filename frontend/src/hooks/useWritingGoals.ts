import { useEffect, useState } from "react";
import {
  getGoal,
  saveGoal,
  calculateProgress,
} from "../utils/writingGoals";

export default function useWritingGoals() {
  const [goal, setGoal] = useState(getGoal());

  useEffect(() => {
    saveGoal(goal);
  }, [goal]);

  const updateCurrent = (words: number) => {
    setGoal((prev) => ({
      ...prev,
      current: words,
    }));
  };

  const updateTarget = (target: number) => {
    setGoal((prev) => ({
      ...prev,
      target,
    }));
  };

  return {
    goal,
    updateCurrent,
    updateTarget,
    progress: calculateProgress(
      goal.current,
      goal.target
    ),
  };
}