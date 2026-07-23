/**
 * Lightweight frontend logging wrapper.
 *
 * debug/info are stripped from production builds (based on Vite's
 * import.meta.env.DEV) so internal state, prompts, and socket flow details
 * never leak to the browser console in production. warn/error always pass
 * through since they're operationally useful and don't leak flow details.
 *
 * Swap the warn/error bodies for a Sentry (or similar) call here later
 * without touching call sites elsewhere in the app.
 */
const isDev = import.meta.env.DEV;

const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};

export default logger;