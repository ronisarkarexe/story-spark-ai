import { useEffect, useRef, useState } from "react";

export function useAntiGravityScroll(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetSpeed, setTargetSpeed] = useState(1); // multiplier
  const currentVelocityRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleUserScroll = () => {
      // Passive listener to immediately interrupt auto-scrolling if user manually overrides
      setIsPlaying(false);
    };

    container.addEventListener("wheel", handleUserScroll, { passive: true });
    container.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleUserScroll);
      container.removeEventListener("touchmove", handleUserScroll);
    };
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const baseSpeed = 0.5; // base speed in pixels per frame
    const decayRate = 0.05; // linear friction decay per frame
    const acceleration = 0.05; // linear acceleration

    const scrollLoop = () => {
      if (isPlaying) {
        // Accelerate/Decelerate towards targeted speed
        const desiredSpeed = targetSpeed * baseSpeed;
        if (currentVelocityRef.current < desiredSpeed) {
          currentVelocityRef.current = Math.min(desiredSpeed, currentVelocityRef.current + acceleration);
        } else if (currentVelocityRef.current > desiredSpeed) {
          currentVelocityRef.current = Math.max(desiredSpeed, currentVelocityRef.current - decayRate);
        }
      } else {
        // Apply linear friction decay to slow down to 0
        if (currentVelocityRef.current > 0) {
          currentVelocityRef.current = Math.max(0, currentVelocityRef.current - decayRate);
        }
      }

      if (currentVelocityRef.current > 0) {
        container.scrollTop += currentVelocityRef.current;

        // Check if we reached the bottom
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        if (container.scrollTop >= maxScrollTop - 0.5) {
          setIsPlaying(false);
          currentVelocityRef.current = 0;
        }
      }

      // Request next frame if playing or still coasting
      if (isPlaying || currentVelocityRef.current > 0) {
        animationFrameIdRef.current = requestAnimationFrame(scrollLoop);
      } else {
        animationFrameIdRef.current = null;
      }
    };

    if (isPlaying || currentVelocityRef.current > 0) {
      if (animationFrameIdRef.current === null) {
        animationFrameIdRef.current = requestAnimationFrame(scrollLoop);
      }
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isPlaying, targetSpeed, containerRef]);

  return {
    isPlaying,
    setIsPlaying,
    targetSpeed,
    setTargetSpeed,
    currentVelocityRef,
  };
}

export default useAntiGravityScroll;
