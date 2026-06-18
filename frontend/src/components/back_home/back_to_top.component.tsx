import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isNearBottom =
  window.innerHeight + window.scrollY >=
  document.documentElement.scrollHeight - 200;

  if (!isVisible || isNearBottom) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-82 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-indigo-500/40 hover:shadow-xl"
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;
