import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExploreViewListComponent from "./post.view.list.component";
import { useGetMyBookmarksQuery } from "../../redux/apis/bookmark.api";
import PaginationComponent from "../pagination/pagination.component";

import { getSessionBookmarks } from "../../utils/session-bookmarks";
import StoryTradingCard from "../cards/StoryTradingCard";
import { IStories } from "../stories/stories.view.component";

const BookmarksComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const size = 12;
  const [page, setPage] = useState<number>(1);

  const query: Record<string, string | number> = {
    page,
    limit: size,
  };

  const { data, isLoading } = useGetMyBookmarksQuery({ ...query });

  const loadMore = () => {
    if (data?.meta && allPosts.length < data.meta.total) {
      setPage((prev) => prev + 1);
    }
  };

  const allPosts = data?.posts || [];

  // Implement client-side instant search for bookmarks
  const filteredPosts = allPosts.filter(
    (story) =>
      story &&
      ((story.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.tag?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-0 min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="pt-2 pb-6 flex gap-8">
          <div className="w-64">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded cursor-pointer">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookmarked stories..."
                className="w-full pl-12 pr-4 py-2 text-base text-gray-200 placeholder-gray-400 bg-blue-500/10 border outline-1 -outline-offset-1 outline-indigo-600 rounded-md focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Grid Area */}
          <div className="flex-1 flex flex-col min-h-[70vh]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4 tracking-tight dark:text-white">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/30">
                    <i className="fas fa-bookmark"></i>
                  </div>
                  My Collection
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 ml-16 text-lg font-medium">
                  Stories you've saved for later inspiration
                </p>
              </div>
            </div>

            {/* Content Rendering */}
            <div className="flex-grow">
              {!isLoading && allPosts.length === 0 ? (
                /* Elegant Glassmorphism Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-blue-500/5 rounded-2xl border border-blue-500/10 shadow-lg backdrop-blur-md">
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20">
                    <i className="far fa-bookmark text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-gray-400 max-w-md mb-8">
                    Start saving stories you love! Whenever you see an amazing story in explore, click the bookmark icon to save it here for later.
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="cursor-pointer !rounded-button bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 transition-colors duration-300"
                  >
                    Explore Stories
                  </button>
                </div>
              ) : (
                <ExploreViewListComponent
                  posts={filteredPosts}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Pagination Component */}
            {allPosts.length > 0 && data?.meta && (
              <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-10 mt-auto py-4">
                <PaginationComponent
                  current={page}
                  pageSize={size}
                  total={data.meta.total}
                  onChange={setPage}
                />
              </div>
            )}

            {/* Load More Button */}
            {allPosts.length > 0 && data?.meta && allPosts.length < data.meta.total && (
              <div className="flex justify-center mt-12 mb-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="cursor-pointer !rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 shadow-lg shadow-slate-200 transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i> Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default BookmarksComponent;
