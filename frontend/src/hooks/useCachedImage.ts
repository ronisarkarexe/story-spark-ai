import { useState, useEffect } from "react";
import { getCachedImageUrl } from "../utils/imageCache";

/**
 * Custom React hook to resolve a remote image URL to a local cached blob URL.
 * Automatically manages state, sets loading flags, and handles unmounting checks.
 */
export function useCachedImage(src?: string) {
  const [cachedSrc, setCachedSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setCachedSrc(undefined);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getCachedImageUrl(src)
      .then((url) => {
        if (isMounted) {
          setCachedSrc(url);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCachedSrc(src);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return { cachedSrc, isLoading };
}
