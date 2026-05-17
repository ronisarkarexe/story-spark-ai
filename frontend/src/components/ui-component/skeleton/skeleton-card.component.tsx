import { FC } from "react";

interface SkeletonCardProps {
  count?: number;
  className?: string;
}

const SkeletonCard: FC<SkeletonCardProps> = ({ count = 2, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="surface-card overflow-hidden"
          aria-hidden="true"
        >
          <div className="skeleton-shimmer h-40 w-full" />
          <div className="space-y-3 p-5">
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-3 w-5/6 rounded" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default SkeletonCard;
