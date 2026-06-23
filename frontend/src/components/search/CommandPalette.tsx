import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Clock, X, ArrowRight } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { searchApi, type SearchResults } from "../../services/searchApi";

const STORAGE_KEY = "storyspark_recent_searches";
const MAX_RECENT = 8;

const getRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveRecent = (q: string) => {
  const prev = getRecent().filter((s) => s !== q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
};

const removeRecent = (q: string) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getRecent().filter((s) => s !== q)));
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  // Refresh recent list when palette opens
  useEffect(() => {
    if (open) {
      setRecent(getRecent());
      setQuery("");
      setResults(null);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchApi({ q: debouncedQuery, type: "all", limit: 5 })
      .then((data) => {
        if (!cancelled) { setResults(data); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    saveRecent(q.trim());
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    onClose();
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "Enter") { handleSubmit(query); return; }
    if (e.key === "ArrowDown") setActiveIdx((i) => i + 1);
    if (e.key === "ArrowUp") setActiveIdx((i) => Math.max(0, i - 1));
  };

  const handleDeleteRecent = (term: string) => {
    removeRecent(term);
    setRecent(getRecent());
  };

  if (!open) return null;

  const allStories = results?.stories?.data ?? [];
  const allUsers = results?.users?.data ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/60 px-4 pt-[10vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-white/10">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search stories, authors, tags…"
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
          />
          <kbd className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400 sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && results && (
            <>
              {allStories.length > 0 && (
                <section className="p-2">
                  <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Stories</p>
                  {allStories.slice(0, 4).map((story) => (
                    <Link
                      key={story._id}
                      to={`/post/${story._id}`}
                      onClick={() => { saveRecent(query); onClose(); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <span className="text-base">📖</span>
                      <span className="truncate font-medium">{story.title}</span>
                      {story.author && (
                        <span className="ml-auto shrink-0 text-xs text-slate-400">{story.author.name}</span>
                      )}
                    </Link>
                  ))}
                </section>
              )}
              {allUsers.length > 0 && (
                <section className="border-t border-slate-100 p-2 dark:border-white/5">
                  <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Authors</p>
                  {allUsers.slice(0, 3).map((user) => (
                    <div key={user._id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200">
                      <span className="text-base">👤</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  ))}
                </section>
              )}
              {!allStories.length && !allUsers.length && (
                <p className="p-6 text-center text-sm text-slate-500">No results for "{query}"</p>
              )}
            </>
          )}

          {/* Recent searches */}
          {!query && recent.length > 0 && (
            <section className="p-2">
              <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Recent</p>
              {recent.map((term) => (
                <div key={term} className="group flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                  <button
                    type="button"
                    className="flex-1 text-left text-sm text-slate-700 dark:text-slate-200"
                    onClick={() => handleSubmit(term)}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => handleDeleteRecent(term)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* Footer: view all */}
          {query.trim() && (
            <div className="border-t border-slate-100 p-2 dark:border-white/5">
              <button
                type="button"
                onClick={() => handleSubmit(query)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
              >
                <ArrowRight className="h-4 w-4" />
                Search all results for "{query}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
