import { useEffect, useState } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setProgress(isNaN(scrolled) ? 0 : scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '4px', 
          zIndex: 9999 
        }}
      >
        <div 
          style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
            transition: 'width 0.2s ease-out'
          }}
        />
      </div>
      
      {/* Floating percentage for mobile */}
      {progress > 0 && progress < 100 && (
        <div 
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '9999px',
            zIndex: 9999,
            fontFamily: 'monospace'
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
};

export default ReadingProgress;