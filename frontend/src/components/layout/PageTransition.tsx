import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const pageVariants = {
  initial: (reducedMotion: boolean) => ({
    opacity: reducedMotion ? 1 : 0,
    y: reducedMotion ? 0 : 8,
  }),
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: (reducedMotion: boolean) => ({
    opacity: reducedMotion ? 1 : 0,
    y: reducedMotion ? 0 : -8,
  }),
};

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "flex-grow min-h-0",
}) => {
  const { pathname } = useLocation();
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        custom={shouldReduceMotion}
        initial={shouldReduceMotion ? false : "initial"}
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
