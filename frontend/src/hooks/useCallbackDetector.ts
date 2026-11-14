import { useCallback, useMemo } from "react";
import { getCallbacks, type CallbackItem } from "../utils/callbackDetector";

export interface UseCallbackDetectorOptions {
  onComplete?: () => void;
}

export interface UseCallbackDetectorReturn {
  callbacks: CallbackItem[];
  rerunAnalysis: () => void;
}

export default function useCallbackDetector(
  options: UseCallbackDetectorOptions = {}
): UseCallbackDetectorReturn {
  const { onComplete } = options;

  const callbacks = useMemo(() => getCallbacks(), []);

  const rerunAnalysis = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return {
    callbacks,
    rerunAnalysis,
  };
}