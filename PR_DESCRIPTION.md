### PR Title
**feat: Implement GSSoC Bookmarks with LocalStorage Fallback & Fix Application Crash Loops**

### PR Description
**Summary of Changes**
This PR stabilizes both the frontend and backend of the Story Spark AI application so it can be reliably run locally, introduces robust database-disconnected "degraded mode" behavior, and implements the GSSoC requested Favorites/Bookmarking system. 

**Features Implemented**
- **Offline/Degraded Bookmarking:** The Bookmarks (`Favorites`) system has been fully implemented across all UI components (Story cards, Posts, Details). If the backend or MongoDB is offline, it intelligently fails over to browser `localStorage`, ensuring zero loss of functionality for the user.
- **Favorites Dashboard:** Added a new `Favorites` menu in the user dashboard that aggregates and merges stories from the backend database with offline saved stories.
- **Environment Bootstrapping:** Provided a comprehensive `backend/.env.example` template with correct variables.

**Bug Fixes**
- **Fatal Blank Screen Fix:** Removed duplicated `<App />` and provider trees in `main.tsx` which caused React Router v6 to fatally crash and render a blank white screen.
- **Database Crash Fix:** Replaced hard `process.exit(1)` in backend `server.ts` with graceful connection timeouts (`serverSelectionTimeoutMS`). The backend now runs in "degraded mode" instead of shutting down if MongoDB is missing.
- **Rate Limiter Lockout Fix:** Fixed the MongoDB-backed rate limiter (`rate_limit.store.ts`) to "fail open" rather than locking users out of the entire frontend when the database is offline.
- **Unhandled Redis Exceptions:** Wrapped Redis initializations and silenced `ECONNREFUSED` crashes on Windows environments.
- **TypeScript & Import Fixes:** Scaffolded a missing `Character.model.ts`, stripped incorrect hallucinated imports, and patched missing `@types` ensuring that `npm run typecheck` succeeds in the backend.

**Screenshots**
*(Add screenshots of the Favorites page and the Bookmark toggle here)*

**Testing Performed**
- Verified the backend gracefully starts and accepts requests with and without an active MongoDB connection.
- Verified frontend mounts cleanly without `react-router` exceptions.
- Tested bookmarking functionality in both "online API" mode and "offline localStorage" mode.
- Verified `npm run typecheck` for the backend workspace successfully builds.

**Checklist**
- [x] My code follows the existing project structure and conventions.
- [x] I have removed all debugging code, console logs, and temporary fixes.
- [x] I have verified the frontend and backend run successfully locally.
- [x] I have documented new environment variables in `.env.example`.
- [x] I have verified the new features do not break existing functionality.
