import crypto from 'crypto';

interface CacheEntry {
  content: string;
  metadata: {
    createdAt: number;
    processingTime: number;
    prompt: string;
  };
}

interface CacheConfig {
  stdTTL: number;
  maxCacheSize: number;
}

export class StoryGenerationCache {
  private cache: Map<string, { entry: CacheEntry; expiresAt: number }> = new Map();
  private readonly config: CacheConfig;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      stdTTL: config.stdTTL || 3600,
      maxCacheSize: config.maxCacheSize || 1000,
    };

    setInterval(() => this.pruneExpired(), Math.max(1000, this.config.stdTTL * 100));
  }

  private generateCacheKey(prompt: string, config: Record<string, any>): string {
    const data = JSON.stringify({ prompt, config });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private pruneExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  set(prompt: string, content: string, config: Record<string, any>, processingTime: number): void {
    if (this.cache.size >= this.config.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    const key = this.generateCacheKey(prompt, config);
    const entry: CacheEntry = {
      content,
      metadata: {
        createdAt: Date.now(),
        processingTime,
        prompt,
      },
    };

    this.cache.set(key, {
      entry,
      expiresAt: Date.now() + this.config.stdTTL * 1000,
    });
  }

  get(prompt: string, config: Record<string, any>): CacheEntry | undefined {
    const key = this.generateCacheKey(prompt, config);
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      this.cacheHits++;
      return cached.entry;
    }

    if (cached) this.cache.delete(key);
    this.cacheMisses++;
    return undefined;
  }

  has(prompt: string, config: Record<string, any>): boolean {
    const key = this.generateCacheKey(prompt, config);
    const cached = this.cache.get(key);
    return cached ? cached.expiresAt > Date.now() : false;
  }

  invalidate(prompt: string, config: Record<string, any>): boolean {
    const key = this.generateCacheKey(prompt, config);
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  getStats() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    return {
      keys: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: hitRate.toFixed(2) + '%',
    };
  }

  getSize(): number {
    return this.cache.size;
  }
}

export const storyGenerationCache = new StoryGenerationCache({
  stdTTL: 3600,
  maxCacheSize: 1000,
});
