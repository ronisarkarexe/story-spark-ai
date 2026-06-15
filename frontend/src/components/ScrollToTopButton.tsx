import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "#ffffff",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(59, 130, 246, 0.25)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(12px) scale(0.95)",
        transition: "all 0.3s ease",
        zIndex: 9999,
      }}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
