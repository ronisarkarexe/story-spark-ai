import { useEffect, useRef, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/theme.context";

const COOKIE_CONSENT_KEY = "storysparkai_cookie_consent";

type CookiePreferences = {
  saved: boolean;
  functional: boolean;
  analytics: boolean;
};

const DEFAULT_PREFERENCES: CookiePreferences = {
  saved: false,
  functional: false,
  analytics: false,
};

const loadCookiePreferences = (): CookiePreferences => {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const updateAppCookieState = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: preferences }));
};

const saveCookiePreferences = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
  updateAppCookieState(preferences);
};

type CookieConsentBannerProps = {
  onLayoutChange?: (height: number) => void;
};

const CookieConsentBanner: FC<CookieConsentBannerProps> = ({ onLayoutChange }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowBanner(!storedPreferences.saved);
  }, []);

  useEffect(() => {
    if (!showBanner) {
      onLayoutChange?.(0);
      return;
    }

    const updateLayout = () => {
      const banner = bannerRef.current;
      if (!banner) return;
      onLayoutChange?.(banner.getBoundingClientRect().height);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }
    window.addEventListener("resize", updateLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [onLayoutChange, showBanner]);

  if (!preferences || !showBanner) {
    return null;
  }

  const handleAcceptAll = () => {
    const updated = { saved: true, functional: true, analytics: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const handleRejectNonEssential = () => {
    const updated = { saved: true, functional: false, analytics: false };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const bannerClasses = isDark
    ? "fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-white/10 shadow-2xl backdrop-blur-xl text-white"
    : "fixed inset-x-0 bottom-0 z-50 bg-white/95 border-t border-slate-200 shadow-2xl backdrop-blur-xl text-slate-900";

  return (
    <div ref={bannerRef} className={bannerClasses}>
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <p className={`text-xs sm:text-sm leading-snug ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          🍪 We use cookies to improve your experience.{" "}
          <Link
            to="/cookie-policy"
            className="underline font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            Learn more
          </Link>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRejectNonEssential}
            className={
              isDark
                ? "px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                : "px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
            }
          >
            Decline
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;