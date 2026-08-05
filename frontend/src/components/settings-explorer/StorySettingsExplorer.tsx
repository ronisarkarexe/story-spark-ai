import { useMemo } from "react";
import {
  analyzeStorySettings,
} from "../../utils/storySettingsExplorer";

interface Props {
  story: string;
  onRefresh: () => void;
}

export default function StorySettingsExplorer({
  story,
  onRefresh,
}: Props) {

  const settings = useMemo(
    () => analyzeStorySettings(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🗺️ Story Settings Explorer
        </h2>

        <button
          onClick={onRefresh}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Refresh
        </button>

      </div>

      <div className="space-y-5">

        {settings.map((setting) => (

          <div
            key={setting.id}
            className="rounded-lg border border-zinc-700 p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-white">
                {setting.title}
              </h3>

              <span className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                {setting.category}
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              {setting.description}
            </p>

            <p className="mt-3 text-sm text-indigo-400">
              Reference: {setting.reference}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}