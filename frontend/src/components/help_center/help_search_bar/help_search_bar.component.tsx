import React, { FC } from "react";

interface HelpSearchBarProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  resultCount?: number;
  /** Optional handler invoked when the user explicitly submits a search (press Enter or clicks a chip) */
  onSearch?: (value: string) => void;
}

const HelpSearchBar: FC<HelpSearchBarProps> = ({ value, onChange, onSubmit, placeholder = "Search help center", resultCount }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <label htmlFor="help-search" className="sr-only">
        Search help center
      </label>

      <div className="relative before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-500/10 before:via-indigo-500/10 before:to-blue-500/10 before:blur-xl before:rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none select-none">
          <i className="fas fa-search text-slate-500 dark:text-gray-400 text-sm sm:text-base" aria-hidden="true"></i>
        </div>

        <input
          ref={inputRef}
          id="help-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/10 dark:text-slate-100 dark:placeholder-slate-500 rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 box-border appearance-none"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {value && resultCount !== undefined && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center" aria-live="polite">
          {resultCount === 0 ? "No results found — try different keywords" : `${resultCount} result${resultCount === 1 ? "" : "s"} found`}
        </p>
      )}

      {/* Recent searches dropdown: show when input is focused and empty */}
      {isFocused && value.trim() === "" && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-40 py-3 px-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Recent searches</h4>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} /* prevent blur */
              onClick={clearRecent}
              className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-400"
            >
              Clear recent searches
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()} /* keep focus */
                onClick={() => handleChipClick(s)}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default HelpSearchBar;
