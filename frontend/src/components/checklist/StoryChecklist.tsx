import React from "react";
import {
  generateChecklist,
  StoryData,
} from "../../utils/storyChecklist";

interface StoryChecklistProps extends StoryData {}

const StoryChecklist: React.FC<StoryChecklistProps> = ({
  title,
  content,
}) => {
  const checklist = generateChecklist({ title, content });

  const completedItems = checklist.filter(
    (item) => item.completed
  ).length;

  const progress = Math.round(
    (completedItems / checklist.length) * 100
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          📝 Story Completion Checklist
        </h2>

        <span className="text-sm font-semibold text-indigo-400">
          {progress}% Complete
        </span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3"
          >
            <span className="text-white">
              {item.label}
            </span>

            {item.completed ? (
              <span className="text-green-400 font-semibold">
                ✅ Complete
              </span>
            ) : (
              <span className="text-red-400 font-semibold">
                ❌ Missing
              </span>
            )}
          </div>
        ))}
      </div>

      {progress === 100 ? (
        <div className="mt-5 rounded-lg bg-green-600/20 border border-green-500 p-3 text-green-300 font-medium">
          🎉 Your story is ready to publish!
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-yellow-500/10 border border-yellow-500 p-3 text-yellow-300 font-medium">
          Complete the missing sections before publishing.
        </div>
      )}
    </div>
  );
};

export default StoryChecklist;