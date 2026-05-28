import React, { useState } from "react";
import { useGetPostListsQuery } from "../../../redux/apis/post.api";
import { useDebounced } from "../../../hooks/global";
import { Topic } from "../../../models/post";
import PaginationComponent from "../../pagination/pagination.component";

const PostListsComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
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

  const getTopicBadges = (topics: Topic[]) => {
    return topics.map((topic) => (
      <span
        key={topic._id}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border"
        style={{
          backgroundColor: `${topic.color}15`,
          color: topic.color,
          borderColor: `${topic.color}30`
        }}
      >
        {topic.title}
      </span>
    ));
  };

  const getStatusBadge = (isPublished: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${isPublished
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
          }`}
      >
        {isPublished ? "Published" : "Draft"}
      </span>
    );
  };

  return (
    <div className="bg-[#1a1d2d]/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/60 overflow-hidden">
      <div className="w-full flex justify-between items-center p-5 border-b border-gray-800/60 bg-[#1a1d2d]/50">
        <h2 className="text-xl font-bold text-gray-100 tracking-tight">Posts</h2>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[250px] relative group">
            <div className="relative">
              <input
                className="w-full pr-11 h-10 pl-4 py-2 bg-[#141624] placeholder:text-gray-500 text-gray-200 text-sm border border-gray-800 rounded-lg transition-all duration-300 ease focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 hover:border-gray-700 shadow-inner"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center justify-center rounded-md hover:bg-gray-800/50 transition-colors text-gray-500 group-hover:text-gray-400"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
              {data?.posts?.map((post) => (
                <tr key={post._id} className="hover:bg-gray-800/30 transition-colors duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.imageURL && (
                        <div className="flex-shrink-0 h-11 w-11 mr-4 relative">
                          <img
                            className="h-11 w-11 rounded-lg object-cover shadow-md ring-1 ring-white/10"
                            src={post.imageURL}
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

                    <div className="text-xs text-gray-400">
                      {post.author?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {getTopicBadges(post.topic)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post.isPublished)}
                      {post.isFeaturedPost && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-5">
                      <div className="text-center group/stat">
                        <div className="text-sm font-semibold text-gray-300 group-hover/stat:text-rose-400 transition-colors">
                          {post.likesCount}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 font-medium">Likes</div>
                      </div>
                      <div className="text-center group/stat">
                        <div className="text-sm font-semibold text-gray-300 group-hover/stat:text-blue-400 transition-colors">
                          {post.commentsCount}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 font-medium">Comments</div>
                      </div>
                      <div className="text-center group/stat">
                        <div className="text-sm font-semibold text-gray-300 group-hover/stat:text-emerald-400 transition-colors">
                          {post.viewsCount}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 font-medium">Views</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3 py-1.5 rounded-md transition-all">
                        Edit
                      </button>
                      <button className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-1.5 rounded-md transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.meta && (
        <div className="sticky bottom-0 bg-[#1a1d2d]/90 backdrop-blur-md border-t border-gray-800/60 z-10 mt-2">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <PaginationComponent
              current={page}
              pageSize={size}
              total={data.meta.total}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostListsComponent;
