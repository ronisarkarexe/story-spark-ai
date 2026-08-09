import { useEffect, useState } from "react";
import {
  calculateEditingSession,
  getSessionHistory,
  saveSessionHistory,
} from "../../utils/storyEditingSessionStatistics";

interface Props {
  story: string;
}

export default function StoryEditingSessionStatistics({
  story,
}: Props) {

  const [stats, setStats] = useState({
    wordsAdded: 0,
    wordsRemoved: 0,
    paragraphsModified: 0,
    editingDuration: 0,
    totalRevisions: 0,
  });

  const [history, setHistory] = useState(
    getSessionHistory()
  );

  const [startTime] = useState(Date.now());
  const [previousStory, setPreviousStory] = useState("");

  useEffect(() => {
    const report = calculateEditingSession(
      previousStory,
      story,
      startTime
    );

    setStats(report);
    setPreviousStory(story);
  }, [story]);

  const resetSession = () => {
    setStats({
      wordsAdded: 0,
      wordsRemoved: 0,
      paragraphsModified: 0,
      editingDuration: 0,
      totalRevisions: 0,
    });
  };

  const saveSession = () => {
    const updated = [
      ...history,
      {
        id: Date.now(),
        date: new Date().toLocaleString(),
        duration: stats.editingDuration,
        revisions: stats.totalRevisions,
      },
    ];

    setHistory(updated);
    saveSessionHistory(updated);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          📊 Editing Session Statistics
        </h2>

        <div className="flex gap-3">

          <button
            onClick={saveSession}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Save Session
          </button>

          <button
            onClick={resetSession}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Reset
          </button>

        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-5">

        <StatCard title="Words Added" value={stats.wordsAdded} />
        <StatCard title="Words Removed" value={stats.wordsRemoved} />
        <StatCard title="Paragraphs" value={stats.paragraphsModified} />
        <StatCard title="Minutes" value={stats.editingDuration} />
        <StatCard title="Revisions" value={stats.totalRevisions} />

      </div>

      <div className="mt-8">

        <h3 className="mb-4 text-lg font-semibold text-white">
          Session History
        </h3>

        <div className="space-y-3">

          {history.map((session) => (

            <div
              key={session.id}
              className="rounded border border-zinc-700 p-4"
            >
              <p>{session.date}</p>
              <p>{session.duration} min</p>
              <p>{session.revisions} revision(s)</p>
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-700 p-4 text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-indigo-400">
        {value}
      </p>
    </div>
  );
}