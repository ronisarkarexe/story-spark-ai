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

  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new GenerationTimeoutError());
    }, timeLimitMs);

    operation(controller.signal)
      .then((result) => {
        clearTimeout(timeoutId);
        controller.abort();
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        controller.abort();
        if (controller.signal.aborted) {
          reject(new GenerationTimeoutError());
          return;
        }
        reject(error);
      });
  });
};
