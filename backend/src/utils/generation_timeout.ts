export class GenerationTimeoutError extends Error {
  constructor(message = "Generation timed out") {
    super(message);
    this.name = "GenerationTimeoutError";
  }
}
export class GenerationAbortedError extends Error {
  constructor(message = "Generation aborted") {
    super(message);
    this.name = "GenerationAbortedError";
  }
}
/**
 * Races generation against a timeout; aborts via AbortSignal when time expires or after completion.
 */
export const raceGenerationWithTimeout = async <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeLimitMs: number
): Promise<T> => {
  const controller = new AbortController();
  let timedOut = false;
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
      reject(new GenerationTimeoutError());
    }, timeLimitMs);
    operation(controller.signal)
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        // Check aborted BEFORE calling abort() so we can distinguish
        // a genuine timeout (already aborted by setTimeout) from a real
        // operation error (e.g. network failure, API error).
        if (controller.signal.aborted) {
          // Timeout already fired — reject with the timeout error.
        if (timedOut) {
          reject(new GenerationTimeoutError());
        } else {
          // Real error from the operation — clean up then propagate it.
          controller.abort();
          reject(error);
        }
      });
  });
};
