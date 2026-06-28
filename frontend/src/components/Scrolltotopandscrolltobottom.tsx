import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const DEFAULT_BOTTOM = "1.5rem"; // resting position

export default function DualScrollButton() {
  const [, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(DEFAULT_BOTTOM);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  // Track scroll position and visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      setVisible(currentScroll > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

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
        // Push the button up by the visible footer height + a small gap (16 px)
        setBottomOffset(`${visibleFooterHeight + 16}px`);
      } else {
        setBottomOffset(DEFAULT_BOTTOM);
      }
    };

    window.addEventListener("scroll", recalculate, { passive: true });
    window.addEventListener("resize", recalculate, { passive: true });
    recalculate();

    // Also observe footer visibility changes
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

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: bottomOffset,
        right: "1.5rem",
        transition: "bottom 0.25s ease, opacity 0.3s ease, transform 0.3s ease",
        zIndex: 50,
      }}
      className={`flex items-center gap-4 transition-all duration-300 ease-in-out ${visible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <button
        onClick={handleScrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
        className="
          flex items-center justify-center
          w-14 h-14 rounded-full
          text-white
          border border-white/10
          backdrop-blur-md
          shadow-lg
          transition-all duration-300 ease-in-out
          hover:scale-110
          active:scale-95
          bg-gradient-to-br from-cyan-500 to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(59,130,246,0.65)]
        "
      >
        <div className="transition-transform duration-300">
          <ArrowDown size={24} />
        </div>
      </button>

      <button
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className="
          flex items-center justify-center
          w-14 h-14 rounded-full
          text-white
          border border-white/10
          backdrop-blur-md
          shadow-lg
          transition-all duration-300 ease-in-out
          hover:scale-110
          active:scale-95
          bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(217,70,239,0.65)]
        "
      >
        <div className="transition-transform duration-300">
          <ArrowUp size={24} />
        </div>
      </button>
    </div>
  );
}
