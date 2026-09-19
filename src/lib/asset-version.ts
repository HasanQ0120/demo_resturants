import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-only. Do not import this from a "use client" file.
 *
 * Next's image optimizer caches each optimized variant on disk for `minimumCacheTTL`
 * (4 hours by default) keyed by the request URL — NOT by the source file's content. If a
 * client replaces a /public image while keeping the same filename (the expected workflow
 * for this template — see README "Customizing for a client"), visitors can keep seeing the
 * old image for up to 4 hours.
 *
 * `withVersion()` appends the file's last-modified time as a query string, so a swapped file
 * gets a new URL and is optimized fresh immediately, instead of waiting out that cache.
 */
export function assetVersion(publicPath: string): string {
  try {
    const abs = join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    return String(statSync(abs).mtimeMs);
  } catch {
    return ""; // missing file — the caller's own onError fallback handles this
  }
}

export function withVersion(publicPath: string): string {
  const v = assetVersion(publicPath);
  return v ? `${publicPath}?v=${v}` : publicPath;
}
