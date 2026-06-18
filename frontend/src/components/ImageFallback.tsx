
import { useState, useEffect } from "react";


interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

import fallbackImg from "../assets/storybook.png";

const FALLBACK = fallbackImg;

export default function ImageFallback({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
}: ImageFallbackProps) {
  // Sanitize src to prevent CodeQL DOM XSS alerts
  const isSafeSrc = typeof src === "string" ? /^(?:https?|ftp|mailto|tel|data):/i.test(src.trim()) || src.startsWith("/") : true;
  const initialSrc = (isSafeSrc ? src : null) || FALLBACK;

  const [imageSrc, setImageSrc] = useState(initialSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const safeUpdateSrc = typeof src === "string" ? /^(?:https?|ftp|mailto|tel|data):/i.test(src.trim()) || src.startsWith("/") : true;
    setImageSrc((safeUpdateSrc ? src : null) || FALLBACK);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setImageSrc(FALLBACK);
    setIsLoading(false);
    setHasError(true);
  };

  if (!src && hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 text-zinc-500 ${className}`}
        style={{ aspectRatio }}
      >
        <div className="text-center">
          <i className="fas fa-image text-2xl mb-1 block"></i>
          <span className="text-xs">No image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center rounded-inherit">
          <i className="fas fa-image text-zinc-600 text-xl"></i>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}