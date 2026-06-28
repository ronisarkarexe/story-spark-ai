import { useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 200;
const DEFAULT_BOTTOM = "1.5rem";   // resting position (above viewport bottom)
const BUTTON_SIZE = 56;            // px

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(DEFAULT_BOTTOM);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // sync on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Dynamically adjust bottom offset so the button clears the footer
  useEffect(() => {
    const recalculate = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // How many px of the footer are visible from the bottom of the viewport
      const visibleFooterHeight = Math.max(0, viewportHeight - footerRect.top);

      if (visibleFooterHeight > 0) {
        // Push the button up by the visible footer height + a small gap (16px)
        const safeBottom = visibleFooterHeight + 16;
        setBottomOffset(`${safeBottom}px`);
      } else {
        setBottomOffset(DEFAULT_BOTTOM);
      }
    };

    // Recalculate on scroll and resize
    window.addEventListener("scroll", recalculate, { passive: true });
    window.addEventListener("resize", recalculate, { passive: true });
    recalculate();

    // Also observe footer visibility changes via IntersectionObserver
    const footer = document.querySelector("footer");
    if (footer) {
      footerObserverRef.current = new IntersectionObserver(
        () => recalculate(),
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );
      footerObserverRef.current.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", recalculate);
      window.removeEventListener("resize", recalculate);
      footerObserverRef.current?.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: bottomOffset,
        right: "1.5rem",
        display: "flex",
        gap: "1rem",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease, bottom 0.25s ease",
        zIndex: 9980,
      }}
    >
      <button
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
        style={{
          width: `${BUTTON_SIZE}px`,
          height: `${BUTTON_SIZE}px`,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(6, 182, 212, 0.35)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        style={{
          width: `${BUTTON_SIZE}px`,
          height: `${BUTTON_SIZE}px`,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(59, 130, 246, 0.25)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;