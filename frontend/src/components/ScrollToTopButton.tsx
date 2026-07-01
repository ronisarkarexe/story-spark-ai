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
      className={`
        fixed bottom-28 right-6 lg:bottom-6
        w-14 h-14 rounded-full
        border-none cursor-pointer
        bg-gradient-to-br from-blue-500 to-indigo-500
        text-white text-xl
        flex items-center justify-center
        shadow-[0_4px_15px_rgba(59,130,246,0.4)]
        transition-all duration-300 ease-in-out
        z-[9999]
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
        }
      `}

    >
    </button>
  );
};

export default ScrollToTopButton;
