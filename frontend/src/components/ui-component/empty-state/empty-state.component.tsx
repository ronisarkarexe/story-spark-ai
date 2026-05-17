import { FC, ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon = "fa-regular fa-folder-open",
  action,
  className = "",
}) => {
  return (
    <div
      role="status"
      className={`surface-card flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 text-indigo-400"
        aria-hidden="true"
      >
        <i className={`${icon} text-2xl`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
