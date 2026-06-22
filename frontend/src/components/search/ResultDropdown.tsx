import { Link } from "react-router-dom";
import type { SearchResults } from "../../services/searchApi";

interface Props {
  results: SearchResults | null;
  loading: boolean;
  error: boolean;
  query: string;
  onClose: () => void;
}

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const ResultDropdown: React.FC<Props> = ({
  results,
  loading,
  error,
  query,
  onClose,
}) => {
  if (!query) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
      {loading && (
        <div className="space-y-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="p-4 text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      {!loading && !error && results && (
        <>
          {/* Stories */}
          {results.stories && results.stories.data.length > 0 && (
            <section className="border-b border-slate-100 dark:border-white/5 p-3">
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Stories
              </p>
              {results.stories.data.slice(0, 4).map((story) => (
                <Link
                  key={story._id}
                  to={`/post/${story._id}`}
                  onClick={onClose}
                  className="flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    📖
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {highlight(story.title, query)}
                    </p>
                    {story.author && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        by {story.author.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </section>
          )}

          {/* Authors */}
          {results.users && results.users.data.length > 0 && (
            <section className="border-b border-slate-100 dark:border-white/5 p-3">
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Authors
              </p>
              {results.users.data.slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    👤
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {highlight(user.name, query)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Tags */}
          {results.tags && results.tags.data.length > 0 && (
            <section className="p-3">
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Tags
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {results.tags.data.slice(0, 6).map((t) => (
                  <Link
                    key={t.tag}
                    to={`/search?q=${encodeURIComponent(t.tag)}&type=tag`}
                    onClick={onClose}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    #{highlight(t.tag, query)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No results */}
          {!results.stories?.data.length &&
            !results.users?.data.length &&
            !results.tags?.data.length && (
              <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No results found for <strong>"{query}"</strong>
              </p>
            )}

          {/* View all */}
          <div className="border-t border-slate-100 dark:border-white/5 p-2">
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
            >
              View all results for "{query}" →
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
