import { useState, useCallback } from "react";

interface UseApiErrorReturn {
  error: string | null;
  setError: (message: string) => void;
  clearError: () => void;
}

export function useApiError(): UseApiErrorReturn {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((message: string) => {
    setErrorState(message);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return { error, setError, clearError };
}