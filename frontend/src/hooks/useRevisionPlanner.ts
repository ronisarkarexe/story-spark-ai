import { useEffect, useState } from "react";
import { generateRevisionPlan } from "../utils/revisionPlanner";

export function useRevisionPlanner(story: string) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(generateRevisionPlan(story));
  }, [story]);

  return {
    tasks,
    setTasks,
  };
}