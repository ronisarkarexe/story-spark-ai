import { useEffect, useState } from "react";
import { generateRevisionPlan } from "../utils/revisionPlanner";
import type { RevisionTask } from "../types/revision";

export function useRevisionPlanner(story: string) {
  const [tasks, setTasks] = useState<RevisionTask[]>([]);

  useEffect(() => {
    setTasks(generateRevisionPlan(story));
  }, [story]);

  return {
    tasks,
    setTasks,
  };
}
