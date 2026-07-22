import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Reset state whenever the image source changes
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();

    img.onload = () => {
      if (isMounted) {
        setIsLoaded(true);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setIsLoaded(true);
        setHasError(true);
      }
    };

    img.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div
      className={`lazy-image-container ${className || ''}`}
      style={{
        filter: isLoaded ? 'none' : 'blur(10px)',
        transition: 'filter 0.3s',
      }}
    >
      <img
        src={hasError ? '' : src}
        alt={alt}
        loading="lazy"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
        {...props}
      />
    </div>
  );
};

export default LazyImage;