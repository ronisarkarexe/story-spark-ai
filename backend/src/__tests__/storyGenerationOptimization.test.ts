import { StoryGenerationCache } from '../services/storyGenerationCache';
import { ParallelStoryGenerator } from '../services/parallelStoryGenerator';
import { GenerationPerformanceMonitor } from '../services/generationPerformanceMonitor';

describe('Story Generation Optimization', () => {
  describe('StoryGenerationCache', () => {
    let cache: StoryGenerationCache;

    beforeEach(() => {
      cache = new StoryGenerationCache();
    });

    test('should cache and retrieve story generation results', () => {
      const prompt = 'Once upon a time';
      const config = { style: 'fantasy' };
      const content = 'A long time ago in a galaxy far away...';

      cache.set(prompt, content, config, 1000);
      const cached = cache.get(prompt, config);

      expect(cached).toBeTruthy();
      expect(cached?.content).toBe(content);
    });

    test('should differentiate cache entries by prompt and config', () => {
      const prompt = 'Once upon a time';
      const config1 = { style: 'fantasy' };
      const config2 = { style: 'sci-fi' };
      const content1 = 'Fantasy story...';
      const content2 = 'Sci-fi story...';

      cache.set(prompt, content1, config1, 1000);
      cache.set(prompt, content2, config2, 1000);

      expect(cache.get(prompt, config1)?.content).toBe(content1);
      expect(cache.get(prompt, config2)?.content).toBe(content2);
    });

    test('should check cache existence without retrieving', () => {
      const prompt = 'Story prompt';
      const config = { style: 'drama' };
      const content = 'Drama content...';

      cache.set(prompt, content, config, 1000);

      expect(cache.has(prompt, config)).toBe(true);
      expect(cache.has(prompt, { style: 'comedy' })).toBe(false);
    });

    test('should invalidate cache entries', () => {
      const prompt = 'Story prompt';
      const config = { style: 'horror' };
      const content = 'Scary story...';

      cache.set(prompt, content, config, 1000);
      expect(cache.has(prompt, config)).toBe(true);

      cache.invalidate(prompt, config);
      expect(cache.has(prompt, config)).toBe(false);
    });

    test('should clear all cache entries', () => {
      cache.set('Prompt 1', 'Content 1', {}, 500);
      cache.set('Prompt 2', 'Content 2', {}, 500);

      cache.clear();
      expect(cache.getSize()).toBe(0);
    });

    test('should track cache hit and miss statistics', () => {
      const prompt = 'Test prompt';
      const config = {};

      cache.set(prompt, 'Content', config, 500);
      cache.get(prompt, config);
      cache.get(prompt, config);
      cache.get(prompt, { different: true });

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    test('should respect max cache size', () => {
      const smallCache = new StoryGenerationCache({ maxCacheSize: 3 });

      for (let i = 0; i < 5; i++) {
        smallCache.set(`Prompt ${i}`, `Content ${i}`, {}, 500);
      }

      expect(smallCache.getSize()).toBeLessThanOrEqual(3);
    });

    test('should warm up cache with initial entries', () => {
      cache.warmUp([
        { prompt: 'P1', config: { s: 1 }, content: 'C1', processingTime: 500 },
        { prompt: 'P2', config: { s: 2 }, content: 'C2', processingTime: 600 },
      ]);

      expect(cache.has('P1', { s: 1 })).toBe(true);
      expect(cache.has('P2', { s: 2 })).toBe(true);
    });

    test('should return entry metadata with creation time', () => {
      const prompt = 'Test';
      cache.set(prompt, 'Content', {}, 1000);
      const entry = cache.get(prompt, {});

      expect(entry?.metadata.createdAt).toBeTruthy();
      expect(entry?.metadata.processingTime).toBe(1000);
      expect(entry?.metadata.prompt).toBe('Test');
    });
  });

  describe('ParallelStoryGenerator', () => {
    let generator: ParallelStoryGenerator;
    const mockGeneratorFn = jest.fn(async (prompt: string) => `Generated: ${prompt}`);

    beforeEach(() => {
      mockGeneratorFn.mockClear();
      generator = new ParallelStoryGenerator(mockGeneratorFn, {
        concurrency: 2,
        timeout: 5000,
        retries: 1,
      });
    });

    test('should generate story for single task', async () => {
      mockGeneratorFn.mockResolvedValue('Story content');
      const result = await generator.generateSingle('task-1', 'Prompt', {});

      expect(result.taskId).toBe('task-1');
      expect(result.content).toBe('Story content');
      expect(result.success).toBe(true);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    test('should handle generation errors gracefully', async () => {
      mockGeneratorFn.mockRejectedValue(new Error('Generation failed'));
      const result = await generator.generateSingle('task-1', 'Prompt', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('Generation failed');
    });

    test('should generate multiple tasks in parallel', async () => {
      mockGeneratorFn.mockImplementation(
        (prompt: string) => new Promise((resolve) => {
          setTimeout(() => resolve(`Generated: ${prompt}`), 100);
        })
      );

      const tasks = [
        { id: 'task-1', prompt: 'Prompt 1', config: {} },
        { id: 'task-2', prompt: 'Prompt 2', config: {} },
        { id: 'task-3', prompt: 'Prompt 3', config: {} },
      ];

      const results = await generator.generateParallel(tasks);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
      expect(mockGeneratorFn).toHaveBeenCalledTimes(3);
    });

    test('should respect priority when generating parallel tasks', async () => {
      const callOrder: string[] = [];
      mockGeneratorFn.mockImplementation((prompt: string) => {
        callOrder.push(prompt);
        return Promise.resolve(`Generated: ${prompt}`);
      });

      const tasks = [
        { id: 'low', prompt: 'Low priority', config: {}, priority: 1 },
        { id: 'high', prompt: 'High priority', config: {}, priority: 10 },
      ];

      await generator.generateParallel(tasks);

      expect(callOrder[0]).toContain('High');
    });

    test('should respect concurrency limit', async () => {
      let maxConcurrent = 0;
      let currentConcurrent = 0;

      mockGeneratorFn.mockImplementation(() => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        return new Promise((resolve) => {
          setTimeout(() => {
            currentConcurrent--;
            resolve('Content');
          }, 50);
        });
      });

      const tasks = Array.from({ length: 8 }, (_, i) => ({
        id: `task-${i}`,
        prompt: `Prompt ${i}`,
        config: {},
      }));

      await generator.generateParallel(tasks);

      expect(maxConcurrent).toBeLessThanOrEqual(2);
    });

    test('should retry on failure and eventually succeed', async () => {
      let attempts = 0;
      mockGeneratorFn.mockImplementation(async () => {
        attempts++;
        if (attempts < 2) throw new Error('Temporary failure');
        return 'Success';
      });

      const result = await generator.generateSingle('task-1', 'Prompt', {});

      expect(result.success).toBe(true);
      expect(attempts).toBe(2);
    });

    test('should track active task count', async () => {
      mockGeneratorFn.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve('Content'), 100);
      }));

      const promise = generator.generateWithTracking('task-1', 'Prompt', {});

      expect(generator.getActiveTaskCount()).toBe(1);
      await promise;
      expect(generator.getActiveTaskCount()).toBe(0);
    });

    test('should reuse ongoing generation task', async () => {
      mockGeneratorFn.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve('Content'), 100);
      }));

      const promise1 = generator.generateWithTracking('task-1', 'Prompt', {});
      const promise2 = generator.generateWithTracking('task-1', 'Prompt', {});

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1.taskId).toBe(result2.taskId);
      expect(mockGeneratorFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('GenerationPerformanceMonitor', () => {
    let monitor: GenerationPerformanceMonitor;

    beforeEach(() => {
      monitor = new GenerationPerformanceMonitor();
    });

    test('should record and calculate performance metrics', () => {
      monitor.recordGeneration('task-1', 1000, true, false);
      monitor.recordGeneration('task-2', 1200, true, true);
      monitor.recordGeneration('task-3', 800, false, false);

      const metrics = monitor.getMetrics();

      expect(metrics.totalGenerations).toBe(3);
      expect(metrics.successfulGenerations).toBe(2);
      expect(metrics.failedGenerations).toBe(1);
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.cacheMisses).toBe(2);
    });

    test('should calculate cache hit rate', () => {
      for (let i = 0; i < 10; i++) {
        monitor.recordGeneration(`task-${i}`, 500, true, i < 7);
      }

      const metrics = monitor.getMetrics();
      expect(metrics.cacheHitRate).toBe(70);
    });

    test('should calculate percentile processing times', () => {
      const times = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      times.forEach((time, idx) => {
        monitor.recordGeneration(`task-${idx}`, time, true, false);
      });

      const metrics = monitor.getMetrics();

      expect(metrics.p95ProcessingTime).toBeLessThanOrEqual(1000);
      expect(metrics.p99ProcessingTime).toBeLessThanOrEqual(1000);
      expect(metrics.minProcessingTime).toBe(100);
      expect(metrics.maxProcessingTime).toBe(1000);
    });

    test('should get metrics since specific timestamp', async () => {
      monitor.recordGeneration('task-1', 500, true, false);

      await new Promise((resolve) => setTimeout(resolve, 10));
      const laterTime = Date.now();

      monitor.recordGeneration('task-2', 600, true, false);

      const recentMetrics = monitor.getMetricsSince(laterTime);

      expect(recentMetrics.totalGenerations).toBe(1);
    });

    test('should reset metrics', () => {
      monitor.recordGeneration('task-1', 500, true, false);
      expect(monitor.getMetrics().totalGenerations).toBe(1);

      monitor.reset();
      expect(monitor.getMetrics().totalGenerations).toBe(0);
    });

    test('should provide detailed metrics with error rate', () => {
      monitor.recordGeneration('task-1', 500, true, false);
      monitor.recordGeneration('task-2', 600, false, false);
      monitor.recordGeneration('task-3', 700, true, false);

      const detailed = monitor.getDetailedMetrics();

      expect(detailed.summary.totalGenerations).toBe(3);
      expect(detailed.errorRate).toBeCloseTo(33.33, 1);
      expect(detailed.recentRecords.length).toBeLessThanOrEqual(100);
    });
  });
});
