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
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative flex w-full justify-center rounded-xl px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(99,102,241,0.22)]
        bg-gradient-to-r from-indigo-600 via-sky-500 to-purple-600
        hover:brightness-110 active:brightness-95
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300
        disabled:opacity-55 disabled:cursor-not-allowed
        transition-all duration-300
        before:absolute before:inset-0 before:rounded-xl
        before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]
        before:opacity-0 before:translate-x-[-40%] before:transition-all before:duration-700
        group-hover:before:opacity-100 group-hover:before:translate-x-[40%]
        ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};


export default SSButton;
