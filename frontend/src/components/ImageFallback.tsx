import { useState, useEffect } from "react";

interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
}

const FALLBACK =
  "https://placehold.co/800x400/png?text=Story+Image";

export default function ImageFallback({
  src,
  alt,
  className,
}: ImageFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK);

  useEffect(() => {
    setImageSrc(src || FALLBACK);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(FALLBACK)}
    />
  );
}