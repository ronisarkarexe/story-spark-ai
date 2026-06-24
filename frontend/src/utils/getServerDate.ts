/**
 * Fetches the current UTC date string from a trusted time API.
 * Falls back to the local system clock if the request fails
 * (still documents the limitation in the fallback comment).
 */
export const getServerDateString = async (): Promise<string> => {
  try {
    const response = await fetch(
      "https://worldtimeapi.org/api/timezone/Etc/UTC",
      { signal: AbortSignal.timeout(4000) } // 4s timeout so it never hangs
    );

    if (!response.ok) throw new Error("Time API responded with error");

    const data = await response.json();
    // data.datetime is ISO string e.g. "2026-06-24T10:30:00.000000+00:00"
    const serverDate = new Date(data.datetime);
    return serverDate.toDateString(); // e.g. "Wed Jun 24 2026"
  } catch {
    // Fallback: use local clock — known limitation, logged for transparency
    console.warn(
      "[ReadingStreak] Could not fetch server time. Falling back to local clock. Streak may be manipulable."
    );
    return new Date().toDateString();
  }
};