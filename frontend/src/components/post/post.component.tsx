import React, { useState } from "react";
import ExploreViewListComponent from "./post.view.list.component";
import ExploreFeatureComponent from "./post.feature.component";
import { Link } from "react-router-dom";
import { useGetPostListsQuery } from "../../redux/apis/post.api";
import { useDebounced } from "../../hooks/global";
import PaginationComponent from "../pagination/pagination.component";

const ExploreComponent = () => {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [featuredPost, setFeaturedPost] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const query: Record<string, string | number> = {
    page,
    limit: size,
    sortBy,
    sortOrder,
  };

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    daley: 600,
  });

  if (debounceTerm) {
    query["searchTerm"] = debounceTerm;
  }

  if (selectedTags.length > 0) {
    query["tags"] = selectedTags.join(",");
  }

  const { data, isLoading } = useGetPostListsQuery({ ...query });

  const resetAllStates = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchTerm("");
    setSelectedTags([]);
    setPage(1);
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const availableTags = [
    "adventure",
    "steampunk",
    "fantasy",
    "thriller",
    "mystery",
    "romance",
  ];
  const availableGenres = ["Fantasy", "Science Fiction", "Mystery", "Romance"];

  return (
    <div className="pt-0 min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="pt-2 pb-6 flex gap-8">
          <div className="w-64">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search title, tag..."
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
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2lg font-semibold text-gray-400">
                  Filters
                </h3>
                <button
                  onClick={resetAllStates}
                  className="text-sm text-indigo-500 hover:text-indigo-700"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-400">Genres</h4>
                  <div className="space-y-2">
                    {availableGenres.map((genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-400 text-custom focus:ring-custom"
                          checked={selectedTags.includes(genre.toLowerCase())}
                          onChange={() => handleTagClick(genre.toLowerCase())}
                        />
                        <span className="ml-2 text-sm text-gray-500">
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-400">
                    Trending Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-2 py-1 rounded-md text-xs cursor-pointer ${
                          selectedTags.includes(tag)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-400">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border-gray-300 rounded-md text-sm focus:ring-custom focus:border-custom bg-gray-800 text-gray-300"
                  >
                    <option value="createdAt">Latest</option>
                    <option value="views">Most Popular</option>
                    <option value="commentsCount">Most Discussed</option>
                    <option value="likesCount">Most Liked</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-400">Order</h4>
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border-gray-300 rounded-md text-sm focus:ring-custom focus:border-custom bg-gray-800 text-gray-300"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[70vh]">
            <div className={`${featuredPost ? "mb-6" : ""}`}>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center justify-items-start overflow-x-auto">
                  <h2
                    onClick={() => setFeaturedPost(false)}
                    className={`text-2xl font-bold mb-6 cursor-pointer ${
                      !featuredPost ? "text-white" : "text-gray-400"
                    }`}
                  >
                    All Stories
                  </h2>
                  <h2
                    className={`text-xl font-bold mb-6 cursor-pointer ${
                      featuredPost ? "text-white" : "text-gray-400"
                    }`}
                    onClick={() => setFeaturedPost(!featuredPost)}
                  >
                    <i className="fas fa-star mr-2 text-yellow-500"></i>Featured
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-400">Show</label>
                  <select
                    className="!rounded-button border-gray-600 text-sm focus:border-custom focus:ring-custom bg-gray-800 text-gray-500"
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
                  <span className="text-sm text-gray-400">entries</span>
                </div>
              </div>
              {featuredPost && <ExploreFeatureComponent />}
            </div>

            {selectedTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md flex items-center"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagClick(tag)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex-grow">
              <ExploreViewListComponent
                posts={data?.posts || []}
                isLoading={isLoading}
              />
            </div>

            {!featuredPost && data?.meta && (
              <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 z-10 mt-auto py-4">
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

export default ExploreComponent;
