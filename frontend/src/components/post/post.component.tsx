import React, { useEffect, useMemo, useRef, useState } from "react";
import ExploreViewListComponent from "./post.view.list.component";
import ExploreFeatureComponent from "./post.feature.component";
import { Link } from "react-router-dom";
import {
  useGetPostListsQuery,
  useGetGenresQuery,
} from "../../redux/apis/post.api";
import type { Post } from "../../models/post";
import { useDebounced } from "../../hooks/global";

const ExploreComponent = () => {
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [size, setSize] = useState(10);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const normalizedSearchTerm = debounceTerm?.trim() ?? "";
  const genresParam =
    selectedTags.length > 0 ? selectedTags.join(",") : undefined;

  const queryArgs = useMemo(() => {
    const args: Record<string, string | number> = {
      limit: size,
      sortBy,
      sortOrder,
    };

    if (normalizedSearchTerm) args.searchTerm = normalizedSearchTerm;
    if (genresParam) args.genres = genresParam;
    if (cursor) args.cursor = cursor;

    return args;
  }, [size, sortBy, sortOrder, normalizedSearchTerm, genresParam, cursor]);

  const { data, isLoading, isFetching } =
    useGetPostListsQuery(queryArgs);
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
    [size, sortBy, sortOrder, normalizedSearchTerm, genresParam]
  );

  const previousQuerySignature = useRef(querySignature);

  useEffect(() => {
    if (previousQuerySignature.current !== querySignature) {
      previousQuerySignature.current = querySignature;
      setCursor(undefined);
      setPosts([]);
    }
  }, [querySignature]);

  useEffect(() => {
    if (!data?.posts) return;

    if (!cursor) {
      setPosts(data.posts);
    } else if (data.posts.length > 0) {
      setPosts((prev) => [...prev, ...data.posts]);
    }
  }, [data?.posts, cursor]);

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver((entries) => {
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
    });

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [data, cursor, isLoading, isFetching]);

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
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const availableTags = Array.from(
    new Set(
      posts
        .map((p) => p.tag)
        .filter(Boolean)
        .map((t) => `#${t?.toLowerCase().trim()}`)
    )
  ).slice(0, 8);

  const availableGenres = genres ?? [];

  const filteredPosts = posts;

  return (
    <div className="pt-0 min-h-screen bg-white text-slate-900 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 py-3">

        {/* TOP BAR */}
        <div className="pt-2 pb-6 flex flex-col md:flex-row gap-4">

          <Link to="/" className="w-full md:w-64">
            <div className="bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
              BACK
            </div>
          </Link>

          {/* SEARCH */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search title, tag..."
              className="w-full p-3 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full md:w-64">
            <div className="p-4 border rounded">

              <button onClick={resetAllStates}>
                Reset
              </button>

              <h4>Genres</h4>
              {availableGenres.map((g) => (
                <label key={g}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(g.toLowerCase())}
                    onChange={() => handleTagClick(g.toLowerCase())}
                  />
                  {g}
                </label>
              ))}

            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1">

            <h2 onClick={() => setFeaturedPost(false)}>
              All Stories
            </h2>

            {featuredPost && <ExploreFeatureComponent />}

            {filteredPosts.length === 0 ? (
              <div>No stories found</div>
            ) : (
              <ExploreViewListComponent
                posts={filteredPosts}
                isLoading={isLoading}
              />
            )}

            <div ref={loadMoreTriggerRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreComponent;