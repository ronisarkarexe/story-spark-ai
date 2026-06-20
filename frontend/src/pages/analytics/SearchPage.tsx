import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { searchApi, type SearchResults, type StoryResult, type UserResult } from "../../services/searchApi";

const GENRES = ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Thriller", "Horror", "Adventure", "Drama"];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState<"all" | "story" | "user" | "tag">(
    (searchParams.get("type") as "all") ?? "all"
  );
  const [genre, setGenre] = useState(searchParams.get("genre") ?? "");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "popularity">(
    (searchParams.get("sortBy") as "relevance") ?? "relevance"
  );
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Sync URL params
  useEffect(() => {
    const p: Record<string, string> = {};
    if (debouncedQuery) p.q = debouncedQuery;
    if (type !== "all") p.type = type;
    if (genre) p.genre = genre;
    if (sortBy !== "relevance") p.sortBy = sortBy;
    if (page > 1) p.page = String(page);
    setSearchParams(p, { replace: true });
  }, [debouncedQuery, type, genre, sortBy, page]);

  // Fetch on param change
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults(null); return; }
    let cancelled = false;
    setLoading(true);
    setError(false);

    searchApi({ q: debouncedQuery, type, genre, sortBy, page, limit: 10 })
      .then((data) => { if (!cancelled) { setResults(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });

    return () => { cancelled = true; };
  }, [debouncedQuery, type, genre, sortBy, page]);

  const resetPage = () => setPage(1);

  const totalStories = results?.stories?.total ?? 0;
  const totalUsers = results?.users?.total ?? 0;
  const totalPages = Math.ceil(
    type === "user" ? totalUsers / 10 : totalStories / 10
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">Search</h1>

      {/* Search input */}
      <div className="relative mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetPage(); }}
            placeholder="Search stories, authors, tags…"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-all ${
            showFilters
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300"
              : "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-300"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        {showFilters && (
          <aside className="w-56 shrink-0 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-800/60">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Type</p>
              {(["all", "story", "user", "tag"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); resetPage(); }}
                  className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    type === t
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {(type === "all" || type === "story") && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Genre</p>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setGenre(genre === g ? "" : g); resetPage(); }}
                    className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      genre === g
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                    }`}
                  >
                    {g}
                    {genre === g && <X className="ml-auto h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Sort by</p>
              {(["relevance", "date", "popularity"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setSortBy(s); resetPage(); }}
                  className={`mb-1 flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    sortBy === s
                      ? "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 space-y-4">
          {!debouncedQuery && (
            <p className="py-16 text-center text-slate-400">Start typing to search…</p>
          )}

          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          {!loading && !error && results && (
            <>
              {/* Stories */}
              {(type === "all" || type === "story") && results.stories && (
                <section>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Stories ({results.stories.total})
                  </p>
                  {results.stories.data.map((story: StoryResult) => (
                    <a
                      key={story._id}
                      href={`/post/${story._id}`}
                      className="mb-3 flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-800/60"
                    >
                      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-xl dark:bg-indigo-500/10">
                        📖
                      </div>
                      <div className="min-w-0">
                        <p className="mb-0.5 font-semibold text-slate-800 dark:text-white">{story.title}</p>
                        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {story.content?.slice(0, 120)}…
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          {story.author && <span>by {story.author.name}</span>}
                          {story.genre && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-white/10">{story.genre}</span>
                          )}
                          <span>❤️ {story.likesCount}</span>
                          <span>👁️ {story.viewsCount}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                  {results.stories.data.length === 0 && (
                    <p className="text-sm text-slate-500">No stories found.</p>
                  )}
                </section>
              )}

              {/* Users */}
              {(type === "all" || type === "user") && results.users && (
                <section className="mt-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Authors ({results.users.total})
                  </p>
                  {results.users.data.map((user: UserResult) => (
                    <div
                      key={user._id}
                      className="mb-3 flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-800/60"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-50 text-xl dark:bg-violet-500/10">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{user.name}</p>
                        {user.profile?.bio && (
                          <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{user.profile.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Tags */}
              {(type === "all" || type === "tag") && results.tags && results.tags.data.length > 0 && (
                <section className="mt-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Tags ({results.tags.total})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.tags.data.map((t) => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => { setQuery(t.tag); setType("tag"); resetPage(); }}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                      >
                        #{t.tag}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {!results.stories?.data.length &&
                !results.users?.data.length &&
                !results.tags?.data.length && (
                  <div className="py-16 text-center">
                    <p className="text-2xl">🔍</p>
                    <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">No results for "{debouncedQuery}"</p>
                    <p className="text-sm text-slate-500">Try different keywords or remove filters.</p>
                  </div>
                )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-slate-300"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
