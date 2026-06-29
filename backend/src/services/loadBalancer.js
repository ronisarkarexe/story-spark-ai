class LoadBalancer {
  constructor(workerCount = 4) {
    this.workers = Array.from({ length: workerCount }, (_, i) => ({
      id: i,
      load: 0,
      activeRequests: 0,
      totalProcessed: 0,
      averageTime: 0,
    }));
    this.requestLog = [];
  }

  getNextWorker() {
    return this.workers.reduce((min, worker) =>
      worker.load < min.load ? worker : min
    );
  }

  assignRequest(requestId, estimatedTime = 1000) {
    const worker = this.getNextWorker();
    worker.load += estimatedTime;
    worker.activeRequests++;
    this.requestLog.push({ requestId, workerId: worker.id, timestamp: Date.now() });
    return worker.id;
  }

  completeRequest(requestId, actualTime) {
    const log = this.requestLog.find((l) => l.requestId === requestId);
    if (log) {
      const worker = this.workers[log.workerId];
      worker.load = Math.max(0, worker.load - actualTime);
      worker.activeRequests--;
      worker.totalProcessed++;

      worker.averageTime =
        (worker.averageTime * (worker.totalProcessed - 1) + actualTime) /
        worker.totalProcessed;
    }
  }

  getStats() {
    const totalLoad = this.workers.reduce((sum, w) => sum + w.load, 0);
    const averageLoad = totalLoad / this.workers.length;

    return {
      workers: this.workers.map((w) => ({
        id: w.id,
        load: w.load,
        activeRequests: w.activeRequests,
        utilization: (w.load / (60 * 1000)) * 100,
        averageTime: w.averageTime.toFixed(2),
      })),
      totalLoad,
      averageLoad,
      balanceRatio: Math.max(...this.workers.map((w) => w.load)) /
        (Math.min(...this.workers.map((w) => w.load)) || 1),
    };
  }

  reset() {
    this.workers.forEach((w) => {
      w.load = 0;
      w.activeRequests = 0;
    });
    this.requestLog = [];
  }
}

export default new LoadBalancer();
