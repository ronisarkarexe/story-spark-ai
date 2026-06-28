interface GenerationTask {
  id: string;
  prompt: string;
  config: Record<string, any>;
  priority?: number;
}

interface GenerationResult {
  taskId: string;
  content: string;
  processingTime: number;
  success: boolean;
  error?: string;
}

interface GeneratorConfig {
  concurrency: number;
  timeout: number;
  retries: number;
}

type GeneratorFunction = (prompt: string, config: Record<string, any>) => Promise<string>;

export class ParallelStoryGenerator {
  private readonly config: GeneratorConfig;
  private generator: GeneratorFunction;
  private tasksInProgress: Map<string, Promise<GenerationResult>> = new Map();
  private activeTaskCount: number = 0;

  constructor(generator: GeneratorFunction, config: Partial<GeneratorConfig> = {}) {
    this.generator = generator;
    this.config = {
      concurrency: config.concurrency || 4,
      timeout: config.timeout || 30000,
      retries: config.retries || 2,
    };
  }

  private async generateWithTimeout(prompt: string, config: Record<string, any>): Promise<string> {
    return Promise.race([
      this.generator(prompt, config),
      new Promise<string>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout after ${this.config.timeout}ms`)),
          this.config.timeout
        )
      ),
    ]);
  }

  private async generateWithRetries(prompt: string, config: Record<string, any>): Promise<string> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        return await this.generateWithTimeout(prompt, config);
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Generation failed after retries');
  }

  async generateSingle(taskId: string, prompt: string, config: Record<string, any>): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const content = await this.generateWithRetries(prompt, config);
      const processingTime = Date.now() - startTime;

      return {
        taskId,
        content,
        processingTime,
        success: true,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      return {
        taskId,
        content: '',
        processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateParallel(tasks: GenerationTask[]): Promise<GenerationResult[]> {
    const sortedTasks = tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const queue: GenerationTask[] = [...sortedTasks];
    const results: GenerationResult[] = [];
    const activePromises: Promise<GenerationResult | void>[] = [];

    const processQueue = async (): Promise<void> => {
      while (queue.length > 0 || activePromises.length > 0) {
        while (this.activeTaskCount < this.config.concurrency && queue.length > 0) {
          const task = queue.shift()!;
          this.activeTaskCount++;

          const promise = this.generateSingle(task.id, task.prompt, task.config)
            .then((result) => {
              this.activeTaskCount--;
              results.push(result);
              return result;
            })
            .catch((error) => {
              this.activeTaskCount--;
              results.push({
                taskId: task.id,
                content: '',
                processingTime: 0,
                success: false,
                error: String(error),
              });
            });

          activePromises.push(promise);
        }

        if (activePromises.length > 0) {
          await Promise.race(activePromises);
          const completedIdx = activePromises.findIndex((p) => p);
          if (completedIdx >= 0) {
            activePromises.splice(completedIdx, 1);
          }
        }
      }
    };

    await processQueue();
    return results;
  }

  async generateWithTracking(taskId: string, prompt: string, config: Record<string, any>): Promise<GenerationResult> {
    if (this.tasksInProgress.has(taskId)) {
      return this.tasksInProgress.get(taskId) as Promise<GenerationResult>;
    }

    const resultPromise = this.generateSingle(taskId, prompt, config);
    this.tasksInProgress.set(taskId, resultPromise);

    const result = await resultPromise;
    this.tasksInProgress.delete(taskId);

    return result;
  }

  getActiveTaskCount(): number {
    return this.activeTaskCount;
  }

  getConfig(): GeneratorConfig {
    return { ...this.config };
  }

  setConcurrency(concurrency: number): void {
    if (concurrency < 1) throw new Error('Concurrency must be at least 1');
    this.config.concurrency = concurrency;
  }
}

export function createParallelGenerator(
  generator: GeneratorFunction,
  config?: Partial<GeneratorConfig>
): ParallelStoryGenerator {
  return new ParallelStoryGenerator(generator, config);
}
