import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollFAB = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const windowHeight = window.innerHeight;
      
      const atBottom = windowHeight + scrolled >= docHeight - 10;
      const nearBottom = windowHeight + scrolled >= docHeight - 95; // Trigger near the footer
      
      setShowTop(scrolled > 300);
      setShowBottom(!atBottom);
      setIsNearBottom(nearBottom);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <div className={`fixed right-6 flex flex-col gap-3 z-50 transition-all duration-300 ${isNearBottom ? "bottom-20" : "bottom-6"}`}>
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="scroll-fab-btn scroll-fab-btn-up"
          >
            <ChevronUp className="scroll-icon" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBottom && (
          <motion.button
            key="scroll-to-bottom"
            initial={{ opacity: 0, scale: 0.8, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="scroll-fab-btn scroll-fab-btn-down"
          >
            <ChevronDown className="scroll-icon" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollFAB;
