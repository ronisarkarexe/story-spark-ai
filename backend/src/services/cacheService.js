const crypto = require('crypto');

class CacheService {
  constructor(ttl = 3600) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  generateKey(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  set(key, value) {
    this.cache.set(key, { value, expiry: Date.now() + (this.ttl * 1000) });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = new CacheService();
