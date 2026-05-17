import { FC } from "react";
import SkeletonCard from "../ui-component/skeleton/skeleton-card.component";

interface LoadingAnimationProps {
  variant?: "fullscreen" | "section" | "skeleton";
  label?: string;
  skeletonCount?: number;
}

const LoadingAnimation: FC<LoadingAnimationProps> = ({
  variant = "fullscreen",
  label = "Loading",
  skeletonCount = 2,
}) => {
  if (variant === "skeleton") {
    return <SkeletonCard count={skeletonCount} />;
  }

  const wrapClass =
    variant === "fullscreen"
      ? "flex min-h-screen items-center justify-center"
      : "flex min-h-[12rem] items-center justify-center py-12";

  return (
    <div
      className={wrapClass}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400"
          aria-hidden="true"
        />
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingAnimation;
