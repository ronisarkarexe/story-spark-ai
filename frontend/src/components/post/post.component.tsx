import React, { useEffect, useMemo, useRef, useState } from "react";
import ExploreViewListComponent from "./post.view.list.component";
import ExploreFeatureComponent from "./post.feature.component";
import { Link } from "react-router-dom";
import { useGetPostListsQuery, useGetGenresQuery } from "../../redux/apis/post.api";
import type { Post } from "../../models/post";
import { useDebounced } from "../../hooks/global";

const ExploreComponent = () => {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const normalizedSearchTerm = debounceTerm?.trim() ?? "";
  const genresParam = selectedTags.length > 0 ? selectedTags.join(",") : undefined;

  const queryArgs = useMemo<Record<string, string | number>>(() => {
    const args: Record<string, string | number> = {
      limit: size,
      sortBy,
      sortOrder,
    };

    if (normalizedSearchTerm) {
      args.searchTerm = normalizedSearchTerm;
    }

    if (genresParam) {
      args.genres = genresParam;
    }

    if (cursor) {
      args.cursor = cursor;
    }

    return args;
  }, [size, sortBy, sortOrder, normalizedSearchTerm, genresParam, cursor]);

  const { data, isLoading, isFetching } = useGetPostListsQuery(queryArgs);
  const { data: genres } = useGetGenresQuery();

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const querySignature = useMemo(
    () =>
      JSON.stringify({
        size,
        sortBy,
        sortOrder,
        normalizedSearchTerm,
        genresParam,
      }),
    [size, sortBy, sortOrder, normalizedSearchTerm, genresParam],
  );
  const previousQuerySignature = useRef<string>(querySignature);

  useEffect(() => {
    if (previousQuerySignature.current !== querySignature) {
      previousQuerySignature.current = querySignature;
      setCursor(undefined);
      setPosts([]);
    }
  }, [querySignature]);

  useEffect(() => {
    if (!data?.posts) {
      return;
    }

    if (!cursor) {
      setPosts(data.posts);
      return;
    }

    if (data.posts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    }
  }, [data?.posts, cursor]);

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry?.isIntersecting &&
          data?.meta?.hasMore &&
          data.meta.nextCursor &&
          !isLoading &&
          !isFetching &&
          data.meta.nextCursor !== cursor
        ) {
          setCursor(data.meta.nextCursor);
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [cursor, data?.meta?.hasMore, data?.meta?.nextCursor, isFetching, isLoading]);

  const filteredPosts = posts;

  const resetAllStates = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchTerm("");
    setSelectedTags([]);
    setCursor(undefined);
    setPosts([]);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const availableTags = Array.from(
    new Set(
      posts
        .map((post: Post) => post.tag)
        .filter(Boolean)
        .map((tag: string) => `#${tag.toLowerCase().trim()}`),
    ),
  ).slice(0, 8);

  const availableGenres = genres ?? [];

  return (
    <div className="pt-0 min-h-screen bg-white text-slate-900 relative overflow-hidden transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Section */}
        <div className="pt-2 pb-6 flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-64">
            <Link to="/">
              <div className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded border border-gray-200 dark:border-white/10">
                <i className="fa-solid fa-left-long"></i>
                BACK
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search title, tag..."
                className="w-full pl-12 pr-4 py-3 text-base text-slate-900 placeholder:text-slate-400 bg-gray-100/80 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-400 dark:border-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }} // <-- Fixed the cutoff target value event handler
              />
            </div>
          </div>
        </div> {/* <-- Fixed closing tag for Top Section container */}

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-4 bg-gray-50 border border-gray-200 text-slate-900 backdrop-blur-xl rounded-2xl p-6 shadow-xl z-10 transition-colors duration-300 dark:bg-slate-900/50 dark:border-none dark:text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Filters
                </h3>

                <button
                  onClick={resetAllStates}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-8">
                {/* Genres */}
                <div>
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Genres
                  </h4>

                  <div className="space-y-2">
                    {availableGenres.map((genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 cursor-pointer transition-all dark:border-slate-600 dark:bg-slate-700/50 dark:text-blue-500"
                          checked={selectedTags.includes(genre.toLowerCase())}
                          onChange={() => handleTagClick(genre.toLowerCase())}
                        />
                        <span className="ml-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-300">
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Trending Tags
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 shadow-sm ${
                          selectedTags.includes(tag)
                            ? "bg-blue-600 text-white shadow-blue-500/25"
                            : "bg-white border border-gray-200 text-slate-700 hover:bg-gray-100 hover:text-slate-900 dark:bg-slate-700/60 dark:border-slate-600/50 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">Sort By</h4>

                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                    className="w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-slate-900 p-2.5 outline-none transition-all cursor-pointer appearance-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200"
                  >
                    <option value="createdAt">Latest</option>
                    <option value="viewsCount">Most Popular</option>
                    <option value="commentsCount">Most Discussed</option>
                    <option value="likesCount">Most Liked</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">Order</h4>

                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                    }}
                    className="w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-slate-900 p-2.5 outline-none transition-all cursor-pointer appearance-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-[70vh]">
            <div className={`${featuredPost ? "mb-6" : ""}`}>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h2
                    onClick={() => setFeaturedPost(false)}
                    className={`text-3xl font-extrabold mb-6 cursor-pointer transition-all duration-300 ${
                      !featuredPost
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                  >
                    All Stories
                  </h2>

                  <h2
                    className={`text-2xl font-bold mb-6 cursor-pointer transition-all duration-300 flex items-center ${
                      featuredPost
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500 drop-shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                    onClick={() => setFeaturedPost(!featuredPost)}
                  >
                    <i className="fas fa-star mr-2 text-yellow-500"></i>
                    Featured
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    className="!rounded-button border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-gray-100 text-slate-900 py-1.5 px-3 outline-none transition-all appearance-none cursor-pointer dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {featuredPost && <ExploreFeatureComponent />}
            </div>

            <div className="flex-grow pb-24">
              {!isLoading && filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <div className="text-6xl mb-4">📚</div>

                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    No stories found
                    {searchTerm && (
                      <span className="text-indigo-400">
                        {" "}
                        for "{searchTerm}"
                      </span>
                    )}
                  </h2>

                  <p className="text-slate-600 dark:text-gray-400 max-w-md">
                    Try searching with different keywords or explore trending
                    tags and genres.
                  </p>

                  <button
                    onClick={resetAllStates}
                    className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md text-white"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <ExploreViewListComponent
                  posts={filteredPosts}
                  isLoading={isLoading}
                />
              )}
            </div>

            {!featuredPost && (
              <div className="mt-8">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
                  {isFetching && !isLoading && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Loading more stories...
                    </p>
                  )}
                  {!isFetching && !data?.meta?.hasMore && posts.length > 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      You have reached the end of the feed.
                    </p>
                  )}
                </div>
                <div ref={loadMoreTriggerRef} className="h-6" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default ExploreComponent;