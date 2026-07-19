import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Only execute if a frame isn't already waiting to be painted
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 200);
          ticking = false;
        });
        ticking = true;
      }
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
        fixed bottom-28 right-6 lg:bottom-24
        w-14 h-14 rounded-full
        border-none cursor-pointer
        bg-gradient-to-br from-blue-500 to-indigo-500
        text-white text-xl
        flex items-center justify-center
        shadow-[0_4px_15px_rgba(59,130,246,0.4)]
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-[0_6px_22px_rgba(59,130,246,0.6)]
        active:scale-95
        z-[9999]
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
        }
      `}
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTopButton;
