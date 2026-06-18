import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div className={`lazy-image-container ${className || ''}`} style={{ filter: isLoaded ? 'none' : 'blur(10px)', transition: 'filter 0.3s' }}>
      <img src={src} alt={alt} loading="lazy" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
};

export default LazyImage;
