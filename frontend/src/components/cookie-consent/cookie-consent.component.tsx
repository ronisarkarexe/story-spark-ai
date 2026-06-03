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

const CookieConsentBanner: FC = () => {
  const { isDark } = useTheme();
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
    <div className={`fixed inset-x-0 bottom-0 z-50 border-t py-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 max-h-[70vh] overflow-y-auto ${isDark ? 'bg-slate-950/95 border-slate-200/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="space-y-1">
            <p className={`text-xs font-bold uppercase tracking-[0.24em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cookie Preferences</p>
            <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Manage your cookie settings</h2>
          </div>
          
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie categories you want to allow, or accept all for the best experience.
            <Link to="/cookie-policy" className="ml-1.5 text-blue-500 underline font-medium hover:text-blue-600 transition-colors">Learn more</Link>.
          </p>

          <div className={`rounded-xl border p-3 sm:p-4 ${isDark ? 'border-slate-200/10 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={`rounded-lg border p-3 flex flex-col justify-between gap-3 ${isDark ? 'border-slate-200/10 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                <div className="space-y-1">
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Essential Cookies</p>
                  <p className={`text-xs leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Always active for secure login and basic app functionality.</p>
                </div>
                <div className="flex justify-start">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-500/20">Required</span>
                </div>
              </div>

              <div className={`rounded-lg border p-3 flex flex-col justify-between gap-3 ${isDark ? 'border-slate-200/10 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                <div className="space-y-1">
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Functional Cookies</p>
                  <p className={`text-xs leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Enable saved preferences and smoother navigation features.</p>
                </div>
                <div className="flex justify-start">
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                      className={`h-4 w-4 rounded transition-colors cursor-pointer ${isDark ? 'border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/30' : 'border-slate-300 bg-white text-blue-600 focus:ring-blue-500/30'}`}
                    />
                    <span className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md transition-colors ${isDark ? 'bg-slate-800 text-slate-400 group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'}`}>
                      {preferences.functional ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>

              <div className={`rounded-lg border p-3 sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isDark ? 'border-slate-200/10 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                <div className="space-y-1 max-w-xl">
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytics Cookies</p>
                  <p className={`text-xs leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Help us understand interface engagement data to continuously refine the StorySpark AI ecosystem.</p>
                </div>
                <div className="flex justify-start shrink-0">
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                      className={`h-4 w-4 rounded transition-colors cursor-pointer ${isDark ? 'border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/30' : 'border-slate-300 bg-white text-blue-600 focus:ring-blue-500/30'}`}
                    />
                    <span className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md transition-colors ${isDark ? 'bg-slate-800 text-slate-400 group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'}`}>
                      {preferences.analytics ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:w-[240px] shrink-0 xl:pt-8 w-full">
          <button
            onClick={handleAcceptAll}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/10 transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider"
          >
            Accept all cookies
          </button>
          <button
            onClick={handleSave}
            className={`w-full rounded-lg border px-4 py-2.5 text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider ${isDark ? 'border-slate-200/10 bg-slate-900 text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
          >
            Save preferences
          </button>
          <button
            onClick={handleRejectNonEssential}
            className={`w-full rounded-lg border px-4 py-2.5 text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer text-center uppercase tracking-wider ${isDark ? 'border-slate-200/10 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
