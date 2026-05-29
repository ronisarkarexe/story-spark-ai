import React, { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme.context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { flushSync } from "react-dom";

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => { ready: Promise<void> };
};

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
    const doc = document as ViewTransitionDocument;

    // Check if the browser supports View Transitions API and user respects motion
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={handleToggle}
      className="rounded-full p-2 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-all duration-300 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <div ref={iconRef}>
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
