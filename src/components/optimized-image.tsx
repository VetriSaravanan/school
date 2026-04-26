/**
 * OPTIMIZED IMAGE COMPONENT
 * -------------------------
 * Drop-in replacement for <img> that provides:
 *  1. IntersectionObserver-based lazy loading
 *  2. Supabase image transform for server-side resize
 *  3. In-memory blob caching for instant re-renders
 *  4. Animated shimmer placeholder while loading
 *  5. Smooth fade-in on load
 *  6. Optional eager mode for above-the-fold images
 */

import { useEffect, useRef, useState, memo } from "react";
import { getOptimizedUrl, preloadImage, getCachedUrl } from "@/lib/image-cache";

interface OptimizedImageProps {
  src: string;
  alt: string;
  /** Desired display width — used for Supabase image transforms. Default 800. */
  width?: number;
  /** CSS class applied to the wrapper div */
  className?: string;
  /** CSS class applied to the <img> element itself */
  imgClassName?: string;
  /** Inline styles on the <img> */
  style?: React.CSSProperties;
  /** If true, loads immediately (for hero/logo). Default false (lazy). */
  eager?: boolean;
  /** Callback when image finishes loading */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Callback on error */
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /** IntersectionObserver rootMargin. Default "200px" to preload slightly before viewport. */
  rootMargin?: string;
  /** Quality for Supabase transform, 1-100. Default 75. */
  quality?: number;
  /** If true, skip optimization (use raw URL). Useful for tiny images like favicons. */
  raw?: boolean;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 800,
  className = "",
  imgClassName = "",
  style,
  eager = false,
  onLoad,
  onError,
  rootMargin = "300px",
  quality = 75,
  raw = false,
}: OptimizedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [shouldLoad, setShouldLoad] = useState(eager);

  // Get the display URL (cached blob or optimized URL)
  const displayUrl = raw ? src : getOptimizedUrl(src, width, quality);

  // Check cache immediately for already-cached images
  useEffect(() => {
    if (!src) return;

    if (raw) {
      setImgSrc(src);
      if (eager) setShouldLoad(true);
      return;
    }

    const cached = getCachedUrl(src, width);
    if (cached !== displayUrl) {
      // We have a blob URL in cache — use it immediately
      setImgSrc(cached);
      setLoaded(true);
      setShouldLoad(true);
    } else if (eager) {
      // Eager: start loading now
      preloadImage(src, width).then((url) => {
        setImgSrc(url);
      });
      setShouldLoad(true);
    }
  }, [src, width, eager, displayUrl, raw]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (shouldLoad || eager || !containerRef.current) return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad, eager, rootMargin]);

  // When shouldLoad becomes true (via IO or eager), start fetching
  useEffect(() => {
    if (!shouldLoad || !src || imgSrc) return;

    if (raw) {
      setImgSrc(src);
      return;
    }

    // Try cache first, then preload
    const cached = getCachedUrl(src, width);
    if (cached !== displayUrl) {
      setImgSrc(cached);
      setLoaded(true);
    } else {
      preloadImage(src, width).then((url) => {
        setImgSrc(url);
      });
    }
  }, [shouldLoad, src, width, displayUrl, imgSrc, raw]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback: try original URL if optimized URL fails
    if (imgSrc !== src && !raw) {
      setImgSrc(src);
    }
    onError?.(e);
  };

  return (
    <div ref={containerRef} className={`opt-img-wrapper ${className}`}>
      {/* Shimmer placeholder — visible while image is loading */}
      {!loaded && <div className="opt-img-shimmer" aria-hidden />}

      {/* Actual image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`opt-img ${loaded ? "opt-img-loaded" : "opt-img-loading"} ${imgClassName}`}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          // Native lazy fallback for browsers without IO
          loading={eager ? "eager" : "lazy"}
          // Hint for browser to prioritize above-the-fold images
          {...(eager ? { fetchPriority: "high" as const } : {})}
        />
      )}
    </div>
  );
});
