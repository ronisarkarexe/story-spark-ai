
import { useState, useEffect, useRef } from "react";
import { useCachedImage } from "../hooks/useCachedImage";


interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const FALLBACK =
  "https://placehold.co/800x400/png?text=Story+Image";

export default function ImageFallback({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
}: ImageFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageSrc(src || FALLBACK);
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
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}