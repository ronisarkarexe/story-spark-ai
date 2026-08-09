import { useMemo } from "react";
import {
  detectStoryMilestones,
} from "../../utils/storyMilestoneNavigator";

interface Props {
  story: string;
  onNavigate: (milestone: string) => void;
  onRefresh: () => void;
}

export default function StoryMilestoneNavigator({
  story,
  onNavigate,
  onRefresh,
}: Props) {

  const milestones = useMemo(
    () => detectStoryMilestones(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          🧭 Story Milestone Navigator
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="space-y-4">

        {milestones.map((item) => (

          <button
            key={item.id}
            onClick={() => onNavigate(item.title)}
            className="w-full rounded-lg border border-zinc-700 p-4 text-left hover:border-indigo-500"
          >

            <h3 className="font-semibold text-white">
              {item.title}
            </h3>

            <p className="text-indigo-400 text-sm">
              {item.chapter}
            </p>

            <p className="text-gray-400 mt-2">
              {item.preview}
            </p>

          </button>

        ))}

      </div>

    </div>
  );
}