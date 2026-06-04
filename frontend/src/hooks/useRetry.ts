// frontend/src/hooks/useRetry.ts
import { useState, useCallback, useRef } from "react";

export interface UseRetryOptions {
  maxRetries?: number;
  baseDelay?: number; // ms, for exponential backoff
}

export interface UseRetryReturn {
  retryCount: number;
  isRetrying: boolean;
  isTimeout: boolean;
  countdown: number;       // seconds remaining before next retry allowed
  MAX_RETRIES: number;
  setIsTimeout: (v: boolean) => void;
  handleRetry: (triggerFn: () => void) => void;
  resetRetry: () => void;
}

export function useRetry({
  maxRetries = 3,
  baseDelay = 0,
}: UseRetryOptions = {}): UseRetryReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(
    (seconds: number, onDone: () => void) => {
      setCountdown(seconds);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            setCountdown(0);
            onDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    []
  );

  const handleRetry = useCallback(
    (triggerFn: () => void) => {
      // Prevent multiple simultaneous retries (issue requirement #4)
      if (isRetrying || countdown > 0) return;
      if (retryCount >= maxRetries) return;

      const nextCount = retryCount + 1;
      setRetryCount(nextCount);
      setIsTimeout(false);

      // Exponential backoff delay: 0s, 2s, 4s for retries 1, 2, 3
      const delaySeconds = baseDelay > 0 ? baseDelay * nextCount : 0;

      if (delaySeconds > 0) {
        setIsRetrying(false); // not retrying yet, counting down
        startCountdown(delaySeconds, () => {
          setIsRetrying(true);
          triggerFn();
        });
      } else {
        setIsRetrying(true);
        triggerFn();
      }
    },
    [isRetrying, countdown, retryCount, maxRetries, baseDelay, startCountdown]
  );

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
    setIsTimeout(false);
    setCountdown(0);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  return {
    retryCount,
    isRetrying,
    isTimeout,
    countdown,
    MAX_RETRIES: maxRetries,
    setIsTimeout,
    handleRetry,
    resetRetry,
  };
}
