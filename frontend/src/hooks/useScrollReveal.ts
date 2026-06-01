import { useEffect, useLayoutEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger if it hasn't been registered yet
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Ensure compatibility with React 18 strict mode and server-side rendering
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ScrollRevealBatchOptions {
  /** The CSS selector for the elements to animate (e.g., '.story-card-reveal') */
  selector: string;
  /** Opacity to animate from (default: 0) */
  fromOpacity?: number;
  /** Y offset to animate from (default: 80) */
  fromY?: number;
  /** Scale to animate from (default: 0.95) */
  fromScale?: number;
  /** Stagger time between items in a batch (default: 0.15) */
  stagger?: number;
  /** Animation duration (default: 0.8) */
  duration?: number;
  /** Easing function (default: 'power3.out') */
  ease?: string;
  /** ScrollTrigger start position (default: 'top 80%') */
  start?: string;
}

export const useScrollRevealBatch = (
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollRevealBatchOptions,
  dependencies: any[] = []
) => {
  const {
    selector,
    fromOpacity = 0,
    fromY = 80,
    fromScale = 0.95,
    stagger = 0.15,
    duration = 0.8,
    ease = 'power3.out',
    start = 'top 80%',
  } = options;

  useIsomorphicLayoutEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !containerRef.current) {
      // For reduced motion, ensure elements are immediately visible
      if (prefersReducedMotion && containerRef.current) {
        const elements = containerRef.current.querySelectorAll(selector);
        gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
      }
      return;
    }

    // Use gsap.context for proper cleanup
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(selector, { 
        opacity: fromOpacity, 
        y: fromY, 
        scale: fromScale 
      });

      // Create batched ScrollTrigger
      ScrollTrigger.batch(selector, {
        start,
        // Play the animation only once
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger,
            duration,
            ease,
            overwrite: true,
          });
        },
      });
    }, containerRef); // Scope the selectors to the containerRef

    return () => {
      ctx.revert(); // Cleanup on unmount
    };
  }, [containerRef, selector, fromOpacity, fromY, fromScale, stagger, duration, ease, start, ...dependencies]);
};
