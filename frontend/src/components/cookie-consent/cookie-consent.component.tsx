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
    <div ref={bannerRef} className={bannerClasses}>
      <div className="mx-auto flex max-h-[82vh] max-w-5xl flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-200/10 p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Cookie Preferences</p>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Manage your cookie settings</h2>
            <p className={`text-sm leading-6 ${secondaryText}`}>
              StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie categories you want to allow, or accept all for the best experience.
              <Link
                to="/cookie-policy"
                className="ml-1.5 text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Learn more
              </Link>
              .
            </p>

            <div className={panelClasses}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className={cardClasses}>
                  <div className="space-y-1">
                    <p className={`font-bold text-sm ${primaryText}`}>Essential Cookies</p>
                    <p className={`text-xs leading-normal ${mutedText}`}>Always active for secure login and basic app functionality.</p>
                  </div>
                  <div className="flex justify-start">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                      Required
                    </span>
                  </div>
                </div>

                <div className={cardClasses}>
                  <div className="space-y-1">
                    <p className={`font-bold text-sm ${primaryText}`}>Functional Cookies</p>
                    <p className={`text-xs leading-normal ${mutedText}`}>Enable saved preferences and smoother navigation features.</p>
                  </div>
                  <div className="flex justify-start">
                    <label className={`inline-flex items-center gap-2.5 text-xs cursor-pointer select-none group ${secondaryText}`}>
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(event) =>
                          setPreferences({ ...preferences, functional: event.target.checked })
                        }
                        className={checkboxClasses}
                      />
                      <span className={subtleLabel}>{preferences.functional ? "Active" : "Disabled"}</span>
                    </label>
                  </div>
                </div>

                <div className={`${cardClasses} sm:col-span-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                  <div className="space-y-1 max-w-xl">
                    <p className={`font-bold text-sm ${primaryText}`}>Analytics Cookies</p>
                    <p className={`text-xs leading-normal ${mutedText}`}>
                      Help us understand interface engagement data to continuously refine the StorySpark AI ecosystem module suite paths.
                    </p>
                  </div>
                  <div className="flex justify-start shrink-0">
                    <label className={`inline-flex items-center gap-2.5 text-xs cursor-pointer select-none group ${secondaryText}`}>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(event) =>
                          setPreferences({ ...preferences, analytics: event.target.checked })
                        }
                        className={checkboxClasses}
                      />
                      <span className={subtleLabel}>{preferences.analytics ? "Active" : "Disabled"}</span>
                    </label>
                  </div>
                </div>
              </div>
              <ToggleSwitch
                checked={preferences[category.key]}
                onChange={(checked) => setPreferences({ ...preferences, [category.key]: checked })}
                label={`Toggle ${category.title.toLowerCase()}`}
                isDark={isDark}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 xl:w-[280px] shrink-0 xl:pt-11 w-full">
            <button
              onClick={handleAcceptAll}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/10 transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
            >
              Accept all cookies
            </button>
            <button onClick={handleSave} className={actionButtonClasses}>
              Save preferences
            </button>
            <button
              onClick={handleRejectNonEssential}
              className={
                isDark
                  ? "w-full rounded-xl border border-slate-200/10 dark:border-white/10 bg-slate-950 px-5 py-3 text-xs font-bold text-slate-400 transition-all duration-150 hover:text-white hover:bg-slate-900 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
                  : "w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition-all duration-150 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
              }
            >
              Reject non-essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

