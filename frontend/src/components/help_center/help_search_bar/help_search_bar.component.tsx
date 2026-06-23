import { FC, FormEvent, useEffect, useRef, useState } from "react";

interface HelpSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  /** Optional handler invoked when the user explicitly submits a search (press Enter or clicks a chip) */
  onSearch?: (value: string) => void;
}

const HelpSearchBar: FC<HelpSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search help articles, FAQs, and troubleshooting...",
  resultCount,
  onSearch,
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const STORAGE_KEY = "recent_help_searches";
  const MAX_ITEMS = 10;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (items: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  };

  const addRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const existing = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...existing].slice(0, MAX_ITEMS);
    setRecentSearches(next);
    persist(next);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange(trimmed);
    addRecent(trimmed);
    onSearch?.(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      onChange(trimmed);
      addRecent(trimmed);
      onSearch?.(trimmed);
    }
  };

  const handleChipClick = (term: string) => {
    onChange(term);
    addRecent(term);
    onSearch?.(term);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto px-4 sm:px-0 box-border">
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
          className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/10 dark:text-slate-100 dark:placeholder-slate-500 rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 box-border appearance-none [&::-webkit-search-cancel-button]:hidden"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <i className="fas fa-times text-sm sm:text-base" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {value && resultCount !== undefined && (
        <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center font-medium tracking-wide" aria-live="polite">
          {resultCount === 0
            ? "No results found — try filtering by different keywords"
            : `${resultCount} result${resultCount === 1 ? "" : "s"} uncovered inside ecosystem guides`}
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