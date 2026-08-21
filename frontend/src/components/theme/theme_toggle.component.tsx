import React, { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme.context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { flushSync } from "react-dom";

import logger from "../../utils/logger.util";
const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        {
          rotation: isDark ? -180 : 180,
          scale: 0.2,
          opacity: 0,
        },
        {
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isDark]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };
    
    // Check if the browser supports View Transitions API and user respects motion
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDarkCurrent = isDark;
    
    // Add a class for scoping theme transition styles
    document.documentElement.classList.add("theme-transitioning");

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    // Complete the animation logic that was missing
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      
      document.documentElement.animate(
        {
          clipPath: isDarkCurrent ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDarkCurrent
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    }).catch((err) => logger.error(err));

    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-transitioning");
    });
  };

  // Return the actual button UI using the imported icons
  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors z-50 relative"
      aria-label="Toggle theme"
    >
      <div ref={iconRef}>
        {isDark ? <Moon size={24} /> : <Sun size={24} />}
      </div>
    </button>
  );
};

export default ThemeToggle;