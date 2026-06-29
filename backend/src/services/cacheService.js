import crypto from 'crypto';

class CacheService {
  constructor(ttlSeconds = 3600) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  generateCacheKey(prompt, params = {}) {
    const keyData = JSON.stringify({ prompt, params });
    return crypto.createHash('sha256').update(keyData).digest('hex');
  }

  set(key, value, ttlSeconds = null) {
    const expiryTime = Date.now() + (ttlSeconds ? ttlSeconds * 1000 : this.ttl);
    this.cache.set(key, {
      value,
      expiryTime,
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiryTime) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  cleanup() {
    const now = Date.now();
    let deleted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiryTime) {
        this.cache.delete(key);
        deleted++;
      }
    }

    return deleted;
  }
}

export default new CacheService();
