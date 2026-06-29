import { Worker } from 'worker_threads';
import path from 'path';

class ParallelProcessor {
  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
    this.workers = [];
    this.taskQueue = [];
    this.activeCount = 0;
  }

  async processInParallel(tasks, processorFunction) {
    const results = [];
    const errors = [];

    return new Promise((resolve, reject) => {
      let completed = 0;

      const processTask = (index, task) => {
        this.activeCount++;

        processorFunction(task)
          .then((result) => {
            results[index] = result;
            completed++;
            this.activeCount--;

            if (completed === tasks.length) {
              resolve({ results, errors });
            } else if (this.taskQueue.length > 0) {
              const nextTask = this.taskQueue.shift();
              processTask(nextTask.index, nextTask.task);
            }
          })
          .catch((error) => {
            errors[index] = error;
            completed++;
            this.activeCount--;

            if (completed === tasks.length) {
              resolve({ results, errors });
            } else if (this.taskQueue.length > 0) {
              const nextTask = this.taskQueue.shift();
              processTask(nextTask.index, nextTask.task);
            }
          });
      };

      tasks.forEach((task, index) => {
        if (this.activeCount < this.maxWorkers) {
          processTask(index, task);
        } else {
          this.taskQueue.push({ index, task });
        }
      });
    });
  }

  async processBatch(items, batchSize = 5, processorFunction) {
    const batches = [];

    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    const batchResults = [];

    for (const batch of batches) {
      const { results, errors } = await this.processInParallel(
        batch,
        processorFunction
      );
      batchResults.push({ results, errors });
    }

    return batchResults.flatMap((br) => br.results);
  }

  getStats() {
    return {
      activeWorkers: this.activeCount,
      maxWorkers: this.maxWorkers,
      queuedTasks: this.taskQueue.length,
    };
  }
}

export default new ParallelProcessor();
