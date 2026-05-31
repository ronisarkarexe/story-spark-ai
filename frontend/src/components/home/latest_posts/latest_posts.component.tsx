import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";

const CARD_WIDTH = 320;
const CARD_GAP = 20;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

const MOCK_LATEST_POSTS = [
  {
    _id: "mock11",
    title: "10 Prompts to Overcome Writer's Block",
    content: "Struggling to find the right words? Try these 10 creative writing prompts designed to kickstart your imagination and get your creative juices flowing again.",
  },
  {
    _id: "mock12",
    title: "The Art of Character Development",
    content: "Learn how to create multi-dimensional characters that resonate with your audience. We'll cover character arcs, motivations, and the importance of flaws.",
  },
  {
    _id: "mock13",
    title: "Understanding Narrative Pacing",
    content: "Pacing is crucial for keeping readers engaged. Discover techniques for speeding up or slowing down your story to match the emotional beats of your narrative.",
  },
  {
    _id: "mock14",
    title: "Writing Dialogue That Pops",
    content: "Good dialogue can make or break a scene. Explore tips and tricks for writing realistic, snappy, and revealing conversations between your characters.",
  },
] as Post[];

const COLOR_PALETTES = [
  {
    from: "#3b82f6",
    to: "#6366f1",
    tag: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  {
    from: "#8b5cf6",
    to: "#ec4899",
    tag: "bg-purple-500/15 text-purple-300 border-purple-500/20",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  {
    from: "#06b6d4",
    to: "#3b82f6",
    tag: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    from: "#f59e0b",
    to: "#ef4444",
    tag: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  {
    from: "#10b981",
    to: "#06b6d4",
    tag: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.4)",
  },
];

const StoryCard = ({ post, onClick, index }: { post: Post; onClick: () => void; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const words = (post.content || "").split(" ").length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const colorIdx = post._id ? parseInt(post._id.slice(-1), 16) % COLOR_PALETTES.length : 0;
  const color = COLOR_PALETTES[colorIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="latest-story-card group flex-shrink-0 text-left focus-visible:outline-none"
      style={{
        width: CARD_WIDTH,
        animationDelay: `${index * 80}ms`,
      }}
      aria-label={`Read story: ${post.title}`}
    >
      {/* Gradient top accent */}
      <div
        className="latest-story-card-accent"
        style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
      />

      {/* Hover glow */}
      <div
        className="latest-story-glow-bg"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${color.glow}, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="latest-story-card-inner">
        {/* Tag row */}
        <div className="mb-4 flex items-center gap-2">
          <span className={`latest-story-tag border ${color.tag}`}>
            <BookOpen className="h-3 w-3" />
            Story
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h3
          className={`latest-story-title mb-3 line-clamp-2 text-lg font-bold leading-snug text-slate-800 dark:text-slate-100 transition-colors duration-200 ${hovered ? "dark:!text-white !text-slate-900" : ""}`}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 transition-colors duration-200 ${hovered ? "dark:!text-slate-300" : ""}`}
        >
          {post.content || "No preview available."}
        </p>

        {/* Read more */}
        <div className="latest-story-read-more mt-5 flex items-center gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
            style={{ color: color.from }}
          >
            Read story
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: color.from }}
          />
        </div>
      </div>
    </button>
  );
};

const SkeletonCard = () => (
  <div
    className="latest-story-card flex-shrink-0 animate-pulse"
    style={{ width: CARD_WIDTH }}
    aria-hidden="true"
  >
    <div className="latest-story-card-inner space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-700/50" />
        <div className="ml-auto h-4 w-16 rounded bg-slate-700/40" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-4/5 rounded bg-slate-700/50" />
        <div className="h-5 w-2/3 rounded bg-slate-700/40" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded bg-slate-700/40" />
        <div className="h-3.5 w-5/6 rounded bg-slate-700/35" />
        <div className="h-3.5 w-4/6 rounded bg-slate-700/30" />
      </div>
      <div className="h-4 w-20 rounded bg-slate-700/40" />
    </div>
  </div>
);

const LatestPostsComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();
  const posts = isError || !data?.posts?.length ? MOCK_LATEST_POSTS : data.posts;
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);


  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScroll - 8);
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  // Initialize scroll state after first render
  useEffect(() => {
    updateScrollState();
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, dir: "left" | "right") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scroll(dir);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`latest-stories-section mb-10 text-slate-100 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        }`}
      aria-labelledby="latest-posts-heading"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="latest-stories-badge" aria-hidden="true">
              <Sparkles className="h-3 w-3" />
              New
            </span>
          </div>
          <h2 id="latest-posts-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Latest Stories
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">Freshly published from our community</p>
        </div>

        {posts.length > 1 && (
          <div className="flex items-center gap-2 pt-1" aria-label="Carousel navigation">
            <button
              onClick={() => scroll("left")}
              onKeyDown={(e) => handleKeyDown(e, "left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              aria-disabled={!canScrollLeft}
              className="carousel-nav-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              onKeyDown={(e) => handleKeyDown(e, "right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              aria-disabled={!canScrollRight}
              className="carousel-nav-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel track */}
      {isLoading ? (
        <div className="flex gap-5 overflow-hidden pb-2">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="relative">
          {/* Left fade */}
          <div
            className="carousel-fade-left pointer-events-none transition-opacity duration-250"
            style={{ opacity: canScrollLeft ? 1 : 0 }}
            aria-hidden="true"
          />
          {/* Right fade */}
          <div
            className="carousel-fade-right pointer-events-none transition-opacity duration-250"
            style={{ opacity: canScrollRight ? 1 : 0 }}
            aria-hidden="true"
          />

          <div
            ref={trackRef}
            className="carousel-track"
            onScroll={updateScrollState}
            role="list"
            aria-label="Latest stories carousel"
            tabIndex={0}
          >
            {posts.map((post: Post, i: number) => (
              <div key={post._id} role="listitem">
                <StoryCard
                  post={post}
                  onClick={() => navigate(`/post/${post._id}`)}
                  index={i}
                />
              </div>
            ))}
          </div>

          {/* Scroll progress bar */}
          {posts.length > 1 && (
            <div
              className="latest-stories-progress-track mt-4"
              role="progressbar"
              aria-valuenow={Math.round(scrollProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Carousel scroll progress"
            >
              <div
                className="latest-stories-progress-fill"
                style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="story-panel rounded-xl px-6 py-10 text-center text-slate-400">
          <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p className="text-sm">No stories yet. Be the first to publish!</p>
        </div>
      )}
    </section>
  );
};

export default LatestPostsComponent;