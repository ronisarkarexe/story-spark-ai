import { useMemo } from "react";
import { calculateWritingMilestones } from "../../utils/writingMilestone";

interface Props {
  story: string;
  chapters: number;
}

export default function WritingMilestoneDashboard({
  story,
  chapters,
}: Props) {

  const stats = useMemo(
    () => calculateWritingMilestones(story, chapters),
    [story, chapters]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        📈 Story Writing Milestone Dashboard
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-sm text-gray-400">
            Words Written
          </p>

          <h3 className="mt-2 text-3xl font-bold text-indigo-400">
            {stats.totalWords}
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-sm text-gray-400">
            Chapters Completed
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {stats.completedChapters}/{stats.totalChapters}
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">

          <p className="text-sm text-gray-400">
            Story Completion
          </p>

          <div className="mt-3 h-3 rounded bg-zinc-700">

            <div
              className="h-3 rounded bg-blue-500"
              style={{
                width: `${stats.completionPercentage}%`,
              }}
            />

          </div>

          <p className="mt-2 text-white">
            {stats.completionPercentage}%
          </p>

        </div>

        <div className="rounded-lg bg-zinc-800 p-4">

          <p className="text-sm text-gray-400">
            Editing Progress
          </p>

          <div className="mt-3 h-3 rounded bg-zinc-700">

            <div
              className="h-3 rounded bg-emerald-500"
              style={{
                width: `${stats.editingProgress}%`,
              }}
            />

          </div>

          <p className="mt-2 text-white">
            {stats.editingProgress}%
          </p>

        </div>

      </div>

    </div>
  );
}