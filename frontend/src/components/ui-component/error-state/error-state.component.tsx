import { FC, ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}

const ErrorState: FC<ErrorStateProps> = ({
  title,
  description = "Something went wrong. Please try again.",
  onRetry,
  action,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`surface-card flex flex-col items-center justify-center border-red-500/20 px-6 py-12 text-center ${className}`}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"
        aria-hidden="true"
      >
        <i className="fa-solid fa-circle-exclamation text-2xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            Try again
          </button>
        )}
        {action}
      </div>
    </div>
  );
};

export default ErrorState;
