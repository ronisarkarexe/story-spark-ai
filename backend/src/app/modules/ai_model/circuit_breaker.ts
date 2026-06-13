export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private threshold: number;
  private cooldownMs: number;

  constructor(threshold = 5, cooldownMs = 60000) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
  }

  public check() {
    if (this.failures >= this.threshold) {
      if (Date.now() - this.lastFailureTime < this.cooldownMs) {
        const error: any = new Error("AI API Circuit Breaker open: Too many failures");
        error.status = 503;
        throw error;
      } else {
        // Half-open: try again
        this.failures = this.threshold - 1;
      }
    }
  }

  public recordFailure(error: any) {
    const status = error?.status || error?.response?.status;
    if (status === 429 || status >= 500) {
      this.failures++;
      this.lastFailureTime = Date.now();
    }
    throw error;
  }

  public recordSuccess() {
    this.failures = 0;
  }
}

export const aiCircuitBreaker = new CircuitBreaker();
