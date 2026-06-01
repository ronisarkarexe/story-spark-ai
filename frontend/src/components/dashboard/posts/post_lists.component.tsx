import React, { useState } from "react";
import { useGetPostListsQuery } from "../../../redux/apis/post.api";
import { useDebounced } from "../../../hooks/global";
import { Post, Topic } from "../../../models/post";
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


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


            </div>
          </div>
        </div>
      </div>


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
                    <div className="text-sm">
                      <p className="font-medium text-gray-300">{post.author?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{post.author?.email || ''}</p>
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

                      </button>
                    </div>
                  </td>
                </tr>

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
