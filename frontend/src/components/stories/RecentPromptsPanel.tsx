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

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -top-12 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
        title={text.recentPrompts}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {text.recentPrompts}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-80 bg-slate-800 border-l border-slate-700/50 shadow-2xl z-40 overflow-hidden flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {text.recentPrompts}
            </h3>
            <button
              type="button"
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition-colors"
              title={text.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {recentPrompts.length > 0 ? (
              recentPrompts.map((item) => (
                <div key={item.id} className="group">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      onToggle();
                    }}
                    className="w-full text-left p-3 bg-slate-700/50 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition-colors duration-150 text-sm leading-relaxed break-words border border-slate-600/30 group-hover:border-indigo-500/50"
                  >
                    {item.prompt}
                  </button>
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(item.prompt);
                        onToggle();
                      }}
                      className="flex-1 px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs rounded transition-colors duration-150 flex items-center justify-center gap-1"
                      title={text.usePrompt}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM2 10a1 1 0 011 1h1a1 1 0 110-2H3a1 1 0 00-1 1zM5.757 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707z" />
                      </svg>
                      {text.usePrompt}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="px-2 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs rounded transition-colors duration-150"
                      title={text.delete}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Delete confirmation */}
                  {showDeleteConfirm === item.id && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-300">
                      <p className="mb-2">Sure?</p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onRemovePrompt(item.id);
                            setShowDeleteConfirm(null);
                          }}
                          className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded transition-colors"
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
                <p className="text-center text-gray-500 text-sm">{text.noRecentPrompts}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentPrompts.length > 0 && (
            <div className="p-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to clear all recent prompts?")
                  ) {
                    onClearAll();
                  }
                }}
                className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs rounded transition-colors duration-150 font-medium"
              >
                {text.clearAll}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default RecentPromptsPanel;
