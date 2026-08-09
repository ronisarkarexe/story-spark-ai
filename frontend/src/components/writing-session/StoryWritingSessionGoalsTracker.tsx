import { useMemo, useState } from "react";
import {
  calculateSessionProgress,
  getSessionHistory,
  saveSessionHistory,
} from "../../utils/storyWritingSessionGoalsTracker";

interface Props {
  story: string;
}

export default function StoryWritingSessionGoalsTracker({
  story,
}: Props) {

  const [goals, setGoals] = useState({
    targetWords: 1000,
    targetMinutes: 60,
    targetChapters: 5,
  });

  const [startTime] = useState(Date.now());
  const [history, setHistory] = useState(getSessionHistory());

  const progress = useMemo(
    () =>
      calculateSessionProgress(
        story,
        goals,
        startTime
      ),
    [story, goals]
  );

  const saveSession = () => {
    const completed =
      Number(progress.wordProgress >= 100) +
      Number(progress.timeProgress >= 100) +
      Number(progress.chapterProgress >= 100);

    const updated = [
      ...history,
      {
        id: Date.now(),
        date: new Date().toLocaleString(),
        wordsWritten: progress.currentWords,
        duration: progress.currentMinutes,
        completedGoals: completed,
      },
    ];

    setHistory(updated);
    saveSessionHistory(updated);
  };

  const ProgressBar = ({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) => (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>

      <div className="h-3 rounded bg-zinc-700">

        <div
          className="h-3 rounded bg-indigo-500"
          style={{ width: `${value}%` }}
        />

      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          🎯 Writing Session Goals
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">

        <input
          type="number"
          value={goals.targetWords}
          onChange={(e) =>
            setGoals({
              ...goals,
              targetWords: Number(e.target.value),
            })
          }
          placeholder="Target Words"
          className="rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
        />

        <input
          type="number"
          value={goals.targetMinutes}
          onChange={(e) =>
            setGoals({
              ...goals,
              targetMinutes: Number(e.target.value),
            })
          }
          placeholder="Minutes"
          className="rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
        />

        <input
          type="number"
          value={goals.targetChapters}
          onChange={(e) =>
            setGoals({
              ...goals,
              targetChapters: Number(e.target.value),
            })
          }
          placeholder="Chapters"
          className="rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
        />

      </div>

      <div className="space-y-5">

        <ProgressBar
          label="Word Goal"
          value={progress.wordProgress}
        />

        <ProgressBar
          label="Writing Time"
          value={progress.timeProgress}
        />

        <ProgressBar
          label="Chapter Goal"
          value={progress.chapterProgress}
        />

      </div>

      <div className="mt-6 rounded-lg bg-indigo-900/30 p-4 text-center">

        <h3 className="text-lg font-semibold text-white">
          {progress.milestone}
        </h3>

      </div>

      <button
        onClick={saveSession}
        className="mt-6 rounded bg-green-600 px-5 py-2 text-white"
      >
        Save Session
      </button>

      <div className="mt-8">

        <h3 className="mb-3 text-lg font-semibold text-white">
          Session History
        </h3>

        <div className="space-y-3">

          {history.map((item) => (

            <div
              key={item.id}
              className="rounded border border-zinc-700 p-3"
            >
              <p>{item.date}</p>
              <p>Words: {item.wordsWritten}</p>
              <p>Minutes: {item.duration}</p>
              <p>Completed Goals: {item.completedGoals}</p>
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}