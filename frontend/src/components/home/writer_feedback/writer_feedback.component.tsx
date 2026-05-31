import { useRef, useState, useEffect } from "react";
import { Quote, Sparkles, Star } from "lucide-react";
import { useGetReviewsQuery } from "../../../redux/apis/review.api";
import { Review } from "../../../models/review";
import ReviewForm from "./ReviewForm";

const MOCK_WRITER_REVIEWS: Review[] = [
  {
    _id: "mock-r1",
    name: "Maya Chen",
    role: "Fantasy Author",
    feedback:
      "Story Spark AI transformed how I brainstorm. The collaborative rooms feel like a writers' cafe — inspiring, focused, and genuinely fun to create in.",
    imgSrc: "https://i.pravatar.cc/150?img=47",
    rating: 5,
  },
  {
    _id: "mock-r2",
    name: "James Okonkwo",
    role: "Short Story Writer",
    feedback:
      "I've tried many writing platforms, but none made feedback feel this personal. The community here actually reads your work and pushes you to grow.",
    imgSrc: "https://i.pravatar.cc/150?img=12",
    rating: 5,
  },
  {
    _id: "mock-r3",
    name: "Elena Rodriguez",
    role: "Poet & Essayist",
    feedback:
      "The AI assistant doesn't write for me — it helps me find my voice. That balance is rare, and it's why I keep coming back every single day.",
    imgSrc: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    _id: "mock-r4",
    name: "Arjun Patel",
    role: "Screenwriter",
    feedback:
      "From draft to publish, everything flows smoothly. The spotlight feature gave my work visibility I never expected on a new platform.",
    imgSrc: "https://i.pravatar.cc/150?img=15",
    rating: 4,
  },
];

const ACCENT_COLORS = [
  { from: "#6366f1", glow: "rgba(99, 102, 241, 0.35)" },
  { from: "#8b5cf6", glow: "rgba(139, 92, 246, 0.35)" },
  { from: "#06b6d4", glow: "rgba(6, 182, 212, 0.35)" },
  { from: "#f59e0b", glow: "rgba(245, 158, 11, 0.35)" },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialCard = ({ review, index }: { review: Review; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const rating = review.rating ?? 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <article
      className="writer-testimonial-card group"
      style={{ animationDelay: `${index * 90}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="writer-testimonial-accent"
        style={{ background: `linear-gradient(90deg, ${accent.from}, transparent)` }}
      />
      <div
        className="writer-testimonial-glow"
        style={{
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${accent.glow}, transparent 65%)`,
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="writer-testimonial-inner">
        <Quote
          className="writer-testimonial-quote-icon mb-4 h-8 w-8"
          style={{ color: accent.from }}
          aria-hidden="true"
        />

        <StarRating rating={rating} />

        <blockquote className="writer-testimonial-text mt-4 line-clamp-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          &ldquo;{review.feedback}&rdquo;
        </blockquote>

        <footer className="writer-testimonial-author mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-5 dark:border-slate-700/50">
          <div
            className="writer-testimonial-avatar-ring shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent.from}, transparent)` }}
          >
            <img
              className="h-11 w-11 rounded-full object-cover"
              src={review.imgSrc}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{review.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
          </div>
        </footer>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <div className="writer-testimonial-card animate-pulse" aria-hidden="true">
    <div className="writer-testimonial-inner space-y-4">
      <div className="h-8 w-8 rounded-lg bg-slate-700/40" />
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3.5 w-3.5 rounded bg-slate-700/35" />
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3.5 w-full rounded bg-slate-700/40" />
        <div className="h-3.5 w-5/6 rounded bg-slate-700/35" />
        <div className="h-3.5 w-4/6 rounded bg-slate-700/30" />
      </div>
      <div className="flex items-center gap-3 border-t border-slate-700/30 pt-5">
        <div className="h-11 w-11 rounded-full bg-slate-700/45" />
        <div className="space-y-2">
          <div className="h-3.5 w-24 rounded bg-slate-700/40" />
          <div className="h-3 w-16 rounded bg-slate-700/30" />
        </div>
      </div>
    </div>
  </div>
);

const WriterFeedbackComponent = () => {
  const { data: feedbackData = [], isLoading, isError } = useGetReviewsQuery({});
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const reviews = isError || !feedbackData.length ? MOCK_WRITER_REVIEWS : feedbackData;

  const averageRating = (
    reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length
  ).toFixed(1);

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
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`writer-feedback-section story-section transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      }`}
      aria-labelledby="writer-feedback-heading"
    >
      <div className="story-page-shell">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="mb-3 flex justify-center">
            <span className="writer-feedback-badge" aria-hidden="true">
              <Sparkles className="h-3 w-3" />
              Community Voices
            </span>
          </div>
          <h2 id="writer-feedback-heading" className="story-section-heading">
            What Our Writers Say
          </h2>
          <p className="story-section-copy mt-3">
            Real stories from creators who found their spark here — and kept writing.
          </p>

          {!isLoading && (
            <div className="writer-feedback-stats mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="writer-feedback-stat">
                <span className="writer-feedback-stat-value">{reviews.length}+</span>
                <span className="writer-feedback-stat-label">Writer voices</span>
              </div>
              <div className="writer-feedback-stat-divider" aria-hidden="true" />
              <div className="writer-feedback-stat">
                <span className="writer-feedback-stat-value">{averageRating}</span>
                <span className="writer-feedback-stat-label">Average rating</span>
              </div>
            </div>
          )}
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            {reviews.map((review: Review, i: number) => (
              <TestimonialCard key={review._id ?? review.name} review={review} index={i} />
            ))}
          </div>
        )}

        <ReviewForm />
      </div>
    </section>
  );
};

export default WriterFeedbackComponent;
