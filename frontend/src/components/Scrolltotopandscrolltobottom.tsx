import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function DualScrollButton() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setScrollY(currentScroll);
      setVisible(currentScroll > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (scrollY < 300) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const isBottomMode = scrollY < 300;

  return (
    <button
      onClick={handleClick}
      aria-label={isBottomMode ? "Scroll to bottom" : "Scroll to top"}
      title={isBottomMode ? "Scroll to bottom" : "Scroll to top"}
      className={`
       fixed bottom-28 right-6 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        text-white
        border border-white/10
        backdrop-blur-md
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:scale-110
        active:scale-95
        ${
          isBottomMode
            ? "bg-gradient-to-br from-cyan-500 to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(59,130,246,0.65)]"
            : "bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(217,70,239,0.65)]"
        }
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
    >
      <div className="transition-transform duration-300">
        {isBottomMode ? <ArrowDown size={24} /> : <ArrowUp size={24} />}
      </div>
    </button>
  );
}
