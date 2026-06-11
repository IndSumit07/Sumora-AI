import Redis from "ioredis";

/**
 * Redis client for caching, session state, and rate limiting.
 * Connection is configured via environment variables.
 */
export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

/**
 * Gracefully close the Redis connection.
 */
export async function closeRedis() {
  await redis.quit();
}

// ── Cache Key Helpers ───────────────────────────────────────────────────────

export const CACHE_KEYS = {
  user: (userId) => `user:${userId}`,
  userTokens: (userId) => `user:tokens:${userId}`,
  reportsList: (userId, page, limit) => `reports:list:${userId}:${page}:${limit}`,
  reportById: (reportId) => `report:${reportId}`,
  interviewsList: (userId, mode, page, limit) =>
    `interviews:list:${userId}:${mode || "all"}:${page}:${limit}`,
  interviewById: (interviewId) => `interview:${interviewId}`,
  aiReport: (hash) => `ai:report:${hash}`,
  aiFeedback: (hash) => `ai:feedback:${hash}`,
  blacklist: (token) => `blacklist:${token}`,
  rateLimit: (key) => `ratelimit:${key}`,
};

// ── Cache TTLs (seconds) ────────────────────────────────────────────────────

export const CACHE_TTL = {
  USER: 300, // 5 minutes
  USER_TOKENS: 60, // 1 minute
  REPORTS_LIST: 120, // 2 minutes
  REPORT: 300, // 5 minutes
  INTERVIEWS_LIST: 120, // 2 minutes
  INTERVIEW: 300, // 5 minutes
  AI_REPORT: 600, // 10 minutes
  AI_FEEDBACK: 600, // 10 minutes
  BLACKLIST: 86400, // 24 hours
};

// ── Core Cache Operations ───────────────────────────────────────────────────

/**
 * Get a cached value. Returns null on miss or Redis error.
 */
export async function cacheGet(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet(key, value, ttlSeconds) {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a cached key.
 */
export async function cacheDel(key) {
  try {
    await redis.del(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern (uses SCAN + DEL).
 */
export async function cacheDelPattern(pattern) {
  try {
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const keys = [];
    stream.on("data", (foundKeys) => keys.push(...foundKeys));
    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });
    if (keys.length) await redis.del(...keys);
    return keys.length;
  } catch {
    return 0;
  }
}

/**
 * Wrapper: try cache first, else run fetcher and cache result.
 */
export async function cacheOrFetch(key, ttlSeconds, fetcher) {
  const cached = await cacheGet(key);
  if (cached !== null) return cached;

  const result = await fetcher();
  if (result !== null && result !== undefined) {
    await cacheSet(key, result, ttlSeconds);
  }
  return result;
}

/**
 * Invalidate all user-related caches.
 */
export async function invalidateUserCache(userId) {
  await Promise.all([
    cacheDel(CACHE_KEYS.user(userId)),
    cacheDel(CACHE_KEYS.userTokens(userId)),
    cacheDelPattern(`reports:list:${userId}:*`),
    cacheDelPattern(`interviews:list:${userId}:*`),
  ]);
}
