import React from "react";

interface Props {
  progress: number;
  wordCount: number;
  currentChapter: number;
  totalChapters: number;
  onJumpTop: () => void;
  onJumpEnd: () => void;
}

const FloatingStoryProgressCard: React.FC<Props> = ({
  progress, wordCount, currentChapter, totalChapters, onJumpTop, onJumpEnd,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-40 w-56 rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md shadow-lg p-4 text-zinc-200 max-sm:w-44 max-sm:p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">📖 Story Progress</span>
        <button onClick={() => setCollapsed((c) => !c)} className="text-zinc-400 hover:text-zinc-200 text-xs">
          {collapsed ? "▲" : "▼"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-400">
            <div className="flex justify-between"><span>Progress</span><span className="text-indigo-400 font-medium">{progress}%</span></div>
            <div className="flex justify-between"><span>Words</span><span>{wordCount.toLocaleString()}</span></div>
            {totalChapters > 1 && (
              <div className="flex justify-between"><span>Section</span><span>{currentChapter} / {totalChapters}</span></div>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={onJumpTop} className="flex-1 rounded-md bg-zinc-800 hover:bg-zinc-700 py-1 text-xs">⬆ Top</button>
            <button onClick={onJumpEnd} className="flex-1 rounded-md bg-zinc-800 hover:bg-zinc-700 py-1 text-xs">⬇ End</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingStoryProgressCard;