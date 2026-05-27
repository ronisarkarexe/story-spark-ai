import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";

interface IExploreViewListComponentProps {
  posts: Post[];
  isLoading: boolean;
}

const ExploreViewListComponent: React.FC<IExploreViewListComponentProps> = ({
  posts,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse-slow bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[520px]"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-video bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-[#03050C] to-transparent opacity-60"></div>
              {/* Tag Badges Skeleton */}
              <div className="absolute top-6 left-6 h-7 w-20 bg-blue-500/10 rounded-full border border-blue-500/10" />
            </div>

            {/* Body Content Placeholder */}
            <div className="p-8 flex-1 flex flex-col">
              {/* Title Line */}
              <div className="h-6 bg-slate-800/60 rounded-lg w-3/4 mb-4" />

              {/* Excerpt Lines */}
              <div className="space-y-3 mb-8 flex-1">
                <div className="h-3.5 bg-slate-800/40 rounded-lg w-full" />
                <div className="h-3.5 bg-slate-800/40 rounded-lg w-full" />
                <div className="h-3.5 bg-slate-800/40 rounded-lg w-5/6" />
              </div>

              {/* Footer Metadata */}
              <div className="border-t border-white/5 pt-6 mt-auto flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800/60" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-800/60 rounded-md w-1/3" />
                  <div className="h-2 bg-slate-800/30 rounded-md w-1/4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.length > 0 ? (
          posts.map((story) => (
            <div
              key={story._id}
              onClick={() => navigate(`/post/${story._id}`)}
              className="cursor-pointer group relative flex flex-col h-[520px] bg-slate-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(59,130,246,0.25)] hover:border-blue-500/40 backdrop-blur-xl"
            >
              {/* Image Area with Deep Cinematic Overlay */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={story.imageURL}
                  alt={`Cover image for ${story.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                />
                {/* Deep Gradient Wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#03050C] via-[#03050C]/20 to-transparent opacity-90" />
                
                {/* Floating Tags - Premium Styling */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-5 py-2 bg-blue-600/20 backdrop-blur-2xl border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-2xl">
                    {story.tag}
                  </span>
                  <span className="px-5 py-2 bg-indigo-600/20 backdrop-blur-2xl border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-2xl">
                    🌐 {story.language || "English"}
                  </span>
                </div>

                {/* Subtle Resting Border Glow */}
                <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />
              </div>

              {/* Content Area */}
              <div className="relative flex-1 p-8 flex flex-col gap-4">
                {/* Visual Depth Accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-30" />

                <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-tight">
                  {story.title}
                </h3>

                <p className="text-[13px] text-gray-300 line-clamp-3 leading-relaxed font-medium opacity-60 group-hover:opacity-80 transition-opacity">
                  {story.content.slice(0, 100)}...
                </p>

                {/* Footer Metadata - Premium Unified Style */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-2xl border border-white/10 uppercase ring-4 ring-white/2">
                      {story.author?.name?.[0] || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-extrabold text-white tracking-tight">
                        {story.author?.name || 'Writer'}
                      </span>
                      <span className="text-[9px] font-bold text-blue-400/50 uppercase tracking-widest">
                        Storyteller
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5 text-gray-300 text-xs">
                     <span className="flex items-center gap-2 group/stat hover:text-blue-400 transition-colors cursor-pointer bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:border-blue-500/30">
                        <i className="fa-solid fa-heart text-[10px] text-blue-500"></i>
                        <span className="font-black tracking-tighter">{story.likesCount || 0}</span>
                     </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
             <i className="fas fa-ghost text-4xl text-blue-500/30 mb-4 block"></i>
             <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">No posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreViewListComponent;
