interface Bucket {
  count: number;
  resetAt: number;
}

const globalForLimiter = globalThis as unknown as {
  __snRateLimit?: Map<string, Bucket>;
};

const buckets =
  globalForLimiter.__snRateLimit ??
  (globalForLimiter.__snRateLimit = new Map<string, Bucket>());

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Small in-memory rate limiter. It protects a single server instance, which is
 * useful for self-hosted VPS deployments. On multi-instance serverless, swap
 * this for Upstash Redis or a similar shared store.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: 0,
  };
}

export function getRequestKey(identifier: string) {
  return identifier.trim().toLowerCase().slice(0, 200);
}
