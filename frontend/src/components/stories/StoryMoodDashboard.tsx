import React from "react";
import { analyzeStoryEmotion } from "./stories.utils";

interface StoryMoodDashboardProps {
  content: string;
}

const emotionColors: Record<string, string> = {
  Happy: "bg-green-500",
  Sad: "bg-blue-500",
  Suspense: "bg-purple-500",
  Excitement: "bg-red-500",
};

const emotionIcons: Record<string, string> = {
  Happy: "😊",
  Sad: "😢",
  Suspense: "😨",
  Excitement: "🔥",
};

const StoryMoodDashboard: React.FC<StoryMoodDashboardProps> = ({
  content,
}) => {
  const analysis = analyzeStoryEmotion(content);

  return (
    <div className="mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 shadow-md">
      
      {/* Header */}
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
        🎭 Story Mood & Emotion Analysis
      </h2>

      {/* Dominant Emotion */}
      <div className="mb-5 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Dominant Emotion
        </p>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          {emotionIcons[analysis.dominantEmotion]}{" "}
          {analysis.dominantEmotion}
        </h3>
      </div>

      {/* Emotion Distribution */}
      <div className="space-y-4">
        {Object.entries(analysis.scores).map(([emotion, value]) => (
          <div key={emotion}>
            
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {emotionIcons[emotion]} {emotion}
              </span>

              <span className="text-sm text-slate-500">
                {value}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  emotionColors[emotion]
                } transition-all duration-700`}
                style={{
                  width: `${value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-5 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          This story has a strong <b>{analysis.dominantEmotion}</b> emotional
          tone based on the detected keywords.
        </p>
      </div>
    </div>
  );
};

export default StoryMoodDashboard;