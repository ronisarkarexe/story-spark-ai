// Simple AI concurrency limiter — no external dependency needed
let runningAI = 0;
const MAX_AI_CONCURRENT = 3;

export const aiLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
  while (runningAI >= MAX_AI_CONCURRENT) {
    await new Promise((r) => setTimeout(r, 200));
  }
  runningAI++;
  try {
    return await fn();
  } finally {
    runningAI--;
  }
};

export const getAIConcurrencyStats = () => ({
  concurrencyLimit: MAX_AI_CONCURRENT,
  activeCount: runningAI,
  pendingCount: 0,
});