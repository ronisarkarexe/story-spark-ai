import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fabBase = [
  "w-[46px] h-[46px] rounded-full",
  "flex items-center justify-center cursor-pointer",
  "bg-white/80 backdrop-blur-[12px]",
  "border border-indigo-500/15 text-indigo-500",
  "shadow-[0_10px_25px_-5px_rgba(99,102,241,0.15),0_8px_16px_-6px_rgba(99,102,241,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]",
  "transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
  "hover:bg-white/95 hover:border-indigo-500/40 hover:text-indigo-600",
  "hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.25),0_0_12px_2px_rgba(99,102,241,0.15)]",
  "hover:-translate-y-0.5",
  "active:translate-y-px active:scale-95",
  "active:shadow-[0_4px_12px_-5px_rgba(99,102,241,0.2),0_0_4px_1px_rgba(99,102,241,0.05)]",
  "dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.75)_0%,rgba(30,27,75,0.65)_100%)]",
  "dark:border-violet-500/30 dark:text-purple-400",
  "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_1px_rgba(139,92,246,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
  "dark:hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.9)_0%,rgba(49,46,129,0.8)_100%)]",
  "dark:hover:border-violet-400/60 dark:hover:text-purple-200",
  "dark:hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.6),0_0_22px_4px_rgba(139,92,246,0.4)]",
  "dark:active:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.5),0_0_8px_1px_rgba(139,92,246,0.15)]",
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  "dark:focus:ring-violet-400 dark:focus:ring-offset-slate-900",
].join(" ");

const iconBase =
  "transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] stroke-[2.5px]";

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
      <AnimatePresence mode="popLayout">
        {showTop && (
          <motion.button
            key="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`${fabBase} group`}
          >
            <ChevronUp className={`${iconBase} group-hover:-translate-y-[3px]`} size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {showBottom && (
          <motion.button
            key="scroll-to-bottom"
            initial={{ opacity: 0, scale: 0.8, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className={`${fabBase} group`}
          >
            <ChevronDown className={`${iconBase} group-hover:translate-y-[3px]`} size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollFAB;
