import { useMemo } from "react";
import { getCallbacks } from "../utils/callbackDetector";

interface UseCallbackDetectorOptions {
  onComplete?: () => void;
}

export default function useCallbackDetector(options?: UseCallbackDetectorOptions) {
  const callbacks = useMemo(() => getCallbacks(), []);

  const rerunAnalysis = () => {
    options?.onComplete?.();
  };

  return {
    callbacks,
    rerunAnalysis,
  };
}