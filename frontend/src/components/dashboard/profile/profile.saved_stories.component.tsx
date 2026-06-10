import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetMyBookmarksQuery } from "../../../redux/apis/bookmark.api";
import { getSessionBookmarks } from "../../../utils/session-bookmarks";

export const ProfileSavedStoriesSection = () => {
  const { data, isLoading } = useGetMyBookmarksQuery({
    page: 1,
    limit: 1,
  });

  const [sessionCount, setSessionCount] = useState(() => getSessionBookmarks().length);

  useEffect(() => {
    const handleBookmarkChange = () => {
      setSessionCount(getSessionBookmarks().length);
    };
    window.addEventListener("session_bookmarks_changed", handleBookmarkChange);
    return () => {
      window.removeEventListener("session_bookmarks_changed", handleBookmarkChange);
    };
  }, []);

  const totalBookmarkCount = (data?.meta?.total ?? 0) + sessionCount;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Saved Stories</h2>
          <p className="text-indigo-200 mt-1">
            Stories you have bookmarked for later
          </p>
        </div>

        <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
              <i className="fas fa-bookmark text-xl" aria-hidden="true" />
            </div>
            <div>
              <p className="text-slate-800 dark:text-gray-200 font-medium">
                {isLoading ? (
                  <span className="inline-block h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  <>
                    {totalBookmarkCount}{" "}
                    {totalBookmarkCount === 1 ? "saved story" : "saved stories"}
                  </>
                )}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                View and manage your bookmarked stories in one place.
              </p>
            </div>
          </div>

          <Link
            to="/bookmarks"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shrink-0"
          >
            <i className="fas fa-bookmark text-sm" aria-hidden="true" />
            Open My Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
