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

const saveCookiePreferences = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
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
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-700 py-5 shadow-2xl backdrop-blur-xl text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Cookie Preferences</p>
          <h2 className="text-2xl font-semibold text-white">Manage your cookie settings</h2>
          <p className="text-slate-300 leading-7">
            StorySpark AI uses cookies to keep the experience secure and smooth. Select which cookie categories you want to allow, or accept all for the best experience.
            <Link to="/cookie-policy" className="ml-1 text-blue-300 underline hover:text-blue-200">Learn more</Link>.
          </p>
          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">Essential Cookies</p>
                    <p className="text-sm text-slate-400">Always active for secure login and basic app functionality.</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Required</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">Functional Cookies</p>
                    <p className="text-sm text-slate-400">Enable saved preferences and smoother navigation.</p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                      className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-blue-400 focus:ring-blue-400"
                    />
                    <span>{preferences.functional ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">Analytics Cookies</p>
                    <p className="text-sm text-slate-400">Help us understand usage and improve StorySpark AI.</p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                      className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-blue-400 focus:ring-blue-400"
                    />
                    <span>{preferences.analytics ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 xl:w-[320px]">
          <button
            onClick={handleAcceptAll}
            className="rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-indigo-400"
          >
            Accept all cookies
          </button>
          <button
            onClick={handleSave}
            className="rounded-3xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500"
          >
            Save preferences
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="rounded-3xl border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
          >
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;