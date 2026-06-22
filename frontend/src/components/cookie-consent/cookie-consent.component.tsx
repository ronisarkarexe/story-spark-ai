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
    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
    : isDark
      ? "bg-slate-800/80 ring-1 ring-white/[0.04]"
      : "bg-slate-200 ring-1 ring-slate-300/40";

  const knobClasses = checked ? "translate-x-6" : "translate-x-0.5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-12 shrink-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${trackClasses}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${knobClasses} ${
          checked ? "scale-100" : "scale-95"
        }`}
      >
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-2.5 w-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
};

const CookieConsentBanner: FC<CookieConsentBannerProps> = ({ onLayoutChange }) => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowModal(!storedPreferences.saved);
    onLayoutChange?.(0);
  }, [onLayoutChange]);

  // Removed body scroll locking since it is now a non-blocking floating card layout

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

  const categories: Array<{
    key: "functional" | "analytics";
    title: string;
    description: string;
  }> = [
    {
      key: "functional",
      title: "Functional cookies",
      description: "Remember preferences for smoother custom navigation.",
    },
    {
      key: "analytics",
      title: "Analytics cookies",
      description: "Help us safely evaluate performance metrics to improve the platform.",
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:p-8 flex justify-center pointer-events-none"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      {/* Floating Card container */}
      <div
        className={`pointer-events-auto relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 backdrop-blur-md transition-all duration-300 ${
          isDark
            ? "border-white/[0.08] bg-slate-900/95 shadow-[0_12px_40px_rgba(2,6,23,0.6)] text-white"
            : "border-slate-200/80 bg-white/95 shadow-[0_12px_40px_rgba(148,163,184,0.15)] text-slate-900"
        }`}
      >
        {/* Subtle top organic line accent */}
        {isDark && (
          <div
            className="absolute top-0 left-10 right-10 h-px animate-pulse"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3) 50%, transparent)",
            }}
          />
        )}

        <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
          {/* Information Column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full bg-blue-500`} />
              <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Privacy Settings
              </p>
            </div>
            
            <h2 id="cookie-consent-title" className="mt-1 text-base font-bold tracking-tight">
              Cookie Preferences
            </h2>
            
            <p id="cookie-consent-description" className={`mt-1.5 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              StorySpark AI handles minor data segments to tailor an optimal creation environment. Choose what components you allow, or run with our defaults.{" "}
              <Link
                to="/cookie-policy"
                className={`font-semibold underline underline-offset-2 transition-colors ${
                  isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                }`}
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Core Action Column */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-1">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 md:w-40 cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-sm text-center"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex-1 md:w-40 cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all text-center ${
                isDark
                  ? "border-white/[0.08] hover:bg-white/[0.04] text-slate-300"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              {showAdvanced ? "Hide Options" : "Customize"}
            </button>
          </div>
        </div>

        {/* Expandable Preferences Area */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showAdvanced ? "mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="space-y-2.5">
            {/* Essential — static info */}
            <div className={`flex items-center justify-between rounded-xl p-3 ${isDark ? "bg-white/[0.02]" : "bg-slate-50"}`}>
              <div>
                <p className="text-xs font-bold">Essential Framework Layer</p>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Core authentication tokens and standard local context states.</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                Active
              </span>
            </div>

            {/* Custom Interactive Toggle loops */}
            {categories.map((category) => (
              <div key={category.key} className={`flex items-center justify-between rounded-xl p-3 border ${isDark ? "border-white/[0.04] hover:bg-white/[0.02]" : "border-slate-100 hover:bg-slate-50/50"}`}>
                <div className="pr-4">
                  <p className="text-xs font-bold">{category.title}</p>
                  <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{category.description}</p>
                </div>
                <ToggleSwitch
                  checked={preferences[category.key]}
                  onChange={(checked) => setPreferences({ ...preferences, [category.key]: checked })}
                  label={`Toggle ${category.title.toLowerCase()}`}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>

          {/* Secondary Footer Drawer Layout Actions */}
          <div className="mt-4 flex items-center justify-between gap-4 text-xs">
            <button
              type="button"
              onClick={handleEssentialOnly}
              className={`cursor-pointer underline underline-offset-4 font-medium transition-colors ${isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}
            >
              Reject secondary trackers
            </button>
            <button
              type="button"
              onClick={handleSavePreferences}
              className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-500 shadow-sm"
            >
              Confirm Choice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;