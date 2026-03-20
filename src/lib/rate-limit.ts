const store = new Map<string, { count: number; resetAt: number }>();

type RateResult = { allowed: true } | { allowed: false; retryAfterMs: number };

/**
 * @param key    - Usually the client IP
 * @param limit  - Max attempts per window (default: 5)
 * @param window - Time window in ms (default: 1 minute)
 */
export function checkRate(key: string, limit = 5, window = 60_000): RateResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + window });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
}
