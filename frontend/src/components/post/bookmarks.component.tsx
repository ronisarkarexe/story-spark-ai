import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExploreViewListComponent from "./post.view.list.component";
import { Post } from "../../models/post";
import { useGetMyBookmarksQuery } from "../../redux/apis/bookmark.api";
import PaginationComponent from "../pagination/pagination.component";
import { getSessionBookmarks } from "../../utils/session-bookmarks";
import StoryTradingCard from "../cards/StoryTradingCard";
import { IStories } from "../stories/stories.view.component";

const BookmarksComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("newest");

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

  const [activeTab, setActiveTab] = useState<"posts" | "generated">("posts");
  const [sessionStories, setSessionStories] = useState<IStories[]>(() => getSessionBookmarks());

  useEffect(() => {
    const handleBookmarkChange = () => {
      setSessionStories(getSessionBookmarks());
    };
    window.addEventListener("session_bookmarks_changed", handleBookmarkChange);
    return () => {
      window.removeEventListener("session_bookmarks_changed", handleBookmarkChange);
    };
  }, []);

  const filteredSessionStories = sessionStories.filter(
    (story: IStories) =>
      story &&
      ((story.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.tag?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  // Implement client-side instant search for bookmarks
  const filteredPosts = allPosts.filter(
    (story: Post) =>
      story &&
      ((story.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.tag?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  // Sort posts client-side
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "title-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "title-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "length-asc":
        return (a.content || "").length - (b.content || "").length;
      case "length-desc":
        return (b.content || "").length - (a.content || "").length;
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <div className="pt-0 min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="pt-4 pb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="w-full md:w-auto">
            <Link to="/">
              <div className="group flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full transition-all duration-300 shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center shadow-inner group-hover:-translate-x-1 transition-transform">
                  <i className="fa-solid fa-arrow-left text-sm"></i>
                </div>
                Return Home
              </div>
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-40 dark:opacity-20"></div>
              <input
                type="text"
                placeholder="Search your saved stories..."
                className="relative w-full pl-14 pr-4 py-3.5 text-base text-slate-900 placeholder:text-slate-500 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium dark:text-white dark:placeholder:text-slate-400 dark:bg-slate-900/80 dark:border-slate-700"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 text-lg"></i>
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
              {activeTab === "posts" && allPosts.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-400">Sort By</label>
                    <select
                      className="!rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 py-1.5 px-3 outline-none transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest Bookmarked</option>
                      <option value="oldest">Oldest Bookmarked</option>
                      <option value="title-asc">Alphabetical (A-Z)</option>
                      <option value="title-desc">Alphabetical (Z-A)</option>
                      <option value="length-asc">Shortest First</option>
                      <option value="length-desc">Longest First</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-400">Show</label>
                    <select
                      className="!rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 py-1.5 px-3 outline-none transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-400">entries</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs for Published vs Generated */}
            <div className="flex gap-4 mb-8 border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Published Stories ({allPosts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("generated")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "generated"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Generated Drafts ({sessionStories.length})
              </button>
            </div>

            {/* Content Rendering */}
            <div className="flex-grow">
              {activeTab === "posts" ? (
                !isLoading && allPosts.length === 0 ? (
                  /* Elegant Responsive Empty State */
                  <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl backdrop-blur-md dark:bg-[#0f172a]/60 dark:border-white/5 dark:text-white">
                    <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center mb-8 text-indigo-500 dark:text-blue-400 border border-indigo-100/50 dark:border-blue-500/10 shadow-inner">
                      <i className="far fa-bookmark text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight dark:text-gray-200">
                      Your collection is waiting
                    </h3>
                    <p className="text-slate-500 max-w-sm mb-10 text-lg leading-relaxed dark:text-gray-400">
                      Whenever you find a story that moves you, save it here to build your personal library of inspiration.
                    </p>
                    <button
                      onClick={() => navigate("/explore")}
                      className="cursor-pointer !rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 shadow-lg shadow-slate-200 transition-all duration-300 hover:-translate-y-1 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none"
                    >
                      Explore Stories
                    </button>
                  </div>
                ) : (
                  <ExploreViewListComponent
                    posts={sortedPosts}
                    isLoading={isLoading}
                  />
                )
              ) : (
                sessionStories.length === 0 ? (
                  /* Elegant Responsive Empty State for Generated Drafts */
                  <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl backdrop-blur-md dark:bg-[#0f172a]/60 dark:border-white/5 dark:text-white">
                    <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center mb-8 text-indigo-500 dark:text-blue-400 border border-indigo-100/50 dark:border-blue-500/10 shadow-inner">
                      <i className="far fa-bookmark text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight dark:text-gray-200">
                      No saved drafts yet
                    </h3>
                    <p className="text-slate-500 max-w-sm mb-10 text-lg leading-relaxed dark:text-gray-400">
                      Generate stories and bookmark them to build a collection of your favorite drafts for this session.
                    </p>
                    <button
                      onClick={() => navigate("/stories")}
                      className="cursor-pointer !rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 shadow-lg shadow-slate-200 transition-all duration-300 hover:-translate-y-1 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none"
                    >
                      Create a Story
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {filteredSessionStories.map((story) => (
                      <StoryTradingCard key={story.uuid} story={story} />
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Pagination Component */}
            {activeTab === "posts" && allPosts.length > 0 && data?.meta && (
              <div className="sticky bottom-4 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl z-10 mt-12 py-5 px-6 shadow-xl shadow-slate-200/50 dark:bg-gray-950/80 dark:border-gray-800 dark:shadow-none">
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
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-100/30 dark:bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100/30 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
};

export default BookmarksComponent;
