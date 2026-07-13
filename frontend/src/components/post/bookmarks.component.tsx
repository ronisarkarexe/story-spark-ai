import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import Fuse from "fuse.js";
import ExploreViewListComponent from "./post.view.list.component";
import { Post } from "../../models/post";
import { useGetMyBookmarksQuery } from "../../redux/apis/bookmark.api";
import PaginationComponent from "../pagination/pagination.component";
import { getSessionBookmarks } from "../../utils/session-bookmarks";
import StoryTradingCard from "../cards/StoryTradingCard";
import { IStories } from "../stories/stories.view.component";

// Configuration constants
const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  FUSE_THRESHOLD: 0.4, // Slightly more forgiving
  MIN_MATCH_LENGTH: 2,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Fuse.js search options - base configuration
const FUSE_OPTIONS = {
  threshold: SEARCH_CONFIG.FUSE_THRESHOLD,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: SEARCH_CONFIG.MIN_MATCH_LENGTH,
  shouldSort: true,
  useExtendedSearch: true,
  distance: 100, // Better matching for typos
} as const;

// Search keys as readonly arrays
const POST_SEARCH_KEYS = ["title", "tag", "content"] as const;
const STORY_SEARCH_KEYS = ["title", "tag", "content"] as const;

// Separate component for search input to reduce re-renders
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
  onClear: () => void;
}> = React.memo(({ value, onChange, isSearching, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative group w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-40 dark:opacity-20" />
      <div className="relative flex items-center">
        <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 text-lg z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search your saved stories... (Ctrl+K)"
          className="relative w-full pl-14 pr-12 py-3.5 text-base text-slate-900 placeholder:text-slate-500 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium dark:text-white dark:placeholder:text-slate-400 dark:bg-slate-900/80 dark:border-slate-700"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search bookmarks"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors z-10 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Clear search"
          >
            <i className="fas fa-times-circle text-lg" />
          </button>
        )}
        {isSearching && value && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

// Separate component for empty state
const EmptyState: React.FC<{
  title: string;
  message: string;
  buttonText: string;
  onClick: () => void;
  icon: string;
}> = React.memo(({ title, message, buttonText, onClick, icon }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl backdrop-blur-md dark:bg-[#0f172a]/60 dark:border-white/5">
    <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center mb-8 text-indigo-500 dark:text-blue-400 border border-indigo-100/50 dark:border-blue-500/10 shadow-inner">
      <i className={`${icon} text-4xl`} />
    </div>
    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight dark:text-gray-200">
      {title}
    </h3>
    <p className="text-slate-500 max-w-sm mb-10 text-lg leading-relaxed dark:text-gray-400">
      {message}
    </p>
    <button
      onClick={onClick}
      className="cursor-pointer !rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 shadow-lg shadow-slate-200 transition-all duration-300 hover:-translate-y-1 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none"
    >
      {buttonText}
    </button>
  </div>
));
EmptyState.displayName = 'EmptyState';

const BookmarksComponent: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchTerm, SEARCH_CONFIG.DEBOUNCE_DELAY);
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"posts" | "generated">("posts");
  const [sessionStories, setSessionStories] = useState<IStories[]>(() => getSessionBookmarks());
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Queries
  const query = useMemo(() => ({
    page,
    limit: size,
  }), [page, size]);

  const { data, isLoading } = useGetMyBookmarksQuery(query);
  const allPosts = useMemo(() => (data?.posts ?? []) as Post[], [data]);

  // Handle session bookmark changes
  useEffect(() => {
    const handleBookmarkChange = () => {
      setSessionStories(getSessionBookmarks());
    };
    window.addEventListener("session_bookmarks_changed", handleBookmarkChange);
    return () => {
      window.removeEventListener("session_bookmarks_changed", handleBookmarkChange);
    };
  }, []);

  // Debounce search indicator
  useEffect(() => {
    setIsSearching(searchTerm !== debouncedSearch);
  }, [searchTerm, debouncedSearch]);

  // Fuse instances with memoization - using spread to avoid readonly issues
  const postFuse = useMemo(() => {
    if (!allPosts.length) return null;
    return new Fuse(allPosts, {
      ...FUSE_OPTIONS,
      keys: [...POST_SEARCH_KEYS],
    });
  }, [allPosts]);

  const storyFuse = useMemo(() => {
    if (!sessionStories.length) return null;
    return new Fuse(sessionStories, {
      ...FUSE_OPTIONS,
      keys: [...STORY_SEARCH_KEYS],
    });
  }, [sessionStories]);

  // Filtered results with better sorting
  const filteredPosts = useMemo(() => {
    const search = debouncedSearch.trim();
    if (!search) return allPosts;
    if (!postFuse) return allPosts;
    
    const results = postFuse.search(search);
    return results
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map((result) => result.item);
  }, [debouncedSearch, allPosts, postFuse]);

  const filteredSessionStories = useMemo(() => {
    const search = debouncedSearch.trim();
    if (!search) return sessionStories;
    if (!storyFuse) return sessionStories;
    
    const results = storyFuse.search(search);
    return results
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map((result) => result.item);
  }, [debouncedSearch, sessionStories, storyFuse]);

  // Handlers
  const handlePageChange = useCallback((pageNumber: number, pageSize: number) => {
    setPage(pageNumber);
    setSize(pageSize);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setPage(1);
  }, []);

  const handleTabChange = useCallback((tab: "posts" | "generated") => {
    setActiveTab(tab);
  }, []);

  // Derived state
  const hasPosts = allPosts.length > 0;
  const hasSessionStories = sessionStories.length > 0;
  const showEmptyState = !isLoading && !hasPosts && activeTab === "posts";
  const showEmptyDrafts = !hasSessionStories && activeTab === "generated";
  const hasSearchResults = activeTab === "posts" ? filteredPosts.length > 0 : filteredSessionStories.length > 0;

  return (
    <div className="pt-0 min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Header */}
        <div className="pt-4 pb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="w-full md:w-auto">
            <Link to="/">
              <button className="group flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full transition-all duration-300 shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center shadow-inner group-hover:-translate-x-1 transition-transform">
                  <i className="fa-solid fa-arrow-left text-sm"></i>
                </div>
                Return Home
              </button>
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              isSearching={isSearching}
              onClear={handleClearSearch}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-[70vh]">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4 tracking-tight dark:text-white">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/30">
                    <i className="fas fa-bookmark"></i>
                  </div>
                  My Collection
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 ml-16 text-lg font-medium">
                  {activeTab === "posts" 
                    ? `${filteredPosts.length} stories saved for later inspiration`
                    : `${filteredSessionStories.length} generated drafts in this session`}
                </p>
              </div>
              {activeTab === "posts" && hasPosts && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-400">Show</label>
                  <select
                    className="!rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 py-1.5 px-3 outline-none transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {SEARCH_CONFIG.PAGE_SIZE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-400">entries</span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
              <button
                type="button"
                onClick={() => handleTabChange("posts")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                aria-pressed={activeTab === "posts"}
              >
                Published Stories ({filteredPosts.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("generated")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "generated"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                aria-pressed={activeTab === "generated"}
              >
                Generated Drafts ({filteredSessionStories.length})
              </button>
              {debouncedSearch.trim() && (
                <span className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 font-medium self-center">
                  {activeTab === "posts" 
                    ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} found`
                    : `${filteredSessionStories.length} result${filteredSessionStories.length !== 1 ? 's' : ''} found`}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow">
              {activeTab === "posts" ? (
                showEmptyState ? (
                  <EmptyState
                    title="Your collection is waiting"
                    message="Whenever you find a story that moves you, save it here to build your personal library of inspiration."
                    buttonText="Explore Stories"
                    onClick={() => navigate("/explore")}
                    icon="far fa-bookmark"
                  />
                ) : (
                  <>
                    <ExploreViewListComponent
                      posts={filteredPosts}
                      isLoading={isLoading}
                    />
                    {debouncedSearch.trim() && !hasSearchResults && !isLoading && (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p className="text-lg">No stories found matching "<strong>{debouncedSearch}</strong>"</p>
                        <p className="text-sm mt-2">Try different keywords or clear the search</p>
                      </div>
                    )}
                  </>
                )
              ) : (
                showEmptyDrafts ? (
                  <EmptyState
                    title="No saved drafts yet"
                    message="Generate stories and bookmark them to build a collection of your favorite drafts for this session."
                    buttonText="Create a Story"
                    onClick={() => navigate("/stories")}
                    icon="far fa-bookmark"
                  />
                ) : (
                  <>
                    {debouncedSearch.trim() && !hasSearchResults ? (
                      <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                          No drafts found matching "<strong>{debouncedSearch}</strong>"
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {filteredSessionStories.map((story) => (
                          <StoryTradingCard key={story.uuid} story={story} />
                        ))}
                      </div>
                    )}
                  </>
                )
              )}
            </div>

            {/* Pagination */}
            {activeTab === "posts" && hasPosts && data?.meta && (
              <div className="sticky bottom-4 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl z-10 mt-12 py-5 px-6 shadow-xl shadow-slate-200/50 dark:bg-gray-950/80 dark:border-gray-800 dark:shadow-none">
                <PaginationComponent
                  current={page}
                  pageSize={size}
                  total={data.meta.total}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-100/30 dark:bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100/30 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
};

export default BookmarksComponent;