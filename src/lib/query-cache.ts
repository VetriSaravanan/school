/**
 * SUPABASE QUERY CACHE
 * --------------------
 * Simple TTL-based in-memory cache that de-duplicates Supabase queries.
 *
 * Problem: site_settings is fetched 5+ times on the homepage (Navbar,
 * Footer, FloatingButtons, ReachUs, __root). This layer ensures each
 * unique query only hits the network once, then serves from cache for
 * the configured TTL.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

/** Default TTL: 5 minutes */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Execute `fetchFn` with caching and in-flight deduplication.
 *
 * @param key   Unique cache key, e.g. "site_settings" or "gallery_images"
 * @param fetchFn  Async function that performs the actual Supabase query
 * @param ttlMs   Time-to-live in milliseconds (default 5 min)
 */
export async function cachedQuery<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> {
  // 1. Check cache
  const cached = store.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // 2. Check in-flight
  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  // 3. Fetch fresh
  const promise = fetchFn()
    .then((data) => {
      store.set(key, { data, expiresAt: Date.now() + ttlMs });
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/**
 * Invalidate a specific cache entry.
 * Call this after mutations (e.g. admin saves) so the next read is fresh.
 */
export function invalidateQuery(key: string): void {
  store.delete(key);
}

/**
 * Invalidate all cache entries.
 * Useful after admin bulk operations.
 */
export function invalidateAll(): void {
  store.clear();
}

/**
 * Pre-warm common queries at app startup.
 * Fires in background — does not block rendering.
 */
export function prewarmQueries(queries: Array<{ key: string; fn: () => Promise<unknown> }>) {
  for (const q of queries) {
    cachedQuery(q.key, q.fn).catch(() => {
      /* swallow — prewarm is best-effort */
    });
  }
}
