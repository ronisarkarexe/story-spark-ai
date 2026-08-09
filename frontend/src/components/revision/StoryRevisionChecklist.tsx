import { useState } from "react";
import {
  generateRevisionChecklist,
  completedCount,
  remainingCount,
} from "../../utils/storyRevisionChecklist";

export default function StoryRevisionChecklist() {
  const [items, setItems] = useState(generateRevisionChecklist());

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const rerunChecklist = () => {
    setItems(generateRevisionChecklist());
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        ✅ Story Revision Checklist
      </h2>

      <div className="mb-6 text-gray-300">
        Completed: {completedCount(items)} / {items.length}
        <br />
        Remaining: {remainingCount(items)}
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-zinc-700 p-4 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="mt-1"
            />

            <div>
              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {item.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={rerunChecklist}
        className="mt-6 px-5 py-2 rounded-lg bg-indigo-600 text-white"
      >
        Rerun Checklist
      </button>

    </div>
  );
}