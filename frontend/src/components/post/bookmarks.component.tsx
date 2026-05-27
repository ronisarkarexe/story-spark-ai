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

  const allPosts = data?.posts || [];

  // Implement client-side instant search for bookmarks
  const filteredPosts = allPosts.filter(
    (story: Post) =>
      story &&
      ((story.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.tag?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (story.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative pt-0 min-h-screen bg-[#03050C] text-white overflow-hidden selection:bg-blue-500/30">
      {/* Premium Cinematic Background Atmosphere - Visible pass */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px]"></div>
        {/* Specific ambient glows for sections */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[400px] h-[200px] bg-blue-400/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="pt-2 pb-14 flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-full md:w-auto">
            <Link to="/">
              <div className="group bg-slate-900/40 hover:bg-slate-800/60 text-gray-400 px-6 py-3 flex items-center justify-center gap-3 transition-all duration-300 rounded-full border border-white/5 backdrop-blur-xl cursor-pointer hover:border-white/10 hover:text-white hover:scale-105 active:scale-95 shadow-xl">
                <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1.5"></i>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Stories</span>
              </div>
            </Link>
          </div>
          <div className="flex-1 w-full max-w-3xl">
              <div className="relative group">
                {/* Visible focus glow ring */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, author or genre..."
                    className="w-full pl-16 pr-8 py-4 text-base text-gray-100 placeholder:text-gray-500 bg-slate-900/50 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/40 backdrop-blur-2xl transition-all duration-300 shadow-2xl group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage( page !== 1 ? 1 : page );
                    }}
                  />
                  <i className="fas fa-search absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300 text-lg"></i>
                </div>
              </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Main Grid Area */}
          <div className="flex-1 flex flex-col min-h-[70vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div className="flex flex-col gap-2 relative">
                {/* Accent glow behind bookmark icon */}
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 flex items-center tracking-tight">
                  <i className="fas fa-bookmark mr-5 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"></i>
                  Saved Stories
                </h2>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-px bg-blue-500/20"></span>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 opacity-80">
                    Premium Bookmarks Collection
                  </p>
                </div>
              </div>
              {allPosts.length > 0 && (
                <div className="flex items-center gap-6 bg-slate-900/60 border border-white/5 rounded-full px-7 py-3 backdrop-blur-2xl shadow-2xl group transition-all hover:border-white/10">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-blue-400/70 transition-colors">Filters / Show</label>
                  <div className="w-px h-4 bg-white/5 mx-1"></div>
                  <select
                    className="bg-transparent border-none text-xs font-black tracking-widest focus:ring-0 text-white cursor-pointer outline-none transition-transform hover:scale-110 active:scale-95"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10} className="bg-[#03050C]">10 Entries</option>
                    <option value={25} className="bg-[#03050C]">25 Entries</option>
                    <option value={50} className="bg-[#03050C]">50 Entries</option>
                    <option value={100} className="bg-[#03050C]">100 Entries</option>
                  </select>
                </div>
              )}
            </div>

            {/* Content Rendering */}
            <div className="flex-grow">
              {!isLoading && allPosts.length === 0 ? (
                /* Elegant Glassmorphism Empty State */
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-xl group">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-500">
                    <i className="far fa-bookmark text-4xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                    Your collection is waiting
                  </h3>
                  <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">
                    Capture the magic of storytelling. Bookmark your favorite pieces to build your personal cinematic library.
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="group relative cursor-pointer px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                       Explore Stories
                       <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                    </span>
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
              <div className="sticky bottom-10 mt-20 px-8 py-6 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] z-20 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.7)] group hover:border-blue-500/20 transition-all duration-500">
                <PaginationComponent
                  current={page}
                  pageSize={size}
                  total={data?.meta?.total || 0}
                  onChange={onPaginationChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksComponent;
