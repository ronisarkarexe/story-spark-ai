import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";

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

const CookieConsentBanner: FC = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowBanner(!storedPreferences.saved);
  }, []);

  if (!preferences || !showBanner) {
    return null;
  }

  const handleSave = () => {
    const updated = { ...preferences, saved: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

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

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-200/10 dark:border-white/10 py-6 shadow-2xl backdrop-blur-xl text-white transition-colors duration-300 max-h-[85vh] overflow-y-auto sidebar">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
        <div className="max-w-3xl space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Cookie Preferences</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Manage your cookie settings</h2>
          </div>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie categories you want to allow, or accept all for the best experience.
            <Link to="/cookie-policy" className="ml-1.5 text-blue-400 underline font-medium hover:text-blue-300 transition-colors">Learn more</Link>.
          </p>

          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-slate-900/40 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/10 dark:border-white/5 bg-slate-950/60 p-4 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-white">Essential Cookies</p>
                  <p className="text-xs text-slate-400 leading-normal">Always active for secure login and basic app functionality.</p>
                </div>
                <div className="flex justify-start">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">Required</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/10 dark:border-white/5 bg-slate-950/60 p-4 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-white">Functional Cookies</p>
                  <p className="text-xs text-slate-400 leading-normal">Enable saved preferences and smoother navigation features.</p>
                </div>
                <div className="flex justify-start">
                  <label className="inline-flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/30 transition-colors cursor-pointer"
                    />
                    <span className="font-semibold uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 group-hover:text-white transition-colors">
                      {preferences.functional ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/10 dark:border-white/5 bg-slate-950/60 p-4 sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <p className="font-bold text-sm text-white">Analytics Cookies</p>
                  <p className="text-xs text-slate-400 leading-normal">Help us understand interface engagement data to continuously refine the StorySpark AI ecosystem module suite paths.</p>
                </div>
                <div className="flex justify-start shrink-0">
                  <label className="inline-flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/30 transition-colors cursor-pointer"
                    />
                    <span className="font-semibold uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 group-hover:text-white transition-colors">
                      {preferences.analytics ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 xl:w-[280px] shrink-0 xl:pt-11 w-full">
          <button
            onClick={handleAcceptAll}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/10 transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
          >
            Accept all cookies
          </button>
          <button
            onClick={handleSave}
            className="w-full rounded-xl border border-slate-200/10 dark:border-white/10 bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-all duration-150 hover:bg-slate-800 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
          >
            Save preferences
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="w-full rounded-xl border border-slate-200/10 dark:border-white/10 bg-slate-950 px-5 py-3 text-xs font-bold text-slate-400 transition-all duration-150 hover:text-white hover:bg-slate-900 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
          >
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
