import React, { useState, useMemo } from "react";
import { useGetPostListsQuery } from "../../../redux/apis/post.api";
import { useDebounced } from "../../../hooks/global";
import { Topic } from "../../../models/post";
import PaginationComponent from "../../pagination/pagination.component";
import ImageFallback from "../../ImageFallback";
ImageFallback
const PostListsComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "featured">("all");
  
  const query: Record<string, string | number> = {
    page,
    limit: size,
  };

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    daley: 600,
  });

  if (debounceTerm) {
    query["searchTerm"] = debounceTerm;
  }

  const { data, isLoading } = useGetPostListsQuery({ ...query });

  // Calculate filter stats
  const filterStats: FilterStats = useMemo(() => {
    return {
      total: data?.posts?.length || 0,
      published: data?.posts?.filter((p: Post) => p.isPublished)?.length || 0,
      drafts: data?.posts?.filter((p: Post) => !p.isPublished)?.length || 0,
      featured: data?.posts?.filter((p: Post) => p.isFeaturedPost)?.length || 0,
    };
  }, [data?.posts]);

  // Filter posts based on status
  const filteredPosts = useMemo(() => {
    let filtered = data?.posts || [];
    
    switch (filterStatus) {
      case "published":
        filtered = filtered.filter((p: Post) => p.isPublished);
        break;
      case "draft":
        filtered = filtered.filter((p: Post) => !p.isPublished);
        break;
      case "featured":
        filtered = filtered.filter((p: Post) => p.isFeaturedPost);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [data?.posts, filterStatus]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
  setPage(1);
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialsBgColor = (email: string) => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-emerald-500 to-cyan-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-indigo-500",
    ];
    return colors[email.charCodeAt(0) % colors.length];
  };

  const getTopicBadges = (topics: Topic[]) => {
    return topics.map((topic) => (
      <span
        key={topic._id}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border"
        style={{
          backgroundColor: `${topic.color}15`,
          color: topic.color,
          borderColor: `${topic.color}35`,
          boxShadow: `0 0 12px ${topic.color}20`
        }}
      >
        {topic.title}
      </span>
    ));
  };

  const getStatusBadge = (isPublished: boolean, isFeatured: boolean = false) => {
    if (isFeatured) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300">
          <i className="fas fa-star text-xs"></i>
          Featured
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${isPublished
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
          }`}
      >
        <span className={`w-2 h-2 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`}></span>
        {isPublished ? "Published" : "Draft"}
      </span>
    );
  };

  const StatCard = ({ icon, label, count, color, isActive }: { icon: string; label: string; count: number; color: string; isActive: boolean }) => (
    <button
      onClick={() => {
        if (label === "All Posts") setFilterStatus("all");
        else if (label === "Published") setFilterStatus("published");
        else if (label === "Drafts") setFilterStatus("draft");
        else if (label === "Featured") setFilterStatus("featured");
      }}
      className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 group ${
        isActive
          ? `bg-gradient-to-br ${color} border-${color.split(" ")[1]}/60 shadow-lg shadow-${color.split(" ")[1]}/20`
          : "bg-[#141624]/40 border-gray-800/40 hover:border-gray-700/60 hover:bg-[#0f1119]/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider font-semibold ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"} transition-colors`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${isActive ? "text-white" : "text-gray-200"}`}>
            {count}
          </p>
        </div>
        <i className={`${icon} text-3xl ${isActive ? "text-white/80" : "text-gray-500 group-hover:text-gray-400"} transition-colors`}></i>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a1d2d] via-[#141624] to-[#0f1119] border-b border-gray-800/60 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-6 py-8 lg:px-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Posts Management</h1>
            </div>
            <p className="text-gray-400 text-sm lg:text-base max-w-2xl">
              Create, manage, and organize your blog posts. Monitor engagement metrics, publish content, and track post performance all in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard icon="fas fa-file" label="All Posts" count={filterStats.total} color="from-blue-600/20 to-blue-500/10" isActive={filterStatus === "all"} />
            <StatCard icon="fas fa-check-circle" label="Published" count={filterStats.published} color="from-emerald-600/20 to-emerald-500/10" isActive={filterStatus === "published"} />
            <StatCard icon="fas fa-file-alt" label="Drafts" count={filterStats.drafts} color="from-amber-600/20 to-amber-500/10" isActive={filterStatus === "draft"} />
            <StatCard icon="fas fa-star" label="Featured" count={filterStats.featured} color="from-purple-600/20 to-purple-500/10" isActive={filterStatus === "featured"} />
          </div>

          {/* Search and Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center bg-[#0f1119] border border-gray-700/50 rounded-xl px-4 py-3 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 hover:border-gray-600/50">
                <i className="fas fa-search text-gray-500 group-focus-within:text-blue-400 mr-3 transition-colors"></i>
                <input
                  type="text"
                  className="flex-1 bg-transparent text-gray-200 placeholder:text-gray-500 outline-none text-sm"
                  placeholder="Search posts by title, tag, or author..."
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="Search posts"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* New Post Button */}
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fas fa-plus"></i>
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/60">
          <thead className="bg-[#141624]/80 backdrop-blur-sm">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Topics
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Stats
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 bg-transparent">
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse bg-transparent border-b border-gray-800/40">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-11 w-11 mr-4 rounded-lg bg-gray-800/40" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-gray-800/60 rounded-md w-32" />
                        <div className="h-3 bg-gray-800/30 rounded-md w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1.5">
                      <div className="h-4 bg-gray-800/50 rounded-md w-24" />
                      <div className="h-3 bg-gray-800/30 rounded-md w-32" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      <div className="h-5 bg-gray-800/40 rounded-full w-14" />
                      <div className="h-5 bg-gray-800/40 rounded-full w-16" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 bg-gray-800/50 rounded-full w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-5">
                      <div className="text-center">
                        <div className="h-4 bg-gray-800/40 rounded-md w-6 mx-auto" />
                        <div className="h-2 bg-gray-800/20 rounded-md w-8 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="h-4 bg-gray-800/40 rounded-md w-6 mx-auto" />
                        <div className="h-2 bg-gray-800/20 rounded-md w-8 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="h-4 bg-gray-800/40 rounded-md w-6 mx-auto" />
                        <div className="h-2 bg-gray-800/20 rounded-md w-8 mt-1" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="h-4 bg-gray-800/40 rounded-md w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 bg-gray-800/40 rounded-md w-12" />
                      <div className="h-8 bg-gray-800/40 rounded-md w-14" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              data?.posts?.map((post) => (
                <tr key={post._id} className="hover:bg-gray-800/30 transition-colors duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.imageURL && (
                        <div className="flex-shrink-0 h-11 w-11 mr-4 relative">
                          <ImageFallback
                            className="h-11 w-11 rounded-lg object-cover shadow-md ring-1 ring-white/10"
                            src="broken-url"
                            alt={post.title}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors duration-200">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px] xl:max-w-xs">
                          {post.tag}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">
                      {post.author?.name || 'Unknown User'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {getTopicBadges(post.topic)}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-300">{post.author.name}</p>
                      <p className="text-xs text-gray-500">{post.author.email}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    {getStatusBadge(post.isPublished, post.isFeaturedPost)}
                    {post.isPublished && !post.isFeaturedPost && (
                      <div className="text-xs px-2.5 py-1.5 rounded-full text-gray-400 bg-gray-800/40">
                        {formatDate(post.createdAt)}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6 flex-shrink-0 py-2">
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-rose-400 transition-colors">
                        <i className="fas fa-heart text-sm"></i>
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-blue-400 transition-colors">
                        <i className="fas fa-comment text-sm"></i>
                        <span className="text-sm font-semibold">{post.commentsCount}</span>
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-emerald-400 transition-colors">
                        <i className="fas fa-eye text-sm"></i>
                        <span className="text-sm font-semibold">{post.viewsCount}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-800/40">
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Edit post"
                      aria-label="Edit post"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Delete post"
                      aria-label="Delete post"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700/20 text-gray-400 border border-gray-700/40 hover:bg-gray-700/40 hover:border-gray-600/60 hover:text-gray-300 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <i className="fas fa-ellipsis-v text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Mobile Stats Row */}
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-800/40 flex justify-around">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-heart text-xs"></i>
                      <span className="font-semibold">{post.likesCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Likes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-comment text-xs"></i>
                      <span className="font-semibold">{post.commentsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Comments</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-eye text-xs"></i>
                      <span className="font-semibold">{post.viewsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {data?.meta && (
        <div className="px-6 py-8 lg:px-8 border-t border-gray-800/60">
          <PaginationComponent
            current={page}
            pageSize={size}
            total={data.meta.total}
            onChange={onPaginationChange}
          />
        </div>
      )}
    </div>
  );
};

export default PostListsComponent;
