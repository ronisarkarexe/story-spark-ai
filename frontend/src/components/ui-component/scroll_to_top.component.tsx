import React, { useState, useEffect } from "react";

interface ScrollToTopProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const ScrollToTopComponent: React.FC<ScrollToTopProps> = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const scrollY = containerRef?.current ? containerRef.current.scrollTop : window.scrollY;
    if (scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const target = containerRef?.current ? containerRef.current : window;
    target.addEventListener("scroll", toggleVisibility as any, { passive: true });
    return () => {
      target.removeEventListener("scroll", toggleVisibility as any);
    };
  }, [containerRef]);

  return (
    <div className={`fixed bottom-8 right-8 z-50`}>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`
          group p-3 rounded-full bg-blue-600/30 text-white 
          backdrop-blur-md border border-white/10 shadow-lg 
          transition-all duration-300 transform
          hover:bg-blue-600/50 hover:scale-110 active:scale-95
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        `}
      >
        <i className="fas fa-chevron-up text-lg transition-transform group-hover:-translate-y-1"></i>
      </button>
    </div>
  );
};

export default ScrollToTopComponent;
