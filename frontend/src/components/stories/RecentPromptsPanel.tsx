import React, { useState } from "react";
import { IRecentPrompt } from "../../hooks/useRecentPrompts";

interface RecentPromptsPanelProps {
  recentPrompts: IRecentPrompt[];
  onSelectPrompt: (prompt: string) => void;
  onRemovePrompt: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
  text: {
    recentPrompts: string;
    usePrompt: string;
    delete: string;
    clearAll: string;
    noRecentPrompts: string;
    close: string;
  };
}

const RecentPromptsPanel: React.FC<RecentPromptsPanelProps> = ({
  recentPrompts,
  onSelectPrompt,
  onRemovePrompt,
  onClearAll,
  isOpen,
  onToggle,
  text,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPrompts = recentPrompts.filter((item) =>
  item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportPrompts = () => {
  const blob = new Blob(
    [JSON.stringify(recentPrompts, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "recent-prompts.json";
  a.click();

  URL.revokeObjectURL(url);
};
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="absolute -top-12 right-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] select-none cursor-pointer"
        title={text.recentPrompts}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{text.recentPrompts}</span>
      </button>

      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl z-40 overflow-hidden flex flex-col animate-in slide-in-from-right duration-200 text-left box-border">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 select-none w-full box-border">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2 m-0 uppercase">
              <svg
                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{text.recentPrompts}</span>
            </h3>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Close recent prompts"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={text.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 border-b border-slate-700/50">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts..."
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((item) => (
                <div key={item.id} className="group">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      onToggle();
                    }}
                    className="w-full text-left p-0 bg-transparent text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed break-words border-none outline-none cursor-pointer"
                  >
                    {item.prompt}
                    
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(item.prompt);
                        onToggle();
                      }}
                      className="flex-1 h-8 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
                      title={text.usePrompt}
                    >
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM2 10a1 1 0 011 1h1a1 1 0 110-2H3a1 1 0 00-1 1zM5.757 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707z" />
                      </svg>
                      <span>{text.usePrompt}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="w-8 h-8 shrink-0 bg-red-500/5 border border-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      title={text.delete}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {showDeleteConfirm === item.id && (
                    <div className="mt-2.5 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-xs text-red-600 dark:text-red-400 font-semibold w-full box-border">
                      <p className="m-0 mb-2.5 uppercase tracking-wider text-[10px]">Delete this prompt index?</p>
                      <div className="flex gap-2 w-full box-border">
                        <button
                          type="button"
                          onClick={() => {
                            onRemovePrompt(item.id);
                            setShowDeleteConfirm(null);
                          }}
                          className="flex-1 h-8 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-gray-500 text-sm">
                  {searchTerm
                    ? "No prompts match your search."
                    : text.noRecentPrompts}
                </p>
              </div>
            )}
          </div>

          {recentPrompts.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-white/5 select-none w-full box-border">
              <button
                type="button"
                onClick={exportPrompts}
                className="w-full mb-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs rounded transition-colors duration-150 font-medium"
              >
                Export Prompts
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all recent prompts?")) {
                    onClearAll();
                  }
                }}
                className="w-full py-2.5 bg-red-500/5 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white border border-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                {text.clearAll}
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default React.memo(RecentPromptsPanel);