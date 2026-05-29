import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExploreViewListComponent from "./post.view.list.component";
import { Post } from "../../models/post";
import { useGetMyBookmarksQuery } from "../../redux/apis/bookmark.api";
import PaginationComponent from "../pagination/pagination.component";

const BookmarksComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const query: Record<string, string | number> = {
    page,
    limit: size,
  };

  const { data, isLoading } = useGetMyBookmarksQuery({ ...query });

  const onPaginationChange = (pageNumber: number, pageSize: number) => {
    setPage(pageNumber);
    setSize(pageSize);
  };

  const allPosts: Post[] = (data?.posts ?? []) as Post[];

  // Implement client-side instant search for bookmarks
  const filteredPosts = allPosts.filter(
    (story: Post) =>
      story &&
      ((story.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.tag?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-0 min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="pt-4 pb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="w-full md:w-auto">
            <Link to="/">
              <div className="group flex items-center gap-3 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition-all duration-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="bg-white dark:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
                  <i className="fa-solid fa-arrow-left text-sm"></i>
                </div>
                Return Home
              </div>
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <input
                type="text"
                placeholder="Search your saved stories..."
                className="relative w-full pl-14 pr-4 py-3.5 text-base text-slate-900 placeholder:text-slate-500 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white dark:placeholder:text-slate-400 dark:bg-slate-900/80 dark:border-slate-700 transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400 text-lg"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Grid Area */}
          <div className="flex-1 flex flex-col min-h-[70vh]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4 dark:text-white tracking-tight">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-500/30">
                    <i className="fas fa-bookmark"></i>
                  </div>
                  My Collection
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 ml-16 text-lg">
                  Stories you've saved for later inspiration
                </p>
              </div>
              {allPosts.length > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-slate-600 dark:text-gray-400">Show</label>
                  <select
                    className="!rounded-button border border-gray-200 text-sm focus:border-custom focus:ring-custom bg-gray-100 text-slate-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-slate-600 dark:text-gray-400">entries</span>
                </div>
              )}
            </div>

            {/* Content Rendering */}
            <div className="flex-grow">
              {!isLoading && allPosts.length === 0 ? (
                /* Elegant Glassmorphism Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-md text-slate-900 dark:bg-blue-500/5 dark:border-blue-500/10 dark:text-white">
                  <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20">
                    <i className="far fa-bookmark text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 dark:text-gray-200">
                    No bookmarks yet
                  </h3>
                  <p className="text-slate-600 max-w-md mb-8 dark:text-gray-400">
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
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-10 mt-auto py-4 dark:bg-gray-900/90 dark:border-gray-800">
                <PaginationComponent
                  current={page}
                  pageSize={size}
                  total={data.meta.total}
                  onChange={onPaginationChange}
                />
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
