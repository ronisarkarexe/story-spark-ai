class ParallelProcessor {
  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
    this.activeCount = 0;
    this.queue = [];
  }

  async processInParallel(tasks) {
    const results = [];
    for (const task of tasks) {
      results.push(this.execute(task));
    }
    return Promise.all(results);
  }

  async execute(task) {
    while (this.activeCount >= this.maxWorkers) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this.activeCount++;
    try {
      return await task();
    } finally {
      this.activeCount--;
    }
  }

  async processBatch(items, processor, batchSize = 10) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const processed = await this.processInParallel(batch.map(item => () => processor(item)));
      results.push(...processed);
    }
    return results;
  }
}

module.exports = new ParallelProcessor();
