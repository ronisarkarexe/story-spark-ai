import { useEffect, useRef, useState } from "react";
import { MousePointer2, Sparkles, Wind, X } from "lucide-react";
import { CURSOR_STYLES, useTheme, type CursorStyle } from "./theme.context";

const STYLE_ICONS: Record<CursorStyle, typeof Sparkles> = {
  off: X,
  sparkle: Sparkles,
  "glow-orb": MousePointer2,
  trail: Wind,
};

const CursorStylePicker = () => {
  const { cursorStyle, setCursorStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const ActiveIcon = STYLE_ICONS[cursorStyle];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
          cursorStyle !== "off"
            ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
            : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
        }`}
        title="Cursor style"
        aria-label="Choose cursor style"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ActiveIcon className="h-[18px] w-[18px]" strokeWidth={2.5} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 py-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
        >
          {CURSOR_STYLES.map(({ value, label }) => {
            const Icon = STYLE_ICONS[value];
            const isActive = value === cursorStyle;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setCursorStyle(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CursorStylePicker;
