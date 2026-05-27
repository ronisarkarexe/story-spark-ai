import { useMemo, useState } from "react";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

const POSTS_PER_PAGE = 6;

const mockAuthor = (id: string, name: string) => ({
  _id: id,
  email: `${id}@example.com`,
  name,
  createdAt: new Date().toISOString(),
});

const mockTopic = (_id: string, title: string, color: string) => ({
  _id,
  title,
  color,
  selected: false,
});

const createMockPost = (
  overrides: Pick<Post, "_id" | "title" | "content" | "imageURL" | "author" | "topic"> &
    Partial<
      Pick<
        Post,
        | "likesCount"
        | "commentsCount"
        | "viewsCount"
        | "isFeaturedPost"
        | "tag"
        | "bookmarks"
      >
    >
): Post => {
  const now = new Date().toISOString();
  return {
    tag: "article",
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    isPublished: true,
    isFeaturedPost: false,
    publishedAt: now,
    updatedBy: overrides.author.email,
    attachments: [],
    comments: [],
    reactions: [],
    bookmarks: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/* -------------------- MOCK POSTS (fallback when API is empty) -------------------- */
const mockPosts: Post[] = [
  createMockPost({
    _id: "1",
    title: "Understanding React Performance Optimization",
    content:
      "React performance can be improved using memoization, lazy loading, and proper state management techniques...",
    imageURL: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    author: mockAuthor("a1", "John Doe"),
    topic: [
      mockTopic("t1", "React", "bg-blue-100 text-blue-700"),
      mockTopic("t2", "Frontend", "bg-purple-100 text-purple-700"),
    ],
    likesCount: 120,
    commentsCount: 34,
    viewsCount: 1023,
    isFeaturedPost: true,
  }),
  createMockPost({
    _id: "2",
    title: "Mastering Tailwind CSS for Modern UI",
    content:
      "Tailwind CSS allows you to build modern interfaces quickly using utility-first classes...",
    imageURL: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19",
    author: mockAuthor("a2", "Jane Smith"),
    topic: [
      mockTopic("t2", "Frontend", "bg-purple-100 text-purple-700"),
      mockTopic("t3", "CSS", "bg-pink-100 text-pink-700"),
    ],
    likesCount: 89,
    commentsCount: 18,
    viewsCount: 780,
  }),
  createMockPost({
    _id: "3",
    title: "Node.js Scaling Strategies for Production Apps",
    content:
      "Scaling Node.js requires clustering, load balancing, caching, and proper database optimization...",
    imageURL: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    author: mockAuthor("a3", "Alex Johnson"),
    topic: [mockTopic("t4", "Backend", "bg-green-100 text-green-700")],
    likesCount: 210,
    commentsCount: 56,
    viewsCount: 2400,
    isFeaturedPost: true,
  }),
  createMockPost({
    _id: "4",
    title: "UI/UX Principles Every Developer Should Know",
    content:
      "Good UI/UX is about simplicity, clarity, and consistency across the application...",
    imageURL: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    author: mockAuthor("a4", "Emily Clark"),
    topic: [mockTopic("t5", "Design", "bg-yellow-100 text-yellow-700")],
    likesCount: 67,
    commentsCount: 12,
    viewsCount: 540,
  }),
  createMockPost({
    _id: "5",
    title: "JavaScript ES2026 Features You Should Know",
    content:
      "New JS features include better async handling, pattern matching, and improved decorators...",
    imageURL: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    author: mockAuthor("a5", "Michael Lee"),
    topic: [mockTopic("t1", "React", "bg-blue-100 text-blue-700")],
    likesCount: 145,
    commentsCount: 29,
    viewsCount: 1800,
    isFeaturedPost: true,
  }),
  createMockPost({
    _id: "6",
    title: "How to Build Scalable APIs in 2026",
    content:
      "Scalable APIs require good architecture, caching layers, rate limiting, and database indexing...",
    imageURL: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    author: mockAuthor("a6", "Sophia Brown"),
    topic: [mockTopic("t4", "Backend", "bg-green-100 text-green-700")],
    likesCount: 98,
    commentsCount: 20,
    viewsCount: 900,
  }),
];

/* ------------------------------------------------------------------------ */

const LatestPostsComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const posts: Post[] = data?.posts?.length ? data.posts : mockPosts;

  const allTopics = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((p) => p.topic?.forEach((t) => map.set(t._id, t.title)));
    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeTopic === "all") return posts;
    return posts.filter((p) => p.topic?.some((t) => t._id === activeTopic));
  }, [posts, activeTopic]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full rounded-3xl border border-slate-200 bg-white/70 p-7 text-slate-900 shadow-md backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/60 dark:text-slate-100">
        <h2 className="text-xl font-bold">Latest Posts</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We couldn&apos;t load the latest posts right now. Please refresh and try
          again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Latest Posts</h2>
        <div className="h-[2px] flex-1 ml-6 bg-gradient-to-r from-blue-500/60 to-transparent rounded-full"></div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTopic("all")}
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            activeTopic === "all"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          All
        </button>

        {allTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            className={`px-4 py-1 rounded-full text-xs font-semibold ${
              activeTopic === t.id
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            #{t.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/post/${post._id}`)}
            className="bg-white/70 dark:bg-slate-900/60 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            {/* Image */}
            <div className="h-44 bg-slate-200 overflow-hidden">
              <img
                src={post.imageURL}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6">
              {/* Author */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <SSProfile
                    name={post.author?.name || "Unknown"}
                    size="h-9 w-9"
                  />
                  <div>
                    <p className="text-sm font-semibold">{post.author?.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateShort(post.createdAt)} •{" "}
                      {calculateReadingTime(post.content)} min
                    </p>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-500">
                {post.title}
              </h3>

              {/* Content */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mt-2">
                {post.content}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-xs mt-4 text-slate-500">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
                <span>👁 {post.viewsCount}</span>

                {post.isFeaturedPost && (
                  <span className="text-orange-500 font-semibold">
                    🔥 Trending
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {post.topic?.map((t) => (
                  <span
                    key={t._id}
                    className={`text-xs px-3 py-1 rounded-full ${t.color}`}
                  >
                    #{t.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((p) => p + POSTS_PER_PAGE)}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestPostsComponent;
