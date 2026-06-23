import React from "react";

type SkeletonVariant = "default" | "featured" | "home-featured";

interface SkeletonCardProps {
  variant?: SkeletonVariant;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = "default" }) => {
  if (variant === "featured") {
    return (
      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-3xl border border-slate-200 h-[400px] flex flex-col justify-end p-8 dark:border-slate-700/50"
      >
        <div className="absolute inset-0 skeleton-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-900/60 dark:to-transparent" />
        <div className="h-9 skeleton-shimmer rounded-lg w-2/3 mb-3 relative z-10" />
        <div className="space-y-2 mb-6 relative z-10">
          <div className="h-4 skeleton-shimmer rounded-lg w-full" />
          <div className="h-4 skeleton-shimmer rounded-lg w-5/6" />
        </div>
        <div className="flex items-center pt-4 border-t border-slate-200 dark:border-white/10 relative z-10 w-full">
          <div className="h-7 w-20 skeleton-shimmer rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "home-featured") {
    return (
      <div
        aria-hidden="true"
        className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/40 flex flex-col bg-blue-500/10"
      >
        <div className="relative h-48 w-full skeleton-shimmer" />
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full skeleton-shimmer" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 skeleton-shimmer rounded w-1/3" />
              <div className="h-3 skeleton-shimmer rounded w-1/4" />
            </div>
          </div>
          <div className="h-5 skeleton-shimmer rounded-lg w-3/4 mb-3" />
          <div className="space-y-2 mb-4 flex-1">
            <div className="h-3 skeleton-shimmer rounded w-full" />
            <div className="h-3 skeleton-shimmer rounded w-5/6" />
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4">
            <div className="flex gap-4">
              <div className="h-4 w-10 skeleton-shimmer rounded" />
              <div className="h-4 w-10 skeleton-shimmer rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-4 w-4 skeleton-shimmer rounded" />
              <div className="h-4 w-4 skeleton-shimmer rounded" />
              <div className="h-4 w-4 skeleton-shimmer rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="border border-slate-200/60 shadow-lg rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] dark:border-white/5 dark:shadow-2xl"
    >
      <div className="relative aspect-video skeleton-shimmer">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-[#03050C] opacity-60" />
        <div className="absolute top-6 left-6 h-7 w-20 skeleton-shimmer rounded-full" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 skeleton-shimmer rounded-lg w-3/4 mb-4" />
        <div className="space-y-3 mb-8 flex-1">
          <div className="h-3.5 skeleton-shimmer rounded-lg w-full" />
          <div className="h-3.5 skeleton-shimmer rounded-lg w-full" />
          <div className="h-3.5 skeleton-shimmer rounded-lg w-5/6" />
        </div>
        <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-full skeleton-shimmer" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 skeleton-shimmer rounded-md w-1/3" />
            <div className="h-2 skeleton-shimmer rounded-md w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  variant?: SkeletonVariant;
  columns?: string;
}

const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  variant = "default",
  columns,
}) => {
  const gridCols =
    columns ||
    (variant === "featured" || variant === "home-featured"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8");

  return (
    <div
      role="status"
      aria-label="Loading stories"
      aria-busy="true"
      className={gridCols}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonGrid };
export default SkeletonCard;
