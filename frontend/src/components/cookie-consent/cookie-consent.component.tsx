import { useEffect, useState, type FC } from "react";
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
  // Kept for backward compatibility with RootLayout, which previously reserved
  // bottom padding for the old fixed banner. The modal no longer pushes layout,
  // so this is always called with 0.
  onLayoutChange?: (height: number) => void;
};

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  isDark: boolean;
};

const ToggleSwitch: FC<ToggleSwitchProps> = ({ checked, onChange, label, isDark }) => {
  const trackClasses = checked
    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
    : isDark
      ? "bg-slate-700"
      : "bg-slate-300";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 cursor-pointer ${trackClasses}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

const CookieConsentBanner: FC<CookieConsentBannerProps> = ({ onLayoutChange }) => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowModal(!storedPreferences.saved);
    onLayoutChange?.(0);
  }, [onLayoutChange]);

  useEffect(() => {
    if (!showModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  if (!preferences || !showModal) {
    return null;
  }

  const commit = (updated: CookiePreferences) => {
    setPreferences(updated);
    setShowModal(false);
    saveCookiePreferences(updated);
  };

  const handleAcceptAll = () => commit({ saved: true, functional: true, analytics: true });
  const handleEssentialOnly = () => commit({ saved: true, functional: false, analytics: false });
  const handleSavePreferences = () => commit({ ...preferences, saved: true });

  const overlayClasses = "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4";

  const modalClasses = isDark
    ? "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl sm:p-8"
    : "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8";

  const primaryText = isDark ? "text-white" : "text-slate-900";
  const secondaryText = isDark ? "text-slate-300" : "text-slate-600";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const rowBorder = isDark ? "border-white/10" : "border-slate-200";

  const categories: Array<{
    key: "functional" | "analytics";
    title: string;
    description: string;
  }> = [
    {
      key: "functional",
      title: "Functional cookies",
      description: "Remember your preferences for smoother navigation.",
    },
    {
      key: "analytics",
      title: "Analytics cookies",
      description: "Help us understand usage and improve StorySpark AI.",
    },
  ];

  return (
    <div className={overlayClasses} role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description">
      <div className={modalClasses}>
        <p className={`text-xs font-bold uppercase tracking-[0.24em] ${mutedText}`}>Cookie preferences</p>
        <h2 id="cookie-consent-title" className={`mt-1.5 text-xl font-bold tracking-tight sm:text-2xl ${primaryText}`}>
          Manage your cookie settings
        </h2>
        <p id="cookie-consent-description" className={`mt-2.5 text-sm leading-relaxed sm:text-base ${secondaryText}`}>
          StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie
          categories you want to allow, or accept all for the best experience.{" "}
          <Link
            to="/cookie-policy"
            className="font-medium text-blue-600 underline transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Learn more
          </Link>
          .
        </p>

        <div className="mt-6">
          <div className={`flex items-center justify-between border-t py-3.5 ${rowBorder}`}>
            <div className="pr-4">
              <p className={`text-sm font-bold ${primaryText}`}>Essential cookies</p>
              <p className={`mt-0.5 text-xs leading-normal ${mutedText}`}>
                Always active for secure login and basic app functionality.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
              Required
            </span>
          </div>

          {categories.map((category) => (
            <div
              key={category.key}
              className={`flex items-center justify-between border-t py-3.5 ${rowBorder}`}
            >
              <div className="pr-4">
                <p className={`text-sm font-bold ${primaryText}`}>{category.title}</p>
                <p className={`mt-0.5 text-xs leading-normal ${mutedText}`}>{category.description}</p>
              </div>
              <ToggleSwitch
                checked={preferences[category.key]}
                onChange={(checked) => setPreferences({ ...preferences, [category.key]: checked })}
                label={`Toggle ${category.title.toLowerCase()}`}
                isDark={isDark}
              />
            </div>
          ))}
          <div className={`border-t ${rowBorder}`} />
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
          >
            Accept all cookies
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className={
              isDark
                ? "w-full cursor-pointer rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs font-bold text-slate-200 transition-all duration-150 hover:bg-white/5 active:scale-[0.98]"
                : "w-full cursor-pointer rounded-xl border border-slate-200 bg-transparent px-5 py-2.5 text-xs font-bold text-slate-700 transition-all duration-150 hover:bg-slate-50 active:scale-[0.98]"
            }
          >
            Essential cookies only
          </button>
          <button
            type="button"
            onClick={handleSavePreferences}
            className={`mt-0.5 cursor-pointer text-center text-xs font-semibold underline-offset-2 transition-colors hover:underline ${mutedText}`}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
