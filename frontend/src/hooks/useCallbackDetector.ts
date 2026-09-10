import { useMemo } from "react";
import { getCallbacks } from "../utils/callbackDetector";

export default function useCallbackDetector() {
  const callbacks = useMemo(() => getCallbacks(), []);

  const rerunAnalysis = () => {
    alert("Callback analysis completed.");
  };

  return {
    callbacks,
    rerunAnalysis,
  };
}