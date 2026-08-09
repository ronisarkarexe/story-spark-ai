import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/theme.context";
import "./magic_cursor.css";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const MAX_SPARKLES = 20;
const SPARKLE_LIFETIME = 600;
const MAX_TRAIL_PARTICLES = 14;
const TRAIL_PARTICLE_LIFETIME = 420;

const MagicCursorComponent = () => {
  const { cursorStyle } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const nextSparkleId = useRef(0);
  const sparkleTimers = useRef<number[]>([]);
  const frameId = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const lastSparkle = useRef({ x: 0, y: 0, time: 0 });

  const showSparkles = cursorStyle === "sparkle";
  const showTrail = cursorStyle === "trail";
  const isPremiumGlow = cursorStyle === "glow-orb";

  // Check device capabilities (only enable magic cursor on devices with pointer capability and no reduced motion)
  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAvailability = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    updateAvailability();
    pointerQuery.addEventListener("change", updateAvailability);
    motionQuery.addEventListener("change", updateAvailability);

    return () => {
      pointerQuery.removeEventListener("change", updateAvailability);
      motionQuery.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!enabled || cursorStyle === "off") {
      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
      setSparkles([]);
      return;
    }

    const addParticle = (x: number, y: number, lifetime: number, cap: number) => {
      const id = nextSparkleId.current++;
      const particle = {
        id,
        x,
        y,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 90,
      };

      setSparkles((items) => [...items.slice(-(cap - 1)), particle]);

      const timerId = window.setTimeout(() => {
        setSparkles((items) => items.filter((item) => item.id !== id));
        sparkleTimers.current = sparkleTimers.current.filter((t) => t !== timerId);
      }, lifetime);

      sparkleTimers.current.push(timerId);
    };

    const addSparkle = (x: number, y: number) => addParticle(x, y, SPARKLE_LIFETIME, MAX_SPARKLES);
    const addTrailParticle = (x: number, y: number) =>
      addParticle(x, y, TRAIL_PARTICLE_LIFETIME, MAX_TRAIL_PARTICLES);

    const handlePointerMove = (event: PointerEvent) => {
      const targetElement = event.target as HTMLElement;

      const isTypingElement =
        targetElement.tagName === "TEXTAREA" ||
        targetElement.tagName === "INPUT" ||
        targetElement.isContentEditable;

      if (isTypingElement) {
        return;
      }

      target.current = { x: event.clientX, y: event.clientY };

      const dx = event.clientX - lastSparkle.current.x;
      const dy = event.clientY - lastSparkle.current.y;
      const distance = Math.hypot(dx, dy);
      const now = performance.now();

      if (showSparkles && distance > 30 && now - lastSparkle.current.time > 85) {
        addSparkle(event.clientX, event.clientY);
        lastSparkle.current = { x: event.clientX, y: event.clientY, time: now };
      } else if (showTrail && distance > 12 && now - lastSparkle.current.time > 35) {
        addTrailParticle(event.clientX, event.clientY);
        lastSparkle.current = { x: event.clientX, y: event.clientY, time: now };
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!showSparkles) return;
      addSparkle(event.clientX - 8, event.clientY + 4);
      addSparkle(event.clientX + 7, event.clientY - 6);
    };

    const animateCursor = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22;
      current.current.y += (target.current.y - current.current.y) * 0.22;

      const x = `${current.current.x}px`;
      const y = `${current.current.y}px`;

      cursorRef.current?.style.setProperty("--cursor-x", x);
      cursorRef.current?.style.setProperty("--cursor-y", y);
      glowRef.current?.style.setProperty("--cursor-x", x);
      glowRef.current?.style.setProperty("--cursor-y", y);

      frameId.current = window.requestAnimationFrame(animateCursor);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    frameId.current = window.requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);

      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
      sparkleTimers.current.forEach((t) => window.clearTimeout(t));
      sparkleTimers.current = [];
    };
  }, [enabled, cursorStyle, showSparkles, showTrail]);

  const isInputFocused =
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement;

  if (!enabled || isInputFocused || cursorStyle === "off") {
    return null;
  }

  return (
    <div className="magic-cursor-layer" aria-hidden="true">
      <div
        ref={glowRef}
        className={isPremiumGlow ? "magic-cursor-glow magic-cursor-glow-premium" : "magic-cursor-glow"}
      />
      <div ref={cursorRef} className="magic-cursor-dot" />
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className={showTrail ? "magic-cursor-trail-particle" : "magic-cursor-sparkle"}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default MagicCursorComponent;