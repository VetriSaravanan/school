/**
 * IMAGE CACHE & OPTIMIZATION LAYER
 * ---------------------------------
 * In-memory LRU cache for Supabase Storage images.
 * – Stores downloaded blobs as objectURLs for instant re-renders
 * – Provides Supabase image transform URLs for server-side resizing
 * – Preloads critical images (hero, logo) on app boot
 */

/* ============ LRU CACHE ============ */
const MAX_CACHE_SIZE = 120;

interface CacheEntry {
  objectUrl: string;
  lastUsed: number;
  size: number; // approximate byte size for memory tracking
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

/** Evict least-recently-used entries when cache exceeds MAX */
function evictIfNeeded() {
  if (cache.size <= MAX_CACHE_SIZE) return;
  const entries = [...cache.entries()].sort((a, b) => a[1].lastUsed - b[1].lastUsed);
  const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE);
  for (const [key, entry] of toRemove) {
    URL.revokeObjectURL(entry.objectUrl);
    cache.delete(key);
  }
}

/* ============ SUPABASE IMAGE TRANSFORMS ============ */

/**
 * Generates an optimized image URL using Supabase Storage Image Transformations.
 * Converts: .../object/public/bucket/path
 *      to:  .../render/image/public/bucket/path?width=W&quality=Q
 *
 * Falls back to original URL if not a Supabase storage URL.
 */
export function getOptimizedUrl(
  url: string,
  width: number = 800,
  quality: number = 75,
): string {
  if (!url) return url;

  // Only transform Supabase storage URLs
  if (!url.includes("supabase.co/storage/v1/object/public/")) {
    return url;
  }

  // Replace /object/public/ with /render/image/public/ and append transforms
  const transformed = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/",
  );

  const separator = transformed.includes("?") ? "&" : "?";
  return `${transformed}${separator}width=${width}&quality=${quality}&resize=contain`;
}

/* ============ PRELOAD + CACHE ============ */

/**
 * Preloads an image and stores the blob in the LRU cache.
 * Returns the cached objectURL (or the original URL on failure).
 * De-duplicates in-flight requests to the same URL.
 */
export function preloadImage(url: string, width?: number): Promise<string> {
  if (!url) return Promise.resolve(url);

  const optimizedUrl = width ? getOptimizedUrl(url, width) : url;
  const cacheKey = optimizedUrl;

  // Already cached
  const existing = cache.get(cacheKey);
  if (existing) {
    existing.lastUsed = Date.now();
    return Promise.resolve(existing.objectUrl);
  }

  // Already in-flight
  const pending = inflight.get(cacheKey);
  if (pending) return pending;

  const promise = fetch(optimizedUrl, { mode: "cors" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      cache.set(cacheKey, {
        objectUrl,
        lastUsed: Date.now(),
        size: blob.size,
      });
      evictIfNeeded();
      return objectUrl;
    })
    .catch(() => {
      // On failure, return original URL — image will still render, just slower
      return optimizedUrl;
    })
    .finally(() => {
      inflight.delete(cacheKey);
    });

  inflight.set(cacheKey, promise);
  return promise;
}

/**
 * Returns the cached objectURL if available, otherwise the optimized URL.
 * Does NOT trigger a fetch — use preloadImage for that.
 */
export function getCachedUrl(url: string, width?: number): string {
  if (!url) return url;
  const optimizedUrl = width ? getOptimizedUrl(url, width) : url;
  const entry = cache.get(optimizedUrl);
  if (entry) {
    entry.lastUsed = Date.now();
    return entry.objectUrl;
  }
  return optimizedUrl;
}

/**
 * Preloads an array of image URLs in the background.
 * Used for batch-preloading gallery thumbnails, blog covers, etc.
 */
export function preloadImages(urls: string[], width?: number): void {
  for (const url of urls) {
    if (url) preloadImage(url, width);
  }
}

/** Returns current cache size for debugging */
export function getCacheStats() {
  let totalSize = 0;
  for (const entry of cache.values()) {
    totalSize += entry.size;
  }
  return {
    entries: cache.size,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
  };
}
