import { FC } from "react";

interface SSButtonProps {
  text: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const SSButton: FC<SSButtonProps> = ({
  text,
  isLoading = false,
  onClick,
  type = "button",
  className = "",
  disabled,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`motion-cta flex w-full h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
      } ${className}`}
      disabled={isDisabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default SSButton;