import React from "react";

interface DiffHighlightProps {
  text: string;
  type: "added" | "removed" | "neutral";
}

const DiffHighlight: React.FC<DiffHighlightProps> = ({ text, type }) => {
  const getStyles = () => {
    switch (type) {
      case "added":
        return "bg-green-200/50 dark:bg-green-900/40 text-green-900 dark:text-green-200 border-l-2 border-green-500";
      case "removed":
        return "bg-red-200/50 dark:bg-red-900/40 text-red-900 dark:text-red-200 line-through border-l-2 border-red-500";
      default:
        return "";
    }
  };

  return (
    <span className={`px-1 py-0.5 rounded transition-all ${getStyles()}`}>
      {text}
    </span>
  );
};

export default DiffHighlight;
