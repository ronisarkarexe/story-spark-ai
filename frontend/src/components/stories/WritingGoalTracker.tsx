import React, { useState, useEffect, useRef } from "react";

interface WritingGoalTrackerProps {
  wordCount: number;
}

const WritingGoalTracker: React.FC<WritingGoalTrackerProps> = ({ wordCount }) => {
  const [goalWords, setGoalWords] = useState<number>(200);
  const [isSettingGoal, setIsSettingGoal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("200");
  const [sessionStart] = useState<Date>(new Date());
  const [goalReached, setGoalReached] = useState<boolean>(false);
  const prevWordCount = useRef<number>(0);

  const progress = Math.min(100, Math.round((wordCount / goalWords) * 100));

  // Save stats to localStorage
  useEffect(() => {
    if (wordCount >= goalWords && !goalReached && wordCount > 0) {
      setGoalReached(true);
      const stats = {
        goalWords,
        wordsWritten: wordCount,
        completedAt: new Date().toISOString(),
        sessionStart: sessionStart.toISOString(),
      };
      let existing: unknown[];
      try {
        existing = JSON.parse(
          localStorage.getItem("writingSessionStats") || "[]"
        );
      } catch {
        existing = [];
      }
      localStorage.setItem(
        "writingSessionStats",
        JSON.stringify([...existing, stats])
      );
    }
  }, [wordCount, goalWords, goalReached, sessionStart]);

  // Reset goal reached if word count drops
  useEffect(() => {
    if (wordCount < goalWords && goalReached) {
      setGoalReached(false);
    }
    prevWordCount.current = wordCount;
  }, [wordCount, goalWords, goalReached]);

  const handleSetGoal = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGoalWords(parsed);
      setGoalReached(false);
    }
    setIsSettingGoal(false);
  };

  const progressColor =
    progress >= 100
      ? "bg-green-500"
      : progress >= 80
      ? "bg-yellow-400"
      : "bg-indigo-500";

  return (
    <div className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          🎯 Writing Goal
        </h4>
        <button
          type="button"
          onClick={() => setIsSettingGoal(!isSettingGoal)}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          {isSettingGoal ? "Cancel" : "Set Goal"}
        </button>
      </div>

      {isSettingGoal ? (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-24 px-2 py-1 text-xs bg-slate-900 border border-slate-600 rounded-lg text-white outline-none focus:border-indigo-500"
            placeholder="Words"
            min={1}
          />
          <button
            type="button"
            onClick={handleSetGoal}
            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      ) : null}

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {wordCount} / {goalWords} words
        </span>
        <span>{progress}%</span>
      </div>

      {/* Milestone notifications */}
      {goalReached && (
        <p className="text-[11px] text-green-400 font-semibold mt-2 flex items-center gap-1">
          🎉 Goal reached! Great writing session!
        </p>
      )}
      {!goalReached && progress >= 80 && progress < 100 && (
        <p className="text-[11px] text-yellow-400 mt-2 flex items-center gap-1">
          ⚡ Almost there! Keep going!
        </p>
      )}
    </div>
  );
};

export default WritingGoalTracker;