import { useRevisionPlanner } from "../../hooks/useRevisionPlanner";
import RevisionTaskCard from "./RevisionTaskCard";
import type { RevisionTask } from "../../types/revision";

interface RevisionPlannerProps {
  story: string;
}

export default function RevisionPlanner({
  story,
}: RevisionPlannerProps) {
  const { tasks, setTasks } =
    useRevisionPlanner(story);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const grouped = tasks.reduce((acc, task) => {
    acc[task.category] ??= [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, RevisionTask[]>);

  return (
    <div className="border rounded-xl p-5">

      <div className="flex justify-between mb-6">

        <h2 className="text-xl font-bold">
          AI Revision Planner
        </h2>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Reanalyze
        </button>

      </div>

      {Object.entries(grouped).map(
        ([category, list]) => (
          <details key={category} open>

            <summary className="font-semibold mb-3 cursor-pointer">
              {category}
            </summary>

            {list.map((task) => (
              <RevisionTaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))}

          </details>
        )
      )}

    </div>
  );
}
