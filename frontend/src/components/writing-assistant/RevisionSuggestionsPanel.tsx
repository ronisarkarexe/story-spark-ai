import React from "react";
import { ISuggestion } from "../../redux/apis/analysis.api";

interface RevisionSuggestionsPanelProps {
  suggestions: ISuggestion[];
  onApply: (suggestion: ISuggestion) => void;
  onDismiss: (suggestionId: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const CATEGORY_STYLES: Record<
  ISuggestion["category"],
  { bg: string; text: string; border: string; icon: string }
> = {
  Style: {
    bg: "bg-purple-500/10 dark:bg-purple-400/10",
    text: "text-purple-600 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-900/50",
    icon: "fa-solid fa-wand-magic-sparkles",
  },
  Readability: {
    bg: "bg-blue-500/10 dark:bg-blue-400/10",
    text: "text-blue-600 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/50",
    icon: "fa-solid fa-book-open",
  },
  Vocabulary: {
    bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    text: "text-emerald-600 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/50",
    icon: "fa-solid fa-language",
  },
  Dialogue: {
    bg: "bg-amber-500/10 dark:bg-amber-400/10",
    text: "text-amber-600 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/50",
    icon: "fa-solid fa-comments",
  },
  Pacing: {
    bg: "bg-rose-500/10 dark:bg-rose-400/10",
    text: "text-rose-600 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-900/50",
    icon: "fa-solid fa-gauge-high",
  },
};

export const RevisionSuggestionsPanel: React.FC<RevisionSuggestionsPanelProps> = ({
  suggestions,
  onApply,
  onDismiss,
  isLoading,
  isError,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
          <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-center">
        <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-3">
          Failed to load writing suggestions.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-white/5 rounded-2xl text-center select-none">
        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fa-solid fa-circle-check text-slate-400 dark:text-slate-500 text-lg" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
          Your story is in great shape!
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          No revision suggestions found. The structure, pacing, and vocabulary look solid.
        </p>
      </div>
    );
  }

  // Group by category
  const categories: Record<ISuggestion["category"], ISuggestion[]> = {
    Style: [],
    Readability: [],
    Vocabulary: [],
    Dialogue: [],
    Pacing: [],
  };

  suggestions.forEach((s) => {
    categories[s.category].push(s);
  });

  return (
    <div className="space-y-6 w-full box-border">
      <div className="flex items-center gap-2 mb-2 select-none">
        <i className="fa-solid fa-wand-magic-sparkles text-indigo-500" />
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Story Revision Suggestions
        </h3>
      </div>

      <div className="space-y-4">
        {(Object.keys(categories) as Array<ISuggestion["category"]>).map((catKey) => {
          const catSuggestions = categories[catKey];
          if (catSuggestions.length === 0) return null;
          const catStyle = CATEGORY_STYLES[catKey];

          return (
            <div key={catKey} className="space-y-3">
              <div className="flex items-center gap-2 px-1 py-0.5 select-none">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${catStyle.bg} ${catStyle.text} text-xs`}>
                  <i className={catStyle.icon} />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {catKey} ({catSuggestions.length})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {catSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-white/20"
                  >
                    <div className="flex-1 space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {suggestion.title}
                      </h4>
                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {suggestion.description}
                      </p>

                      {suggestion.originalText && suggestion.suggestedText && (
                        <div className="mt-2 text-[10px] rounded-lg overflow-hidden border border-slate-100 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5 select-none font-mono">
                          <div className="p-2 bg-red-500/5 text-red-500 dark:text-red-400 flex items-start gap-1">
                            <span className="font-bold">-</span>
                            <span className="truncate">{suggestion.originalText}</span>
                          </div>
                          <div className="p-2 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-start gap-1">
                            <span className="font-bold">+</span>
                            <span className="truncate">{suggestion.suggestedText}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 select-none">
                      {suggestion.suggestedText && (
                        <button
                          onClick={() => onApply(suggestion)}
                          className="flex-1 md:w-20 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm shadow-blue-500/10"
                        >
                          Apply
                        </button>
                      )}
                      <button
                        onClick={() => onDismiss(suggestion.id)}
                        className="flex-1 md:w-20 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 border border-slate-200/60 dark:border-transparent"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
