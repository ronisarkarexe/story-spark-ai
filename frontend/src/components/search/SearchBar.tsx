import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { searchApi, type SearchResults } from "../../services/searchApi";
import { ResultDropdown } from "./ResultDropdown";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false); // mobile expand toggle
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    searchApi({ q: debouncedQuery, type: "all", limit: 5 })
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setOpen(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults(null);
    setExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  return (
    <>
      {/* Mobile: icon-only toggle */}
      <button
        type="button"
        aria-label="Open search"
        onClick={() => {
          setExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 text-slate-600 shadow-sm transition-all hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 sm:hidden"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Desktop (always visible) + Mobile expanded overlay */}
      <div
        ref={containerRef}
        className={`
          relative transition-all duration-300
          ${expanded
            ? "fixed inset-x-4 top-3 z-[60] sm:static sm:inset-auto sm:z-auto"
            : "hidden sm:block"
          }
        `}
      >
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setOpen(true)}
            placeholder="Search stories, authors, tags…"
            aria-label="Search"
            className="h-10 w-64 rounded-full border border-slate-200/80 bg-white/60 pl-9 pr-9 text-sm font-medium text-slate-700 shadow-sm placeholder:text-slate-400 transition-all duration-300 focus:w-80 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500/50"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClose}
              className="absolute right-3 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {open && (
          <ResultDropdown
            results={results}
            loading={loading}
            error={error}
            query={debouncedQuery}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
};
