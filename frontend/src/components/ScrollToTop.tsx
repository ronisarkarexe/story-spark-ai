import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Snaps the window to the top immediately on route changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Standardizes immediate jumping for new pages
      });
    } catch {
      // Fallback fallback for older browsers/mobile webviews that don't support options objects
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
