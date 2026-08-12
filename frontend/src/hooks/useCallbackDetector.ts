import { useMemo } from "react";
import { getCallbacks } from "../utils/callbackDetector";

interface UseCallbackDetectorOptions {
  onComplete?: () => void;
}

export default function useCallbackDetector(options: UseCallbackDetectorOptions = {}) {
  const { onComplete } = options;

  const callbacks = useMemo(() => getCallbacks(), []);

  const rerunAnalysis = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return {
    callbacks,
    rerunAnalysis,
  };
}
