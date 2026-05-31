import React from "react";
import ImageFallback from "../../ImageFallback";
ImageFallback
type SSProfileProps = {
  name: string;
  imageUrl?: string;
  size?: string;
};

const SSProfile: React.FC<SSProfileProps> = ({
  name,
  imageUrl,
  size = "h-16 w-16",
}) => {
  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const textSize = size.includes("h-8") ? "text-xs" : size.includes("h-12") ? "text-sm" : "text-lg";
  return (
    <div
      className={`rounded-full flex items-center justify-center text-slate-700 dark:text-gray-300 text-lg font-bold overflow-hidden border border-gray-500 ${size} ${textSize}`}
    >
      {imageUrl ? (
          <ImageFallback
              className="h-full w-full object-cover"
              src={imageUrl}
              alt={name}
            />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default SSProfile;
