import { RevisionTask } from "../../types/revision";

interface Props {
  task: RevisionTask;
  onToggle: (id: number) => void;
}

export default function RevisionTaskCard({
  task,
  onToggle,
}: Props) {
  return (
    <div className="border rounded-lg p-4 mb-3">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          {task.title}
        </h3>

        <span className="text-sm">
          {task.priority}
        </span>

      </div>

      <p className="mt-2">
        {task.description}
      </p>

      <button
        className="mt-4 px-3 py-1 rounded bg-blue-600 text-white"
        onClick={() => onToggle(task.id)}
      >
        {task.completed
          ? "Completed"
          : "Mark Complete"}
      </button>

    </div>
  );
}