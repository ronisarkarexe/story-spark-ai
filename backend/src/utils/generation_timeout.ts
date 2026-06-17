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
  timeLimitMs: number,
  externalSignal?: AbortSignal
): Promise<T> => {
  const controller = new AbortController();
  let timedOut = false;

  return new Promise<T>((resolve, reject) => {
    let abortHandler: (() => void) | null = null;

    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
        reject(new GenerationAbortedError());
        return;
      }
      abortHandler = () => {
        controller.abort();
        reject(new GenerationAbortedError());
      };
      externalSignal.addEventListener("abort", abortHandler);
    }

    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
      if (externalSignal && abortHandler) {
        externalSignal.removeEventListener("abort", abortHandler);
      }
      reject(new GenerationTimeoutError());
    }, timeLimitMs);

    operation(controller.signal)
      .then((result) => {
        clearTimeout(timeoutId);
        if (externalSignal && abortHandler) {
          externalSignal.removeEventListener("abort", abortHandler);
        }
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
