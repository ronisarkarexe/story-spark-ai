import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  // 1. Reset the loading state whenever a new src is provided
  setIsLoaded(false); 

  const img = new Image();
  img.src = src;
  
  img.onload = () => {
    setIsLoaded(true);
  };

  // 2. Cleanup function to prevent memory leaks
  return () => {
    img.onload = null; // Detaches the listener
  };
}, [src]);

  return (
    <div className={`lazy-image-container ${className || ''}`} style={{ filter: isLoaded ? 'none' : 'blur(10px)', transition: 'filter 0.3s' }}>
      <img src={src} alt={alt} loading="lazy" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
};

export default LazyImage;
