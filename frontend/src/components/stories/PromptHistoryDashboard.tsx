import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRecentPrompt, useRecentPrompts } from "../../hooks/useRecentPrompts";

type SortOption = "recent" | "oldest" | "popular";

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "Unknown date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
};

const normalizeDate = (value: string) => {
  if (!value) return 0;
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const isWithinDateRange = (
  prompt: IRecentPrompt,
  startDate: string,
  endDate: string
) => {
  const promptDate = new Date(prompt.lastUsedAt || prompt.timestamp);
  promptDate.setHours(0, 0, 0, 0);
  const promptTime = promptDate.getTime();
  const startTime = normalizeDate(startDate);
  const endTime = normalizeDate(endDate);

  if (startTime && promptTime < startTime) return false;
  if (endTime && promptTime > endTime) return false;
  return true;
};

const PromptHistoryDashboard = () => {
  const navigate = useNavigate();
  const {
    recentPrompts,
    recordPromptUse,
    toggleFavorite,
    removePrompt,
    clearAll,
  } = useRecentPrompts();

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredPrompts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return [...recentPrompts]
      .filter((prompt) => {
        const matchesSearch =
          !normalizedSearch ||
          prompt.prompt.toLowerCase().includes(normalizedSearch);
        const matchesFavorite = !showFavoritesOnly || prompt.isFavorite;
        return (
          matchesSearch &&
          matchesFavorite &&
          isWithinDateRange(prompt, startDate, endDate)
        );
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          return (b.useCount || 0) - (a.useCount || 0);
        }
        if (sortBy === "oldest") {
          return (a.lastUsedAt || a.timestamp) - (b.lastUsedAt || b.timestamp);
        }
        return (b.lastUsedAt || b.timestamp) - (a.lastUsedAt || a.timestamp);
      });
  }, [endDate, recentPrompts, searchQuery, showFavoritesOnly, sortBy, startDate]);

  const favoritePrompts = useMemo(
    () => recentPrompts.filter((prompt) => prompt.isFavorite),
    [recentPrompts]
  );

  const totalUses = useMemo(
    () =>
      recentPrompts.reduce((total, prompt) => total + (prompt.useCount || 0), 0),
    [recentPrompts]
  );

  const regeneratePrompt = (prompt: IRecentPrompt) => {
    recordPromptUse(prompt.id);
    navigate("/stories", { state: { prompt: prompt.prompt } });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSortBy("recent");
    setShowFavoritesOnly(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-indigo-500">
                Prompt History
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Manage your story prompts
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Search previous prompts, favorite strong ideas, filter by date,
                and regenerate stories from prompts that are worth another pass.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[360px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="block text-2xl font-black text-indigo-500">
                  {recentPrompts.length}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Saved
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="block text-2xl font-black text-amber-500">
                  {favoritePrompts.length}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Favorites
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="block text-2xl font-black text-emerald-500">
                  {totalUses}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Uses
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-slate-900/60 lg:grid-cols-[minmax(0,1fr)_170px_170px_170px_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Search
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search previous prompts"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              From
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              To
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="recent">Most recent</option>
              <option value="popular">Popularity</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((value) => !value)}
              className={`h-11 rounded-xl px-4 text-sm font-bold transition ${
                showFavoritesOnly
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              }`}
            >
              Favorites
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Reset
            </button>
          </div>
        </section>

        {favoritePrompts.length > 0 && !showFavoritesOnly && (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Favorite prompts
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {favoritePrompts.slice(0, 3).map((prompt) => (
                <button
                  type="button"
                  key={prompt.id}
                  onClick={() => regeneratePrompt(prompt)}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-sm leading-6 text-amber-950 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100"
                >
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                    Favorite
                  </span>
                  <span className="line-clamp-3">{prompt.prompt}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Prompt library
            </h2>
            {recentPrompts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all saved prompts?")) {
                    clearAll();
                  }
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>

          {filteredPrompts.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredPrompts.map((prompt) => (
                <article
                  key={prompt.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-indigo-400/40"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Last used {formatDate(prompt.lastUsedAt || prompt.timestamp)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-indigo-500">
                        Used {prompt.useCount || 1} time
                        {(prompt.useCount || 1) === 1 ? "" : "s"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(prompt.id)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                        prompt.isFavorite
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {prompt.isFavorite ? "Favorited" : "Favorite"}
                    </button>
                  </div>

                  <p className="mb-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {prompt.prompt}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => regeneratePrompt(prompt)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
                    >
                      Quick regenerate
                    </button>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(prompt.prompt)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => removePrompt(prompt.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No prompts found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Generate stories to build your history, or adjust the filters to
                find saved prompts.
              </p>
              <button
                type="button"
                onClick={() => navigate("/stories")}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
              >
                Create a story
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PromptHistoryDashboard;
