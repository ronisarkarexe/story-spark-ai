import useWritingGoals from "../../hooks/useWritingGoals";

export default function WritingGoalPlanner() {
  const {
    goal,
    updateCurrent,
    updateTarget,
    progress,
  } = useWritingGoals();

  return (
    <div className="p-5 rounded-lg border shadow">

      <h2 className="text-xl font-bold mb-4">
        Writing Goal Planner
      </h2>

      <label className="block mb-2">
        Target Words
      </label>

      <input
        type="number"
        value={goal.target}
        onChange={(e) =>
          updateTarget(Number(e.target.value))
        }
        className="border rounded p-2 w-full"
      />

      <label className="block mt-4 mb-2">
        Current Words
      </label>

      <input
        type="number"
        value={goal.current}
        onChange={(e) =>
          updateCurrent(Number(e.target.value))
        }
        className="border rounded p-2 w-full"
      />

      <div className="mt-5">

        <div className="w-full h-4 bg-gray-200 rounded">

          <div
            className="h-4 bg-green-600 rounded"
            style={{ width: `${progress}%` }}
          />

        </div>

        <p className="mt-2">
          Progress: {progress}%
        </p>

        {progress >= 100 && (
          <div className="mt-3 text-green-600 font-semibold">
            🎉 Milestone Achieved!
          </div>
        )}

      </div>

    </div>
  );
}