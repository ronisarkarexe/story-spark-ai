import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/theme.context";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  hue: number;
  lifetime: number;
};

const MAX_SPARKLES = 14;
const BASE_LIFETIME = 900;
// Hue spread: blue ΓåÆ indigo ΓåÆ violet ΓåÆ pink ΓåÆ sky
const SPARKLE_HUES = [210, 230, 250, 270, 290, 310, 195];

const MagicCursorComponent = () => {
  const { glowEnabled } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Refs for DOM elements
  const dotRef = useRef<HTMLDivElement | null>(null);
  const innerGlowRef = useRef<HTMLDivElement | null>(null);
  const outerHaloRef = useRef<HTMLDivElement | null>(null);

  // Cursor tracking
  const target = useRef({ x: -200, y: -200 });
  const dotCurrent = useRef({ x: -200, y: -200 });
  const glowCurrent = useRef({ x: -200, y: -200 });
  const haloCurrent = useRef({ x: -200, y: -200 });

  // Sparkle tracking
  const lastSparkle = useRef({ x: 0, y: 0, time: 0 });
  const nextId = useRef(1);
  const nextHueIdx = useRef(0);

  // Frame and timer refs
  const frameId = useRef<number | null>(null);
  const sparkleTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Detect pointer capability and reduced-motion preference
  useEffect(() => {
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const check = () => setEnabled(pointerMq.matches && !motionMq.matches);
    check();

    pointerMq.addEventListener("change", check);
    motionMq.addEventListener("change", check);
    return () => {
      pointerMq.removeEventListener("change", check);
      motionMq.removeEventListener("change", check);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
      setSparkles([]);
      return;
    }

    // ΓöÇΓöÇ Spawn a sparkle at (x, y) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const addSparkle = (x: number, y: number, burst = false) => {
      const id = nextId.current++;
      const hue = SPARKLE_HUES[nextHueIdx.current % SPARKLE_HUES.length];
      nextHueIdx.current++;
      const lifetime = burst
        ? BASE_LIFETIME * (0.7 + Math.random() * 0.6)
        : BASE_LIFETIME;

      const sparkle: Sparkle = {
        id,
        x: x + (burst ? (Math.random() - 0.5) * 18 : 0),
        y: y + (burst ? (Math.random() - 0.5) * 18 : 0),
        size: burst ? 7 + Math.random() * 8 : 5 + Math.random() * 7,
        delay: Math.random() * 80,
        hue,
        lifetime,
      };

      setSparkles((prev) => [...prev.slice(-(MAX_SPARKLES - 1)), sparkle]);

      const timer = setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
        sparkleTimers.current = sparkleTimers.current.filter((t) => t !== timer);
      }, lifetime + sparkle.delay);

      sparkleTimers.current.push(timer);
    };

    // ΓöÇΓöÇ Pointer move handler ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const onPointerMove = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const isTyping =
        el.tagName === "TEXTAREA" ||
        el.tagName === "INPUT" ||
        el.isContentEditable;
      if (isTyping) return;

      target.current = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - lastSparkle.current.x;
      const dy = e.clientY - lastSparkle.current.y;
      const dist = Math.hypot(dx, dy);
      const now = performance.now();

      if (dist > 26 && now - lastSparkle.current.time > 70) {
        addSparkle(e.clientX, e.clientY);
        lastSparkle.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    // ΓöÇΓöÇ Click burst ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const onPointerDown = (e: PointerEvent) => {
      for (let i = 0; i < 4; i++) addSparkle(e.clientX, e.clientY, true);
    };

    // ΓöÇΓöÇ rAF animation loop ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const animate = () => {
      // Dot: fast, snappy (lerp factor 0.28)
      dotCurrent.current.x += (target.current.x - dotCurrent.current.x) * 0.28;
      dotCurrent.current.y += (target.current.y - dotCurrent.current.y) * 0.28;

      // Inner glow: medium lag (lerp 0.14)
      glowCurrent.current.x += (target.current.x - glowCurrent.current.x) * 0.14;
      glowCurrent.current.y += (target.current.y - glowCurrent.current.y) * 0.14;

      // Outer halo: slowest, dreamiest lag (lerp 0.07)
      haloCurrent.current.x += (target.current.x - haloCurrent.current.x) * 0.07;
      haloCurrent.current.y += (target.current.y - haloCurrent.current.y) * 0.07;

      const setPos = (
        el: HTMLDivElement | null,
        x: number,
        y: number,
        offsetX: number,
        offsetY: number
      ) => {
        if (!el) return;
        el.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0)`;
      };

      setPos(dotRef.current, dotCurrent.current.x, dotCurrent.current.y, 5, 5);
      setPos(innerGlowRef.current, glowCurrent.current.x, glowCurrent.current.y, 28, 28);
      setPos(outerHaloRef.current, haloCurrent.current.x, haloCurrent.current.y, 80, 80);

      frameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    frameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      if (frameId.current) cancelAnimationFrame(frameId.current);
      sparkleTimers.current.forEach(clearTimeout);
      sparkleTimers.current = [];
    };
  }, [enabled]);

  // Hide when typing or glow is toggled off
  const isTyping =
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement;

  if (!enabled || isTyping || !glowEnabled) return null;

  return (
    <div className="magic-cursor-layer" aria-hidden="true">
      {/* Outer ambient halo ΓÇö slowest, largest */}
      <div
        ref={outerHaloRef}
        className="magic-cursor-outer-halo"
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
      />
      {/* Inner glow ring ΓÇö medium lag */}
      <div
        ref={innerGlowRef}
        className="magic-cursor-glow"
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
      />
      {/* Precision dot ΓÇö snappiest */}
      <div
        ref={dotRef}
        className="magic-cursor-dot"
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
      />
      {/* Sparkle trail */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="magic-cursor-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}ms`,
            animationDuration: `${s.lifetime}ms`,
            "--sparkle-hue": s.hue,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default MagicCursorComponent;
