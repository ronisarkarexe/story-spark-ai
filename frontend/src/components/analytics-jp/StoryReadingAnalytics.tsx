import { useMemo } from "react";
import { generateStoryAnalytics } from "../../utils/storyReadingAnalytics";

interface Props {
  story: string;
}

export default function StoryReadingAnalytics({
  story,
}: Props) {
  const analytics = useMemo(
    () => generateStoryAnalytics(story),
    [story]
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📊 Story Reading Analytics
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">Views</p>
          <h3 className="text-3xl font-bold text-white">
            {analytics.totalViews}
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">Completion</p>
          <h3 className="text-3xl font-bold text-green-400">
            {analytics.completionRate}%
          </h3>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <p className="text-gray-400">Reading Time</p>
          <h3 className="text-3xl font-bold text-indigo-400">
            {analytics.averageReadingTime} min
          </h3>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="rounded-lg border border-zinc-700 p-4">
          ❤️ Likes: {analytics.likes}
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          🔖 Bookmarks: {analytics.bookmarks}
        </div>

        <div className="rounded-lg border border-zinc-700 p-4">
          📤 Shares: {analytics.shares}
        </div>

      </div>

      <div>

        <h3 className="text-lg font-semibold text-white mb-4">
          Engagement Trend
        </h3>

        <div className="flex items-end gap-2 h-36">
          {analytics.engagementTrend.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t bg-indigo-500"
              style={{ height: `${value}%` }}
              title={`${value}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}