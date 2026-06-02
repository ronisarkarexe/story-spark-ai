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
      className={`motion-cta flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs shadow-indigo-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
      } disabled:opacity-60 ${className}`}
      disabled={isDisabled}
      aria-busy={isLoading}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default SSButton;
