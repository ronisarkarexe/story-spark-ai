import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (isMounted) setIsLoaded(true);
    };
    img.onerror = () => {
      if (isMounted) {
        setIsLoaded(true);
        setHasError(true);
      }
    };

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