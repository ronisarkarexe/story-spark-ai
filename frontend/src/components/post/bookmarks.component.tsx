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
  const [activeTab, setActiveTab] = useState<"posts" | "generated">("posts");
  const [sessionStories, setSessionStories] = useState<IStories[]>(() => getSessionBookmarks());

  const query: Record<string, string | number> = { page, limit: size };
  const { data, isLoading } = useGetMyBookmarksQuery({ ...query });

  useEffect(() => {
    const handleBookmarkChange = () => setSessionStories(getSessionBookmarks());
    window.addEventListener("session_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("session_bookmarks_changed", handleBookmarkChange);
  }, []);

  const allPosts: Post[] = (data?.posts ?? []) as Post[];

  const filteredSessionStories = sessionStories.filter(
    (story) =>
      story &&
      (story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPosts = allPosts.filter(
    (story) =>
      story &&
      (story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "oldest": return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "title-asc": return (a.title || "").localeCompare(b.title || "");
      case "title-desc": return (b.title || "").localeCompare(a.title || "");
      case "length-asc": return (a.content || "").length - (b.content || "").length;
      case "length-desc": return (b.content || "").length - (a.content || "").length;
      default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <div className="pt-0 min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="pt-4 pb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <i className="fa-solid fa-arrow-left text-sm"></i> Return Home
            </div>
          </Link>
          <div className="w-full md:w-1/2 lg:w-1/3 relative">
            <input
              type="text"
              placeholder="Search your saved stories..."
              className="w-full pl-14 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-900/80 dark:border-slate-700"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"></i>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
          <h2 className="text-4xl font-extrabold flex items-center gap-4 tracking-tight">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600"><i className="fas fa-bookmark"></i></div>
            My Collection
          </h2>
          
          {activeTab === "posts" && allPosts.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              <select className="!rounded-xl border border-slate-200 p-2 dark:bg-gray-800" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest Bookmarked</option>
                <option value="oldest">Oldest Bookmarked</option>
                <option value="title-asc">A-Z</option>
                <option value="title-desc">Z-A</option>
              </select>
              <select className="!rounded-xl border border-slate-200 p-2 dark:bg-gray-800" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-8 border-b border-slate-200/50 pb-3">
          <button onClick={() => setActiveTab("posts")} className={`px-4 py-2 font-bold rounded-lg ${activeTab === "posts" ? "bg-indigo-600 text-white" : "text-slate-500"}`}>
            Published ({allPosts.length})
          </button>
          <button onClick={() => setActiveTab("generated")} className={`px-4 py-2 font-bold rounded-lg ${activeTab === "generated" ? "bg-indigo-600 text-white" : "text-slate-500"}`}>
            Drafts ({sessionStories.length})
          </button>
        </div>

        <div className="flex-grow">
          {activeTab === "posts" ? (
            allPosts.length === 0 ? <p>No stories found.</p> : <ExploreViewListComponent posts={sortedPosts} isLoading={isLoading} />
          ) : (
            filteredSessionStories.length === 0 ? <p>No drafts found.</p> : 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSessionStories.map((story) => <StoryTradingCard key={story.uuid} story={story} />)}
            </div>
          )}
        </div>
        
        {activeTab === "posts" && allPosts.length > 0 && data?.meta && (
          <PaginationComponent current={page} pageSize={size} total={data.meta.total} onChange={(p, s) => { setPage(p); setSize(s); }} />
        )}
      </div>
    </div>
  );
};

export default BookmarksComponent;