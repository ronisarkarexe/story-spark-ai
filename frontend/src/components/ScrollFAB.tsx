import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const ScrollFAB = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const atBottom =
        window.innerHeight + scrolled >= document.body.scrollHeight - 10;
      setShowTop(scrolled > 300);
      setShowBottom(!atBottom);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all duration-200"
        >
          <ArrowUp size={18} />
        </button>
      )}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all duration-200"
        >
          <ArrowDown size={18} />
        </button>
      )}
    </div>
  );
};

export default ScrollFAB;
