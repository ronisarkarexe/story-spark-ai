
import { useState, useEffect, useRef } from "react";


interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const FALLBACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNDAwJyB2aWV3Qm94PScwIDAgODAwIDQwMCc+PHJlY3Qgd2lkdGg9JzgwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyMzNzQxNTEnLz48dGV4dCB4PSc0MDAnIHk9JzIwMCcgZm9udC1mYW1pbHk9J3NhbnMtc2VyaWYnIGZvbnQtc2l6ZT0nMjQnIGZpbGw9JyM5Q0EzQUYnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnPlN0b3J5IEltYWdlPC90ZXh0Pjwvc3ZnPg==";
  

export default function ImageFallback({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
}: ImageFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}