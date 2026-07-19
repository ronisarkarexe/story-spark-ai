import { aiCircuitBreaker } from "../app/modules/ai_model/circuit_breaker";

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
  // Fail fast if the AI provider circuit is currently open.
  aiCircuitBreaker.check();

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
        // Successful AI provider response — reset the circuit breaker.
        aiCircuitBreaker.recordSuccess();
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (externalSignal && abortHandler) {
          externalSignal.removeEventListener("abort", abortHandler);
        }
        // recordFailure() re-throws by design; it only increments the
        // breaker's counter for real provider errors (status 429/5xx),
        // so timeouts/aborts (no status) pass through without tripping it.
        try {
          aiCircuitBreaker.recordFailure(error);
        } catch {
          // side effect already applied above; rejection handled below
        }
        // Check aborted BEFORE calling abort() so we can distinguish
        // a genuine timeout (already aborted by setTimeout) from a real
        // operation error (e.g. network failure, API error).
        if (controller.signal.aborted) {
          // Timeout already fired — reject with the timeout error.
          if (timedOut) {
            reject(new GenerationTimeoutError());
          }
        } else {
          controller.abort();
          reject(error);
        }
        reject(error);
      });
  });
};
