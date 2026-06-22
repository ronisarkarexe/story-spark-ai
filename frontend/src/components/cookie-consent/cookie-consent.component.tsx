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
    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
    : isDark
      ? "bg-slate-800/80 ring-1 ring-white/[0.06]"
      : "bg-slate-200 ring-1 ring-slate-300/50";

  const knobClasses = checked
    ? "translate-x-7"
    : "translate-x-0.5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-14 shrink-0 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${trackClasses}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${knobClasses} ${
          checked
            ? "shadow-indigo-500/30 scale-100"
            : "shadow-black/10 scale-95"
        }`}
      >
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 sm:p-8 ${
          isDark
            ? "border-white/[0.06] bg-[#0b1120] shadow-slate-950/60"
            : "border-slate-200 bg-white shadow-slate-200/60"
        }`}
      >
        {/* Ambient glow — matches site dark theme design language */}
        {isDark && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-20 opacity-30"
              style={{
                background: `radial-gradient(ellipse 65% 50% at 50% 0%, rgba(56, 108, 220, 0.25) 0%, rgba(79, 70, 229, 0.08) 45%, transparent 75%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-[15%] right-[15%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(99,130,255,0.25) 35%, rgba(139,92,246,0.15) 65%, transparent 100%)",
              }}
            />
          </>
        )}

        <div className="relative z-10">
          {/* Header */}
          <p
            className={`text-xs font-bold uppercase tracking-[0.2em] ${
              isDark ? "text-blue-400/70" : "text-slate-500"
            }`}
          >
            Cookie preferences
          </p>
          <h2
            id="cookie-consent-title"
            className={`mt-1.5 text-xl font-bold tracking-tight sm:text-2xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Manage your cookie settings
          </h2>
          <p
            id="cookie-consent-description"
            className={`mt-2.5 text-sm leading-relaxed sm:text-base ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie
            categories you want to allow, or accept all for the best experience.{" "}
            <Link
              to="/cookie-policy"
              className={`font-medium underline transition-colors ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Learn more
            </Link>
            .
          </p>

          {/* Cookie categories */}
          <div className="mt-6 space-y-1">
            {/* Essential — always on */}
            <div
              className={`flex items-center justify-between rounded-xl p-3.5 sm:p-4 ${
                isDark
                  ? "bg-white/[0.03] border border-white/[0.04]"
                  : "bg-slate-50 border border-slate-100"
              }`}
            >
              <div className="pr-4 min-w-0">
                <p
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Essential cookies
                </p>
                <p
                  className={`mt-0.5 text-xs leading-normal ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Always active for secure login and basic app functionality.
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isDark
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-emerald-600/20 bg-emerald-50 text-emerald-700"
                }`}
              >
                Required
              </span>
            </div>

            {/* Toggle categories */}
            {categories.map((category) => (
              <div
                key={category.key}
                className={`flex items-center justify-between rounded-xl p-3.5 sm:p-4 transition-colors ${
                  isDark
                    ? "bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04]"
                    : "bg-white border border-slate-100 hover:bg-slate-50/50"
                }`}
              >
                <div className="pr-4 min-w-0">
                  <p
                    className={`text-sm font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {category.title}
                  </p>
                  <p
                    className={`mt-0.5 text-xs leading-normal ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {category.description}
                  </p>
                </div>
                <ToggleSwitch
                  checked={preferences[category.key]}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, [category.key]: checked })
                  }
                  label={`Toggle ${category.title.toLowerCase()}`}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="group relative w-full cursor-pointer overflow-hidden rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-150 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500" />
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                }}
              />
              <span className="relative z-10">Accept all cookies</span>
            </button>
            <button
              type="button"
              onClick={handleEssentialOnly}
              className={`w-full cursor-pointer rounded-xl border px-5 py-2.5 text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isDark
                  ? "border-white/[0.08] text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.12]"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Essential cookies only
            </button>
            <button
              type="button"
              onClick={handleSavePreferences}
              className={`mt-0.5 cursor-pointer text-center text-xs font-semibold underline-offset-2 transition-colors hover:underline ${
                isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Save preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
