// Cache the keys outside the function so they persist between requests
let cachedKeys: string[] | null = null;
let _index = 0;

// 1. Initialize keys lazily and reuse them
function getKeys(): string[] {
  if (!cachedKeys) {
    const raw = process.env.AI_API_KEYS ?? "";

    // Parse, trim, and remove empty entries
    cachedKeys = raw
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    // Fail fast if no valid keys exist
    if (cachedKeys.length === 0) {
      throw new Error("No AI API keys configured");
    }
  }

  return cachedKeys;
}

// 2. Updated Rotation Logic
export function getNextApiKey(): string {
  const keys = getKeys();

  const key = keys[_index % keys.length];

  _index = (_index + 1) % Number.MAX_SAFE_INTEGER;

  return key;
}

// 3. Expose an explicit reload helper for the test environment
export function reloadKeys(): void {
  cachedKeys = null;
}